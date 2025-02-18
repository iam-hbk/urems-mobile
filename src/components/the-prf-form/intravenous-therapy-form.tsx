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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useUpdatePrf } from "@/hooks/prf/useUpdatePrf";
import { PRF_FORM } from "@/interfaces/prf-form";
import { toast } from "sonner";
import { IntravenousTherapySchema } from "@/interfaces/prf-schema";
import { useZuStandEmployeeStore } from "@/lib/zuStand/employee";

export type IntravenousTherapyType = z.infer<typeof IntravenousTherapySchema>;

export default function IntravenousTherapyForm() {
  const prfId = usePathname().split("/")[2];
  const prf_from_store = useStore((state) => state.prfForms).find(
    (prf) => prf.prfFormId == prfId,
  );

  const { zsEmployee } = useZuStandEmployeeStore();
  const updatePrfQuery = useUpdatePrf();
  const router = useRouter();
  const form = useForm<IntravenousTherapyType>({
    resolver: zodResolver(IntravenousTherapySchema),
    defaultValues: prf_from_store?.prfData?.intravenous_therapy?.data || {
      therapyDetails: [
        {
          fluid: "",
          volume: "",
          admin: "",
          rate: "",
          time: "",
          jelco: "",
          site: "",
          volumeAdministered: "",
        },
      ],
      motivationForIV: {
        drugRoute: false,
        fluidBolus: false,
        p1Unstable: false,
      },
      weight: "",
      pawperTape: false,
      broselowTape: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "therapyDetails",
  });

  function onSubmit(values: IntravenousTherapyType) {

    if (!zsEmployee) {
      toast.error("No Employee Information Found", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

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
      EmployeeID: zsEmployee.employeeNumber.toString()
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
          <AccordionItem value="intravenous-therapy">
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
                Intravenous Therapy Details
              </h4>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={cn({
                    "flex w-full flex-col rounded-md border px-4 transition-all delay-100 hover:border-primary":
                      true,
                    "border-destructive":
                      form.formState.errors?.therapyDetails?.[index],
                  })}
                >
                  <div className="flex flex-row items-center justify-start space-x-1 rounded-md">
                    <h5
                      className={cn({
                        "font-bold": true,
                        "text-destructive":
                          form.formState.errors?.therapyDetails?.[index],
                      })}
                    >
                      Therapy Entry {index + 1}
                    </h5>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 pb-4 sm:grid-cols-4 lg:grid-cols-8">
                    {[
                      "fluid",
                      "volume",
                      "admin",
                      "rate",
                      "time",
                      "jelco",
                      "site",
                      "volumeAdministered",
                    ].map((fieldName) => (
                      <FormField
                        key={fieldName}
                        control={form.control}
                        name={
                          `therapyDetails.${index}.${fieldName}` as FieldPath<IntravenousTherapyType>
                        }
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {fieldName.charAt(0).toUpperCase() +
                                fieldName.slice(1)}
                            </FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value as string} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  append({
                    fluid: "",
                    volume: "",
                    admin: "",
                    rate: "",
                    time: "",
                    jelco: "",
                    site: "",
                    volumeAdministered: "",
                  })
                }
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Therapy
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="motivation">
            <AccordionTrigger>Motivation for IV</AccordionTrigger>
            <AccordionContent className="space-y-4">
              {["drugRoute", "fluidBolus", "p1Unstable"].map((fieldName) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={
                    `motivationForIV.${fieldName}` as FieldPath<IntravenousTherapyType>
                  }
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value as boolean}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="capitalize">
                        {fieldName.replace(/([A-Z])/g, " $1").trim()}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
          <div className="flex flex-row items-end space-x-4 lg:flex">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem className="max-w-xs">
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      className="max-w-24"
                      placeholder="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="my-4 flex w-fit space-x-4">
              <FormField
                control={form.control}
                name="pawperTape"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>PAWPER Tape</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="broselowTape"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Broselow Tape</FormLabel>
                  </FormItem>
                )}
              />
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
