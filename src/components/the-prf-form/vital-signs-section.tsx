"use client";

import React from "react";
import { useForm, useFieldArray, FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, Loader2, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useUpdatePrf } from "@/hooks/prf/useUpdatePrf";
import { PRF_FORM } from "@/interfaces/prf-form";
import {
  VitalSignsSchema,
  VitalSignsType,
} from "@/interfaces/prf-vital-signs-schema";
import { z } from "zod";
import { useZuStandEmployeeStore } from "@/lib/zuStand/employee";

// Big measures
const VitalSignsSchemaWithData = z.object({
  vital_signs: VitalSignsSchema,
});
type VitalSignsTypeWithData = z.infer<typeof VitalSignsSchemaWithData>;
//

const VitalSignsForm: React.FC = () => {
  const prfId = usePathname().split("/")[2];
  const prf_from_store = useStore((state) => state.prfForms).find(
    (prf) => prf.prfFormId == prfId,
  );

  const updatePrfQuery = useUpdatePrf();
  const router = useRouter();

  const { zsEmployee } = useZuStandEmployeeStore();

  const form = useForm<VitalSignsTypeWithData>({
    resolver: zodResolver(VitalSignsSchemaWithData),
    defaultValues: {
      vital_signs: prf_from_store?.prfData?.vital_signs?.data || undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "vital_signs",
  });

  function onSubmit(values: VitalSignsTypeWithData) {
    if (!zsEmployee) { // no needed .. just for building
      return;
    }
    const prfUpdateValue: PRF_FORM = {
      prfFormId: prfId,
      prfData: {
        ...prf_from_store?.prfData,
        vital_signs: {
          data: values.vital_signs,
          isCompleted: true,
          isOptional: false,
        },
      },
      EmployeeID: zsEmployee.id || "2", // fallback
    };

    updatePrfQuery.mutate(prfUpdateValue, {
      onSuccess: (data) => {
        toast.success("Vital Signs Updated", {
          duration: 3000,
          position: "top-right",
        });
        router.push(`/edit-prf/${prfId}`);
      },
      onError: (error) => {
        toast.error("An error occurred", {
          duration: 3000,
          position: "top-right",
        });
      },
    });
  }

  // Add this function to handle form errors
  const onError = (errors: any) => {
    const errorMessages = Object.entries(errors)
      .map(([_, error]: [string, any]) => error?.message)
      .filter(Boolean);

    const errorMessage =
      errorMessages[0] || "Please fill in all required fields";

    toast.error(errorMessage, {
      duration: 3000,
      position: "top-right",
    });
  };

  return (
    <Accordion
      type="single"
      defaultValue="vital-signs"
      collapsible
      className="w-full"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="flex flex-col space-y-8"
        >
          <div className="flex items-center justify-between">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Vital Signs
            </h3>
          </div>
          <AccordionItem value="vital-signs">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  Object.keys(form.formState.errors).length > 0,
              })}
            >
              <h4
                className={cn(
                  "col-span-full scroll-m-20 text-lg font-semibold tracking-tight",
                  {
                    "text-destructive":
                      Object.keys(form.formState.errors).length > 0,
                  },
                )}
              >
                Vital Signs Entries
              </h4>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Entry {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <FormField
                      control={form.control}
                      name={
                        `vital_signs.${index}.time` as FieldPath<VitalSignsTypeWithData>
                      }
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input
                              onFocus={(e) => console.log(e.target.value)}
                              type="time"
                              {...field}
                              value={
                                field.value !== null &&
                                  field.value !== undefined
                                  ? field.value?.toString()
                                  : new Date().toLocaleTimeString("en-US", {
                                    hour12: false,
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={
                        `vital_signs.${index}.airEntry.left` as FieldPath<VitalSignsTypeWithData>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Air Entry (Left)</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value as string | undefined}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="✓" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Normal (✓)
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="↓" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Reduced (↓)
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="x" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Absent (x)
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={
                        `vital_signs.${index}.airEntry.right` as FieldPath<VitalSignsTypeWithData>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Air Entry (Right)</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value as string | undefined}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="✓" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Normal (✓)
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="↓" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Reduced (↓)
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="x" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Absent (x)
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={
                        `vital_signs.${index}.etCO2` as FieldPath<VitalSignsTypeWithData>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>EtCO2</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value as number | undefined}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={
                        `vital_signs.${index}.fiO2` as FieldPath<VitalSignsTypeWithData>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>FiO2</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value as number | undefined}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={
                        `vital_signs.${index}.rate` as FieldPath<VitalSignsTypeWithData>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rate</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value as number | undefined}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={
                        `vital_signs.${index}.rhythm` as FieldPath<VitalSignsTypeWithData>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rhythm</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={
                                field.value !== null ||
                                  field.value !== undefined
                                  ? field.value?.toString()
                                  : ""
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={
                        `vital_signs.${index}.spO2` as FieldPath<VitalSignsTypeWithData>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SpO2</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value as number | undefined}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={
                        `vital_signs.${index}.bloodPressure` as FieldPath<VitalSignsTypeWithData>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Pressure</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={
                                field.value !== null ||
                                  field.value !== undefined
                                  ? field.value?.toString()
                                  : ""
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={
                        `vital_signs.${index}.ecgAnalysis` as FieldPath<VitalSignsTypeWithData>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ECG Analysis</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={
                                field.value !== null ||
                                  field.value !== undefined
                                  ? field.value?.toString()
                                  : ""
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={
                        `vital_signs.${index}.heartRate` as FieldPath<VitalSignsTypeWithData>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Heart Rate</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value as number | undefined}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={
                        `vital_signs.${index}.perfusion` as FieldPath<VitalSignsTypeWithData>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Perfusion</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Perfusion" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Good">Good</SelectItem>
                                <SelectItem value="Poor">Poor</SelectItem>
                                <SelectItem value="Absent">Absent</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={
                        `vital_signs.${index}.gcsAvpu` as FieldPath<VitalSignsTypeWithData>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GCS/AVPU</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value as string | undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select GCS/AVPU" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="V">V</SelectItem>
                              <SelectItem value="P">P</SelectItem>
                              <SelectItem value="U">U</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={
                        `vital_signs.${index}.glucose` as FieldPath<VitalSignsTypeWithData>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Glucose</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value as number | undefined}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : null,
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={
                        `vital_signs.${index}.painScore` as FieldPath<VitalSignsTypeWithData>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pain Score (0-10)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              {...field}
                              value={field.value as number | undefined}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : null,
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={
                        `vital_signs.${index}.pupilReaction.left` as FieldPath<VitalSignsTypeWithData>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pupil Reaction (Left)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value as string | undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select reaction" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Normal">Normal</SelectItem>
                              <SelectItem value="Sluggish">Sluggish</SelectItem>
                              <SelectItem value="Non-reactive">
                                Non-reactive
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={
                        `vital_signs.${index}.pupilReaction.right` as FieldPath<VitalSignsTypeWithData>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pupil Reaction (Right)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value as string | undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select reaction" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Normal">Normal</SelectItem>
                              <SelectItem value="Sluggish">Sluggish</SelectItem>
                              <SelectItem value="Non-reactive">
                                Non-reactive
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={
                        `vital_signs.${index}.pupilSize.left` as FieldPath<VitalSignsTypeWithData>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pupil Size (Left)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={
                                field.value !== null ||
                                  field.value !== undefined
                                  ? field.value?.toString()
                                  : ""
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={
                        `vital_signs.${index}.pupilSize.right` as FieldPath<VitalSignsTypeWithData>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pupil Size (Right)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={
                                field.value !== null ||
                                  field.value !== undefined
                                  ? field.value?.toString()
                                  : ""
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={
                        `vital_signs.${index}.temperature` as FieldPath<VitalSignsTypeWithData>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Temperature</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              {...field}
                              value={field.value as number | undefined}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : null,
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              ))}
              {fields.length === 0 && (
                <Alert className="border-blue-500 text-blue-500">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No entries available. Please add a minimum of 3 entries.
                  </AlertDescription>
                </Alert>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() =>
                  append({
                    airEntry: { left: undefined, right: undefined },
                    etCO2: 0,
                    fiO2: 0,
                    rate: 0,
                    rhythm: "",
                    spO2: 0,
                    bloodPressure: "",
                    ecgAnalysis: "",
                    heartRate: 0,
                    perfusion: "",
                    gcsAvpu: "",
                    glucose: null,
                    painScore: null,
                    pupilReaction: { left: "Normal", right: "Normal" },
                    pupilSize: { left: "", right: "" },
                    temperature: null,
                    time: `${new Date().getHours()}:${new Date().getMinutes()}`,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add Entry
              </Button>
            </AccordionContent>
          </AccordionItem>
          <Button
            type="submit"
            disabled={!form.formState.isDirty}
            className="self-end"
          >
            {form.formState.isSubmitting || updatePrfQuery.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
              </>
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </Form>
    </Accordion>
  );
};

export default VitalSignsForm;
