"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldPath, useForm } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useUpdatePrf } from "@/hooks/prf/useUpdatePrf";
import { PRF_FORM } from "@/interfaces/prf-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { AssessmentsSchema, AssessmentsType } from "@/interfaces/prf-schema";

export default function AssessmentForm() {
  const prfId = usePathname().split("/")[2];
  const prf_from_store = useStore((state) => state.prfForms).find(
    (prf) => prf.prfFormId == prfId,
  );

  const updatePrfQuery = useUpdatePrf();
  const router = useRouter();

  const form = useForm<AssessmentsType>({
    resolver: zodResolver(AssessmentsSchema),
    defaultValues: prf_from_store?.prfData?.assessments?.data || {
      neuroAssessment: {
        cincinnatiScale: {
          armDrift: false,
          facialDroop: false,
          slurredSpeech: false,
        },
        seizure: { tonic: false, clonic: false, petite: false },
        acuteDelirium: false,
        aphasia: false,
        incontinence: { urine: false, stool: false },
        stupor: false,
        syncopeEvents: false,
      },
      neuroConditions: [],
      abdominalAssessment: {
        urineOutput: {
          burning: false,
          darkYellow: false,
          normal: false,
          blood: false,
          poly: false,
          noOutput: false,
          ihtFoleyCath: false,
          uo: "",
        },
        hx: [],
        git: [],
        gastroenteritis: false,
        hematemesis: false,
        melaenaStool: false,
        pegTube: false,
        diarrhoea: false,
        emesis: false,
        emesisAmount: "",
        emesisDays: "",
        pain: [],
        contractions: { mild: false, mod: false, severe: false, amount: "" },
        pregnant: false,
        twinPregnancy: false,
        paraGravida: "",
        discharge: false,
        pvBleeding: false,
        lastDrVisit: "",
        gestation: "",
      },
      painAssessment: {
        provocation: {
          onsetDuringExertion: false,
          duringRest: false,
          wokenByPain: false,
          onsetDuringMild: false,
          onsetDuringMod: false,
          onsetDuringActivity: false,
        },
        quality: [],
        radiating: {
          yes: false,
          lArm: false,
          rArm: false,
          face: false,
          back: false,
          leg: false,
        },
        severity: { atOnset: "", current: "" },
        timeOfOnset: "",
        negativeMurphysSign: false,
      },
      cardiacRiskFactors: [],
      signsOfDehydration: [],
      signsOfAcuteCoronarySyndrome: [],
    },
  });

  function onSubmit(values: AssessmentsType) {
    const prfUpdateValue: PRF_FORM = {
      prfFormId: prfId,
      prfData: {
        ...prf_from_store?.prfData,
        assessments: {
          data: values,
          isCompleted: true,
          isOptional: false,
        },
      },
    };

    updatePrfQuery.mutate(prfUpdateValue, {
      onSuccess: (data) => {
        toast.success("Assessment Information Updated", {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Assessment
          </h3>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="neuro-assessment">
            <AccordionTrigger>Neuro Assessment</AccordionTrigger>
            <AccordionContent className="space-y-4 p-3">
              <FormField
                control={form.control}
                name="neuroAssessment.cincinnatiScale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cincinnati Scale</FormLabel>
                    <div className="flex flex-wrap gap-4">
                      {["armDrift", "facialDroop", "slurredSpeech"].map(
                        (item) => (
                          <FormField
                            key={item}
                            control={form.control}
                            name={
                              `neuroAssessment.cincinnatiScale.${item}` as FieldPath<AssessmentsType>
                            }
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={!!field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    {item.charAt(0).toUpperCase() +
                                      item.slice(1).replace(/([A-Z])/g, " $1")}
                                  </FormLabel>
                              </FormItem>
                            )}
                          />
                        ),
                      )}
                    </div>
                  </FormItem>
                )}
              />

              {/* Add more fields for Neuro Assessment here */}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="neuro-conditions">
            <AccordionTrigger>Neuro Conditions</AccordionTrigger>
            <AccordionContent>
              <FormField
                control={form.control}
                name="neuroConditions"
                render={() => (
                  <FormItem>
                    {/* <div className="mb-4">
                      <FormLabel className="text-base">
                        Neuro Conditions
                      </FormLabel>
                    </div> */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        "Brain tumour",
                        "Bipolar",
                        "Dementia",
                        "Depression",
                        "Epilepsy",
                        "Hydrocephalus",
                        "Multiple Sclerosis",
                        "Parkinson's",
                        "Previous: TBI",
                        "Previous: TIA",
                        "Previous: Stroke",
                        "Quadriplegia",
                        "Paraplegia",
                        "Schizophrenia",
                        "Syndrome",
                      ].map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="neuroConditions"
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
                                        | "Brain tumour"
                                        | "Bipolar"
                                        | "Dementia"
                                        | "Depression"
                                        | "Epilepsy"
                                        | "Hydrocephalus"
                                        | "Multiple Sclerosis"
                                        | "Parkinson's"
                                        | "Previous: TBI"
                                        | "Previous: TIA"
                                        | "Previous: Stroke"
                                        | "Quadriplegia"
                                        | "Paraplegia"
                                        | "Schizophrenia"
                                        | "Syndrome",
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

          <AccordionItem value="abdominal-assessment">
            <AccordionTrigger>Abdominal Assessment</AccordionTrigger>
            <AccordionContent>
              {/* Add Abdominal Assessment fields here */}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="pain-assessment">
            <AccordionTrigger>Pain Assessment - PQRST</AccordionTrigger>
            <AccordionContent>
              {/* Add Pain Assessment fields here */}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cardiac-risk-factors">
            <AccordionTrigger>Cardiac Risk Factors</AccordionTrigger>
            <AccordionContent>
              <FormField
                control={form.control}
                name="cardiacRiskFactors"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        Cardiac Risk Factors
                      </FormLabel>
                    </div>
                    <div className="gri d-cols-2 grid gap-4">
                      {[
                        "Age",
                        "↑BMI",
                        "Diabetes",
                        "Family Cardiac Hx",
                        "Hypertension",
                        "↑Cholesterol",
                        "Previous Cardiac Event",
                        "Smoker",
                        "Stress",
                      ].map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="cardiacRiskFactors"
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
                                        | "Age"
                                        | "↑BMI"
                                        | "Diabetes"
                                        | "Family Cardiac Hx"
                                        | "Hypertension"
                                        | "↑Cholesterol"
                                        | "Previous Cardiac Event"
                                        | "Smoker"
                                        | "Stress",
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

          <AccordionItem value="signs-of-dehydration">
            <AccordionTrigger>Signs of Dehydration</AccordionTrigger>
            <AccordionContent>
              <FormField
                control={form.control}
                name="signsOfDehydration"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        Signs of Dehydration
                      </FormLabel>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        "Cold Peripheries",
                        "Confused",
                        "Cramping",
                        "Dysphagia",
                        "Dizziness",
                        "Dry Mucosa",
                        "Hypotension",
                        "Poor Skin Turgor",
                        "Sunken Eyes",
                        "Sunken Fontanelles",
                        "Syncope",
                        "Tachycardia",
                        "Weak",
                      ].map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="signsOfDehydration"
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
                                        | "Cramping"
                                        | "Cold Peripheries"
                                        | "Confused"
                                        | "Dysphagia"
                                        | "Dizziness"
                                        | "Dry Mucosa"
                                        | "Hypotension"
                                        | "Poor Skin Turgor"
                                        | "Sunken Eyes"
                                        | "Sunken Fontanelles"
                                        | "Syncope"
                                        | "Tachycardia"
                                        | "Weak",
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

          <AccordionItem value="signs-of-acute-coronary-syndrome">
            <AccordionTrigger>
              Signs of Acute Coronary Syndrome
            </AccordionTrigger>
            <AccordionContent>
              <FormField
                control={form.control}
                name="signsOfAcuteCoronarySyndrome"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        Signs of Acute Coronary Syndrome
                      </FormLabel>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        "Chest Pain Not Increased by Deep Breathing",
                        "Crushing Pain",
                        "Diaphoresis",
                        "Radiating Pain",
                        "Nausea",
                        "Pale",
                        "ECG Changes",
                        "ST Elevation",
                      ].map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="signsOfAcuteCoronarySyndrome"
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
                                        | "Diaphoresis"
                                        | "Chest Pain Not Increased by Deep Breathing"
                                        | "Crushing Pain"
                                        | "Radiating Pain"
                                        | "Nausea"
                                        | "Pale"
                                        | "ECG Changes"
                                        | "ST Elevation",
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
        </Accordion>

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
            "Save Assessment"
          )}
        </Button>
      </form>
    </Form>
  );
}
