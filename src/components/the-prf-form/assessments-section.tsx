"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldPath, SubmitErrorHandler, useForm } from "react-hook-form";
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
import { useUpdatePrfResponse } from "@/hooks/prf/usePrfForms";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AssessmentsSchema, AssessmentsType } from "@/interfaces/prf-schema";
import { TimePicker } from "@/components/ui/time-picker";
import { DatePicker, Group } from "react-aria-components";
import { CalendarDate } from "@internationalized/date";
import { DateInput } from "../ui/datefield-rac";
import { useQueryClient } from "@tanstack/react-query";
import { ensurePRFResponseSectionByName } from "@/hooks/prf/usePrfForms";

export default function AssessmentForm() {
  const prfId = usePathname().split("/")[2];
  const qc = useQueryClient();

  const updatePrfQuery = useUpdatePrfResponse(prfId, "assessments");
  const router = useRouter();

  const form = useForm<AssessmentsType>({
    resolver: zodResolver(AssessmentsSchema),
    defaultValues: async () => {
      const assessments = await ensurePRFResponseSectionByName(
        qc,
        prfId,
        "assessments",
      );
      return {
        ...assessments.data,
        abdominalAssessment: {
          ...assessments.data.abdominalAssessment,
          lastDrVisit: assessments.data.abdominalAssessment.lastDrVisit
            ? new Date(assessments.data.abdominalAssessment.lastDrVisit)
            : new Date(),
        },
      };
    },
  });

  function onSubmit(values: AssessmentsType) {
    updatePrfQuery.mutate(
      {
        data: values,
        isCompleted: true,
        isOptional: false,
      },
      {
        onSuccess: () => {
          toast.success("Assessment Information Updated", {
            duration: 3000,
            position: "top-right",
          });
          router.push(`/edit-prf/${prfId}`);
        },
        onError: () => {
          toast.error("An error occurred", {
            duration: 3000,
            position: "top-right",
          });
        },
      },
    );
  }

  // Add this function to handle form errors
  const onError: SubmitErrorHandler<AssessmentsType> = (errors) => {
    const extractFirstMessage = (err: unknown): string | null => {
      if (!err) return null;
      if (typeof err === "object") {
        if ("message" in (err as Record<string, unknown>)) {
          const maybe = (err as { message?: unknown }).message;
          if (typeof maybe === "string") return maybe;
        }
        for (const value of Object.values(err as Record<string, unknown>)) {
          const found = extractFirstMessage(value);
          if (found) return found;
        }
      }
      return null;
    };

    const firstMessage =
      extractFirstMessage(errors) || "Please fill in all required fields";

    toast.error(firstMessage, {
      duration: 3000,
      position: "top-right",
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="flex flex-col space-y-8"
      >
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
                render={() => (
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

              {/* Seizure Assessment */}
              <FormField
                control={form.control}
                name="neuroAssessment.seizure"
                render={() => (
                  <FormItem>
                    <FormLabel>Seizure Assessment</FormLabel>
                    <div className="flex flex-wrap gap-4">
                      {["tonic", "clonic", "petite"].map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name={
                            `neuroAssessment.seizure.${item}` as FieldPath<AssessmentsType>
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
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              {/* Acute Delirium */}
              <FormField
                control={form.control}
                name="neuroAssessment.acuteDelirium"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Acute Delirium
                    </FormLabel>
                  </FormItem>
                )}
              />

              {/* Aphasia */}
              <FormField
                control={form.control}
                name="neuroAssessment.aphasia"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Aphasia</FormLabel>
                  </FormItem>
                )}
              />

              {/* Incontinence */}
              <FormField
                control={form.control}
                name="neuroAssessment.incontinence"
                render={() => (
                  <FormItem>
                    <FormLabel>Incontinence</FormLabel>
                    <div className="flex flex-wrap gap-4">
                      {["urine", "stool"].map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name={
                            `neuroAssessment.incontinence.${item}` as FieldPath<AssessmentsType>
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
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              {/* Stupor */}
              <FormField
                control={form.control}
                name="neuroAssessment.stupor"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Stupor</FormLabel>
                  </FormItem>
                )}
              />

              {/* Syncope Events */}
              <FormField
                control={form.control}
                name="neuroAssessment.syncopeEvents"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Syncope Events
                    </FormLabel>
                  </FormItem>
                )}
              />
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
            <AccordionContent className="space-y-4 p-3">
              {/* Urine Output Section */}
              <div className="space-y-4">
                <FormLabel className="text-base font-semibold">
                  Urine Output
                </FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  {(
                    [
                      "burning",
                      "darkYellow",
                      "normal",
                      "blood",
                      "poly",
                      "noOutput",
                      "ihtFoleyCath",
                    ] as const
                  ).map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name={`abdominalAssessment.urineOutput.${item}` as const}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item
                              .replace(/([A-Z])/g, " $1")
                              .charAt(0)
                              .toUpperCase() +
                              item.replace(/([A-Z])/g, " $1").slice(1)}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormField
                  control={form.control}
                  name="abdominalAssessment.urineOutput.uo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UO (ml/hr)</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* History Section */}
              <div className="space-y-4">
                <FormLabel className="text-base font-semibold">
                  History
                </FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  {(
                    [
                      "Diverticulitis",
                      "Liver or Renal Failure",
                      "Stones",
                      "UTIs",
                    ] as const
                  ).map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="abdominalAssessment.hx"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                    ...(field.value || []),
                                    item,
                                  ])
                                  : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item,
                                    ) || [],
                                  );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* GIT Section */}
              <div className="space-y-4">
                <FormLabel className="text-base font-semibold">GIT</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  {(
                    [
                      "Ascites",
                      "Bloated",
                      "Constipation",
                      "Diaphoresis",
                    ] as const
                  ).map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="abdominalAssessment.git"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                    ...(field.value || []),
                                    item,
                                  ])
                                  : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item,
                                    ) || [],
                                  );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Additional GIT Conditions */}
              <p className="text-base font-semibold">
                Additional GIT Conditions
              </p>
              <div className="grid grid-cols-2 gap-4">
                {(
                  [
                    "gastroenteritis",
                    "hematemesis",
                    "melaenaStool",
                    "pegTube",
                    "diarrhoea",
                    "emesis",
                  ] as const
                ).map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name={`abdominalAssessment.${item}` as const}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item
                            .replace(/([A-Z])/g, " $1")
                            .charAt(0)
                            .toUpperCase() +
                            item.replace(/([A-Z])/g, " $1").slice(1)}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/* Emesis Details */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="abdominalAssessment.emesisAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emesis Amount</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="abdominalAssessment.emesisDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emesis Days</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Pain Section */}
              <div className="space-y-4">
                <FormLabel className="text-base font-semibold">Pain</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  {(
                    [
                      "Burning",
                      "Cramping",
                      "Dull",
                      "Sharp",
                      "Tearing",
                      "Reflux",
                    ] as const
                  ).map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="abdominalAssessment.pain"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                    ...(field.value || []),
                                    item,
                                  ])
                                  : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item,
                                    ) || [],
                                  );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Contractions */}
              <div className="space-y-4">
                <FormLabel className="text-base font-semibold">
                  Contractions
                </FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  {(["mild", "mod", "severe"] as const).map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name={`abdominalAssessment.contractions.${item}` as const}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item === "mod"
                              ? "Moderate"
                              : item.charAt(0).toUpperCase() + item.slice(1)}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormField
                  control={form.control}
                  name="abdominalAssessment.contractions.amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Pregnancy Related */}
              <div className="space-y-4">
                <FormLabel className="text-base font-semibold">
                  Pregnancy Related
                </FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  {(
                    [
                      "pregnant",
                      "twinPregnancy",
                      "discharge",
                      "pvBleeding",
                    ] as const
                  ).map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name={`abdominalAssessment.${item}` as const}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item
                              .replace(/([A-Z])/g, " $1")
                              .charAt(0)
                              .toUpperCase() +
                              item.replace(/([A-Z])/g, " $1").slice(1)}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="abdominalAssessment.paraGravida"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Para/Gravida</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="abdominalAssessment.lastDrVisit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Last Dr Visit{" "}
                          <span className="text-xs text-muted-foreground">
                            (mm/dd/yyyy)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            value={
                              field.value
                                ? typeof field.value === "string"
                                  ? new CalendarDate(
                                    new Date(field.value).getFullYear(),
                                    new Date(field.value).getMonth() + 1,
                                    new Date(field.value).getDate(),
                                  )
                                  : new CalendarDate(
                                    field.value.getFullYear(),
                                    field.value.getMonth() + 1,
                                    field.value.getDate(),
                                  )
                                : null
                            }
                            onChange={(date) => {
                              if (date) {
                                const jsDate = new Date(
                                  date.year,
                                  date.month - 1,
                                  date.day,
                                );
                                field.onChange(jsDate);
                              }
                            }}
                          >
                            <div className="flex">
                              <Group className="w-full">
                                <DateInput
                                  // label="Last Dr Visit"
                                  className="pe-9"
                                />
                              </Group>
                            </div>
                          </DatePicker>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="abdominalAssessment.gestation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gestation</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="pain-assessment">
            <AccordionTrigger>Pain Assessment - PQRST</AccordionTrigger>
            <AccordionContent className="space-y-4 p-3">
              {/* Provocation Section */}
              <div className="space-y-4">
                <FormLabel className="text-base">Provocation</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "onsetDuringExertion",
                    "duringRest",
                    "wokenByPain",
                    "onsetDuringMild",
                    "onsetDuringMod",
                    "onsetDuringActivity",
                  ].map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name={
                        `painAssessment.provocation.${item}` as FieldPath<AssessmentsType>
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
                            {item
                              .replace(/([A-Z])/g, " $1")
                              .charAt(0)
                              .toUpperCase() +
                              item.replace(/([A-Z])/g, " $1").slice(1)}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Quality Section */}
              <div className="space-y-4">
                <FormLabel className="text-base">Quality</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  {(
                    [
                      "Burning",
                      "Crushing / Weight",
                      "Intermittent",
                      "Constant",
                      "Dull",
                      "Sharp",
                      "Tearing",
                      "Cannot Describe",
                    ] as const
                  ).map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="painAssessment.quality"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                    ...(field.value || []),
                                    item,
                                  ])
                                  : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item,
                                    ) || [],
                                  );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Radiating Section */}
              <div className="space-y-4">
                <FormLabel className="text-base">Radiating</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  {(
                    ["yes", "lArm", "rArm", "face", "back", "leg"] as const
                  ).map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name={`painAssessment.radiating.${item}` as const}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item === "lArm"
                              ? "Left Arm"
                              : item === "rArm"
                                ? "Right Arm"
                                : item.charAt(0).toUpperCase() + item.slice(1)}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Severity Section */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="painAssessment.severity.atOnset"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severity at Onset (0-10)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" max="10" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="painAssessment.severity.current"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Severity (0-10)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" max="10" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Time Section */}
              <FormField
                control={form.control}
                name="painAssessment.timeOfOnset"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Time of Onset</FormLabel>
                    <FormControl>
                      <TimePicker
                        name="painAssessment.timeOfOnset"
                        // className="w-full"
                        onChange={(value) => {
                          // console.log("TimePicker Value set:", value);
                          field.onChange(value);
                        }}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Murphy's Sign */}
              <FormField
                control={form.control}
                name="painAssessment.negativeMurphysSign"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Negative Murphy&apos;s Sign
                    </FormLabel>
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cardiac-risk-factors">
            <AccordionTrigger>Cardiac Risk Factors</AccordionTrigger>
            <AccordionContent>
              <FormField
                control={form.control}
                name="riskFactors"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 gap-4">
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
                          name="riskFactors"
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
                name="dehydrationSigns"
                render={() => (
                  <FormItem>
                    {/* <div className="mb-4">
                      <FormLabel className="text-base">
                        Signs of Dehydration
                      </FormLabel>
                    </div> */}
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
                          name="dehydrationSigns"
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
                name="acsSigns"
                render={() => (
                  <FormItem>
                    {/* <div className="mb-4">
                      <FormLabel className="text-base">
                        Signs of Acute Coronary Syndrome
                      </FormLabel>
                    </div> */}
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
                          name="acsSigns"
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
          className="w-full self-end sm:w-auto"
          onClick={() => {
            const formErrors = form.formState.errors;
            if (Object.keys(formErrors).length > 0) {
              // Get the first error message
              const firstError = Object.entries(formErrors)[0];
              const errorPath = firstError[0];
              const errorMessage = firstError[1].message;

              toast.error(`Validation Error: ${errorPath} - ${errorMessage}`, {
                duration: 3000,
                position: "top-right",
              });
            }
          }}
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
