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
import { Loader2, Plus, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useUpdatePrf } from "@/hooks/prf/useUpdatePrf";
import { PRF_FORM } from "@/interfaces/prf-form";
import { toast } from "sonner";
import {
  MedicationAdministeredSchema,
  MedicationAdministeredType,
} from "@/interfaces/prf-schema";

export default function MedicationAdministeredForm() {
  const prfId = usePathname().split("/")[2];
  const prf_from_store = useStore((state) => state.prfForms).find(
    (prf) => prf.prfFormId == prfId,
  );

  const updatePrfQuery = useUpdatePrf();
  const router = useRouter();
  const form = useForm<MedicationAdministeredType>({
    resolver: zodResolver(MedicationAdministeredSchema),
    defaultValues: prf_from_store?.prfData?.medication_administration?.data || {
      medications: [
        {
          medicine: "",
          dose: "",
          route: "",
          time: "",
          hpcsa: "",
          name: "", // TODO:Prefill with currently logged in user's name and signature if they are adminisration the medication
          signature: "",
        },
      ],
      consultation: {
        consulted: false,
        practitioner: "",
        hpcsa: "",
        summaryOfConsult: "",
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medications",
  });

  function onSubmit(values: MedicationAdministeredType) {
    const prfUpdateValue: PRF_FORM = {
      prfFormId: prfId,
      prfData: {
        ...prf_from_store?.prfData,
        medication_administration: {
          data: values,
          isCompleted: true,
          isOptional: false,
        },
      },
    };

    updatePrfQuery.mutate(prfUpdateValue, {
      onSuccess: (data) => {
        toast.success("Medication Administered Information Updated", {
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
      defaultValue="medication-administered"
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
              Medication Administered
            </h3>
          </div>
          <AccordionItem value="medication-administered">
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
                Medication Details
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
                      form.formState.errors?.medications?.[index],
                  })}
                >
                  <div className="flex flex-row items-center justify-start space-x-1 rounded-md">
                    <h5
                      className={cn({
                        "font-bold": true,
                        "text-destructive":
                          form.formState.errors?.medications?.[index],
                      })}
                    >
                      Medication Entry {index + 1}
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
                  <div className="grid gap-3 pb-4 sm:grid-cols-3 lg:grid-cols-7">
                    {[
                      "medicine",
                      "dose",
                      "route",
                      "time",
                      "hpcsa",
                      "name",
                      "signature",
                    ].map((fieldName) => (
                      <FormField
                        key={fieldName}
                        control={form.control}
                        name={
                          `medications.${index}.${fieldName}` as FieldPath<MedicationAdministeredType>
                        }
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {fieldName.charAt(0).toUpperCase() +
                                fieldName.slice(1)}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={
                                  field.value === null
                                    ? ""
                                    : field.value?.toString()
                                }
                              />
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
                    medicine: "",
                    dose: "",
                    route: "",
                    time: "",
                    hpcsa: "",
                    name: "",
                    signature: "",
                  })
                }
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Medication
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="consultation">
            <AccordionTrigger>Consultation</AccordionTrigger>
            <AccordionContent className="space-y-4 p-3">
              <FormField
                control={form.control}
                name="consultation.consulted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Consulted</FormLabel>
                  </FormItem>
                )}
              />
              {form.watch("consultation.consulted") && (
                <>
                  <FormField
                    control={form.control}
                    name="consultation.practitioner"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Practitioner</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="consultation.hpcsa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>HPCSA</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="consultation.summaryOfConsult"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Summary of Consult</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
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
}
