"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useUpdatePrf } from "@/hooks/prf/useUpdatePrf";
import { PRF_FORM } from "@/interfaces/prf-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { cn } from "@/lib/utils";
import { useZuStandEmployeeStore } from "@/lib/zuStand/employee";

const RespiratoryDistressSchema = z.object({
  hx: z.array(
    z.enum([
      "Asthma",
      "COPD",
      "Emphysema",
      "Hx of Pulmonary Emboli",
      "Lung Cancer",
      "Prone to Chest Infections / Pneumonia",
      "Pulmonary TB",
      "COVID +",
    ]),
  ),
  riskFactorsForPulmEmbolus: z.array(
    z.enum([
      "Taking Contraceptives",
      "Hx of DVTs",
      "Recent: Long Distance Travel",
      "Fracture",
      "Recently given birth",
    ]),
  ),
  additionalFindings: z.array(
    z.enum([
      "Accessory Muscles Use",
      "Audible Wheezes",
      "Audible Stridor",
      "Apnea",
      "On Home O2",
      "Coughing: Wet",
      "Coughing: Dry",
      "Dyspnoea Not Relieved by Prescribed Medication",
      "Guards Depth of Breathing",
      "Hyperventilation",
      "Inability to Talk",
      "Kussmaul",
      "Recent Flu",
      "Severe Drooling",
      "Signs of Respiratory Fatigue",
      "Soot in Mouth",
      "Tachypnoea",
      "Tripod Position",
      "Talks in Phrases",
      "Uses Single Words Only",
    ]),
  ),
  infant: z.array(
    z.enum([
      "Chest Recession",
      "Grunting",
      "Irritable",
      "Prem Baby: Respiratory Distress Syndrome",
      "Congenital Abnormality",
      "Hyaline Membrane Disease",
    ]),
  ),
});

type RespiratoryDistressType = z.infer<typeof RespiratoryDistressSchema>;

export default function RespiratoryDistressAssessmentForm() {
  const prfId = usePathname().split("/")[2];
  const prf_from_store = useStore((state) => state.prfForms).find(
    (prf) => prf.prfFormId == prfId,
  );

  const { zsEmployee } = useZuStandEmployeeStore();

  const updatePrfQuery = useUpdatePrf();
  const router = useRouter();

  const form = useForm<RespiratoryDistressType>({
    resolver: zodResolver(RespiratoryDistressSchema),
    defaultValues: prf_from_store?.prfData?.respiratory_distress?.data || {
      hx: [],
      riskFactorsForPulmEmbolus: [],
      additionalFindings: [],
      infant: [],
    },
  });

  function onSubmit(values: RespiratoryDistressType) {

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
        respiratory_distress: {
          data: values,
          isCompleted: true,
          isOptional: false,
        },
      },
      EmployeeID: zsEmployee.employeeNumber.toString()
    };

    updatePrfQuery.mutate(prfUpdateValue, {
      onSuccess: (data) => {
        toast.success("Respiratory Distress Assessment Updated", {
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
    <Form {...form}>
      <Accordion type="single" collapsible defaultValue="hx">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Respiratory Distress Assessment
            </div>
          </div>
          <AccordionItem value="hx">
            <AccordionTrigger
              className={cn({
                "text-destructive": form.formState.errors.hx,
                "p-2": true,
              })}
            >
              HX
            </AccordionTrigger>
            <FormField
              control={form.control}
              name="hx"
              render={() => (
                <FormItem>
                  <AccordionContent className="grid grid-cols-2 gap-3 p-3 lg:grid-cols-3">
                    {[
                      "Asthma",
                      "COPD",
                      "Emphysema",
                      "Hx of Pulmonary Emboli",
                      "Lung Cancer",
                      "Prone to Chest Infections / Pneumonia",
                      "Pulmonary TB",
                      "COVID +",
                    ].map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="hx"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(
                                    item as
                                    | "Asthma"
                                    | "COPD"
                                    | "Emphysema"
                                    | "Hx of Pulmonary Emboli"
                                    | "Lung Cancer"
                                    | "Prone to Chest Infections / Pneumonia"
                                    | "Pulmonary TB"
                                    | "COVID +",
                                  )}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item])
                                      : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item,
                                        ),
                                      );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </AccordionContent>
                </FormItem>
              )}
            />
          </AccordionItem>
          <AccordionItem value="Risk Factors for Pulm Embolus">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  form.formState.errors.riskFactorsForPulmEmbolus,
                "p-2": true,
              })}
            >
              Risk Factors for Pulm Embolus
            </AccordionTrigger>
            <AccordionContent>
              <FormField
                control={form.control}
                name="riskFactorsForPulmEmbolus"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 gap-3 p-3 lg:grid-cols-3">
                      {[
                        "Taking Contraceptives",
                        "Hx of DVTs",
                        "Recent: Long Distance Travel",
                        "Fracture",
                        "Recently given birth",
                      ].map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="riskFactorsForPulmEmbolus"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(
                                      item as
                                      | "Taking Contraceptives"
                                      | "Hx of DVTs"
                                      | "Recent: Long Distance Travel"
                                      | "Fracture"
                                      | "Recently given birth",
                                    )}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item])
                                        : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item,
                                          ),
                                        );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="In Addition to A/E Findings">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  form.formState.errors.riskFactorsForPulmEmbolus,
                "p-2": true,
              })}
            >
              In Addition to A/E Findings
            </AccordionTrigger>

            <AccordionContent>
              <FormField
                control={form.control}
                name="additionalFindings"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 gap-3 p-3 lg:grid-cols-3">
                      {[
                        "Accessory Muscles Use",
                        "Audible Wheezes",
                        "Audible Stridor",
                        "Apnea",
                        "On Home O2",
                        "Coughing: Wet",
                        "Coughing: Dry",
                        "Dyspnoea Not Relieved by Prescribed Medication",
                        "Guards Depth of Breathing",
                        "Hyperventilation",
                        "Inability to Talk",
                        "Kussmaul",
                        "Recent Flu",
                        "Severe Drooling",
                        "Signs of Respiratory Fatigue",
                        "Soot in Mouth",
                        "Tachypnoea",
                        "Tripod Position",
                        "Talks in Phrases",
                        "Uses Single Words Only",
                      ].map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="additionalFindings"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item as any)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item])
                                        : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item,
                                          ),
                                        );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="infant">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  form.formState.errors.riskFactorsForPulmEmbolus,
                "p-2": true,
              })}
            >
              Infant
            </AccordionTrigger>
            <AccordionContent>
              <FormField
                control={form.control}
                name="infant"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 gap-3 p-3 lg:grid-cols-3">
                      {[
                        "Chest Recession",
                        "Grunting",
                        "Irritable",
                        "Prem Baby: Respiratory Distress Syndrome",
                        "Congenital Abnormality",
                        "Hyaline Membrane Disease",
                      ].map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="infant"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(
                                      item as
                                      | "Chest Recession"
                                      | "Grunting"
                                      | "Irritable"
                                      | "Prem Baby: Respiratory Distress Syndrome"
                                      | "Congenital Abnormality"
                                      | "Hyaline Membrane Disease",
                                    )}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item])
                                        : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item,
                                          ),
                                        );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          <Button
            type="submit"
            disabled={!form.formState.isDirty}
            className="w-full sm:w-auto"
          >
            {form.formState.isSubmitting || updatePrfQuery.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
              </>
            ) : (
              "Save Respiratory Distress Assessment"
            )}
          </Button>
        </form>
      </Accordion>
    </Form>
  );
}
