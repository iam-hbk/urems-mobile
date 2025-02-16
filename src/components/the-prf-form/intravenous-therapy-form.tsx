"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, FieldPath } from "react-hook-form";
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
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Loader2, Plus, Trash2, X, AlertCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useUpdatePrf } from "@/hooks/prf/useUpdatePrf";
import { PRF_FORM } from "@/interfaces/prf-form";
import { toast } from "sonner";
import { IntravenousTherapySchema } from "@/interfaces/prf-schema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type IntravenousTherapyType = z.infer<typeof IntravenousTherapySchema>;

export default function IntravenousTherapyForm() {
  const prfId = usePathname().split("/")[2];
  const prf_from_store = useStore((state) => state.prfForms).find(
    (prf) => prf.prfFormId == prfId,
  );

  const updatePrfQuery = useUpdatePrf();
  const router = useRouter();
  const form = useForm<IntravenousTherapyType>({
    resolver: zodResolver(IntravenousTherapySchema),
    defaultValues: prf_from_store?.prfData?.intravenous_therapy?.data || {
      therapyDetails: [
        {
          fluid: "",
          volume: "",
          admin: "10dropper",
          rate: "",
          time: "",
          jelco: "20G",
          site: "",
          volumeAdministered: "",
        },
      ],
      motivationForIV: {
        drugRoute: false,
        fluidBolus: false,
        p1Unstable: false,
        p1Stable: false,
      },
      weight: "",
      weightMeasurementType: "estimated",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "therapyDetails",
  });

  function onSubmit(values: IntravenousTherapyType) {
    const prfUpdateValue: PRF_FORM = {
      prfFormId: prfId,
      prfData: {
        ...prf_from_store?.prfData,
        intravenous_therapy: {
          data: values,
          isCompleted: true,
          isOptional: false,
        },
      },
      EmployeeID: prf_from_store?.EmployeeID || "P123456",
    };

    updatePrfQuery.mutate(prfUpdateValue, {
      onSuccess: (data) => {
        toast.success("Intravenous Therapy Information Updated", {
          duration: 3000,
          position: "top-right",
        });
        router.push(`/edit-prf/${data?.prfFormId}`);
      },
      onError: (error) => {
        toast.error("An error occurred", {
          duration: 3000,
          position: "top-right",
        });
      },
    });
  }

  return (
    <Accordion
      type="single"
      defaultValue="intravenous-therapy"
      collapsible
      className="w-full"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-8"
        >
          <div className="flex items-center justify-between">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Intravenous Therapy
            </h3>
          </div>

          {/* Weight Section */}
          <div className="rounded-lg border p-4 shadow-sm">
            <h4 className="mb-4 text-lg font-medium">Patient Weight</h4>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="weightMeasurementType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="estimated" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Estimated Weight
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="pawper" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            PAWPER Tape (South African Standard)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="broselow" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Broselow Tape (American Standard)
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
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch("weightMeasurementType") === "estimated"
                        ? "Estimated Weight (kg)"
                        : "Measured Weight (kg)"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="max-w-[120px]"
                        placeholder="0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Motivation for IV Section */}
          <div className="rounded-lg border p-4 shadow-sm">
            <h4 className="mb-4 text-lg font-medium">Reason for IV Access</h4>
            <div className="space-y-2">
              {["drugRoute", "fluidBolus", "p1Unstable", "p1Stable"].map(
                (fieldName) => (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={
                      `motivationForIV.${fieldName}` as FieldPath<IntravenousTherapyType>
                    }
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {fieldName === "drugRoute" &&
                            "Drug Administration Route"}
                          {fieldName === "fluidBolus" && "Fluid Bolus Required"}
                          {fieldName === "p1Unstable" && "P1 Unstable Patient"}
                          {fieldName === "p1Stable" && "P1 Stable Patient"}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ),
              )}
            </div>
          </div>

          {/* IV Therapy Details Section */}
          <div className="rounded-lg border p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-medium">IV Therapy Details</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    fluid: "",
                    volume: "",
                    admin: "10dropper",
                    rate: "",
                    time: "",
                    jelco: "20G",
                    site: "",
                    volumeAdministered: "",
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add Entry
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={cn("rounded-md border p-4 transition-all", {
                    "border-destructive":
                      form.formState.errors?.therapyDetails?.[index],
                  })}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h5 className="font-medium">Entry {index + 1}</h5>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="h-8 w-8 p-0 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { name: "fluid", label: "IV Fluid Type", type: "text" },
                      { name: "volume", label: "Volume (ml)", type: "text" },
                      {
                        name: "admin",
                        label: "Administration Set",
                        type: "select",
                        options: [
                          { value: "10dropper", label: "10 Dropper" },
                          { value: "20dropper", label: "20 Dropper" },
                          { value: "60dropper", label: "60 Dropper" },
                          { value: "extensionSet", label: "Extension Set" },
                          { value: "buretteSet", label: "Burette Set" },
                          {
                            value: "bloodAdminSet",
                            label: "Blood Admin Set (High Cap)",
                          },
                        ],
                      },
                      { name: "rate", label: "Rate", type: "text" },
                      { name: "time", label: "Time", type: "text" },
                      {
                        name: "jelco",
                        label: "Jelco Size",
                        type: "select",
                        options: [
                          { value: "14G", label: "14G" },
                          { value: "16G", label: "16G" },
                          { value: "18G", label: "18G" },
                          { value: "20G", label: "20G" },
                          { value: "22G", label: "22G" },
                          { value: "24G", label: "24G" },
                        ],
                        tooltip: "Note: These values are placeholders pending confirmation"
                      },
                      { name: "site", label: "Insertion Site", type: "text" },
                      {
                        name: "volumeAdministered",
                        label: "Volume Given (ml)",
                        type: "text",
                      },
                    ].map(({ name, label, type, options, tooltip }) => (
                      <FormField
                        key={name}
                        control={form.control}
                        name={
                          `therapyDetails.${index}.${name}` as FieldPath<IntravenousTherapyType>
                        }
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm flex items-center gap-2">
                              {label}
                              {tooltip && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{tooltip}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </FormLabel>
                            <FormControl>
                              {type === "select" ? (
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value as string}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {options?.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input
                                  {...field}
                                  value={field.value as string}
                                  className="w-full"
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

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
}
