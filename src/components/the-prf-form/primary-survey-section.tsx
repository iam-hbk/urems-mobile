"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldPath, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import AVPURadioGroup from "@/components/ui/avpu-radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useUpdatePrf } from "@/hooks/prf/useUpdatePrf";
import { PRF_FORM } from "@/interfaces/prf-form";
import { toast } from "sonner";
import {
  PrimarySurveySchema,
  SpinalSchema,
  LocationSchema,
  InitialGCSSchema,
} from "@/interfaces/prf-primary-survey-schema";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { usePrfForm } from "@/hooks/prf/usePrfForms";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "../ui/textarea";

type PrimarySurveyType = z.infer<typeof PrimarySurveySchema>;

type PrimarySurveyFormProps = {
  initialData?: PrimarySurveyType;
};

const calculateTotal = (
  motor: string,
  verbal: string,
  eyes: string,
): string => {
  if (!motor || !verbal || !eyes) return "";

  if (verbal.toUpperCase() === "T") {
    const motorNum = parseInt(motor);
    const eyesNum = parseInt(eyes);
    if (!isNaN(motorNum) && !isNaN(eyesNum)) {
      return `${motorNum + eyesNum}T`;
    }
    return "";
  }

  const motorNum = parseInt(motor);
  const verbalNum = parseInt(verbal);
  const eyesNum = parseInt(eyes);

  if (!isNaN(motorNum) && !isNaN(verbalNum) && !isNaN(eyesNum)) {
    return (motorNum + verbalNum + eyesNum).toString();
  }

  return "";
};

export default function PrimarySurveyForm({
  initialData,
}: PrimarySurveyFormProps) {
  const prfId = usePathname().split("/")[2];
  const prf_from_store = useStore((state) => state.prfForms).find(
    (prf) => prf.prfFormId == prfId,
  );
  const updatePrfQuery = useUpdatePrf();
  const router = useRouter();

  // Initialize assessment type based on which field has data
  const [assessmentType, setAssessmentType] = useState<"GCS" | "AVPU">(() => {
    if (
      prf_from_store?.prfData?.primary_survey?.data?.disability?.AVPU?.value
    ) {
      return "AVPU";
    }
    return "GCS";
  });

  const form = useForm<PrimarySurveyType>({
    resolver: zodResolver(PrimarySurveySchema),
    values: prf_from_store?.prfData?.primary_survey?.data,
    defaultValues: prf_from_store?.prfData?.primary_survey?.data || {
      airway: {
        clear: false,
        maintained: false,
        lateral: false,
        intubated: false,
        surgical: false,
        blood: false,
        vomit: false,
        saliva: false,
        FBAO: false,
      },
      breathing: {
        trachea: { midline: false, deviated: false },
        airEntry: { clear: false, diminished: false, absent: false },
        extraSounds: {
          none: false,
          soft: false,
          loud: false,
          wheezes: false,
          crackles: false,
          stridor: false,
          frictionRub: false,
        },
        mechanics: {
          accessoryMuscleUse: false,
          apnea: false,
          asymmetrical: false,
          fatigue: false,
          guarding: false,
          normal: false,
          hypoventilation: false,
          ventilated: false,
        },
        neckVeins: { normal: false, distended: false },
      },
      circulation: {
        haemorrhage: {
          none: false,
          arterial: false,
          venous: false,
          capillary: false,
          mild: false,
          moderate: false,
          severe: false,
          internal: false,
        },
        assessmentOfPulses: {
          palpableCentral: false,
          palpablePeripherals: false,
          weak: false,
          absent: false,
          strong: false,
        },
        perfusion: {
          good: false,
          poor: false,
          none: false,
        },
        mucosa: { pink: false, pale: false, cyanosed: false },
        CRT: { lessThan2Sec: false, moreThan2Sec: false },
      },
      disability: {
        assessmentType: "GCS",
        initialGCS: {
          total: "",
          motor: "",
          verbal: "",
          eyes: "",
        },
        AVPU: null,
        combative: false,
        spinal: {
          motorFunction: {
            normal: false,
            guarding: false,
            loss: false,
            deformity: { present: false, explanation: "" },
          },
          sensation: {
            intact: false,
            pinsAndNeedles: false,
            numbness: false,
            none: false,
          },
        },
        location: {
          fromNeck: false,
          nippleLine: false,
          abdomen: false,
        },
      },
    },
  });

  function onSubmit(values: PrimarySurveyType) {
    console.log("VALUES -> ", values);
    // remove explain deformity if it is not present
    if (!form.getValues("disability.spinal.motorFunction.deformity.present")) {
      values.disability.spinal.motorFunction.deformity.explanation = "";
    }
    if (!form.formState.isDirty) return;

    const prfUpdateValue: PRF_FORM = {
      prfFormId: prfId,
      prfData: {
        ...prf_from_store?.prfData,
        primary_survey: {
          data: values,
          isCompleted: true,
          isOptional: false,
        },
      },
      EmployeeID: prf_from_store?.EmployeeID || "2",
    };

    console.log("FROM THE FORM -> ", prfUpdateValue);

    updatePrfQuery.mutate(prfUpdateValue, {
      onSuccess: (data) => {
        toast.success("Primary Survey Updated", {
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
    
    const errorMessage = errorMessages[0] || "Please fill in all required fields";
    
    toast.error(errorMessage, {
      duration: 3000,
      position: "top-right",
    });
  };

  return (
    <Accordion
      type="single"
      defaultValue="airway"
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
              Primary Survey
            </h3>
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
          </div>
          <AccordionItem value="airway">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  Object.keys(form.formState.errors.airway || {}).length > 0,
              })}
            >
              <h4 className="col-span-full scroll-m-20 text-lg font-semibold tracking-tight">
                Airway
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(PrimarySurveySchema.shape.airway.shape).map(
                (key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`airway.${key}` as FieldPath<PrimarySurveyType>}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={() => {
                              field.onChange(!field.value);
                              console.log(
                                `field.value OLD ${field.value} ** NEW ${!field.value}`,
                              );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal capitalize">
                          {key.split(/(?=[A-Z])/).join(" ")}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ),
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="breathing">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  Object.keys(form.formState.errors.breathing || {}).length > 0,
              })}
            >
              <h4 className="text-lg font-semibold">Breathing</h4>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-4">
              <div className="space-y-2">
                <h5 className="font-bold">Trachea</h5>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="breathing.trachea.midline"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Midline</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="breathing.trachea.deviated"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Deviated</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold">Air Entry</h5>
                <div className="grid gap-4 lg:grid-cols-3">
                  {Object.keys(
                    PrimarySurveySchema.shape.breathing.shape.airEntry.shape,
                  ).map((key) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={
                        `breathing.airEntry.${key}` as FieldPath<PrimarySurveyType>
                      }
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {key.split(/(?=[A-Z])/).join(" ")}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold">Extra Sounds</h5>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                  {Object.keys(
                    PrimarySurveySchema.shape.breathing.shape.extraSounds.shape,
                  ).map((key) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={
                        `breathing.extraSounds.${key}` as FieldPath<PrimarySurveyType>
                      }
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {key.split(/(?=[A-Z])/).join(" ")}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold">Mechanics</h5>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                  {Object.keys(
                    PrimarySurveySchema.shape.breathing.shape.mechanics.shape,
                  ).map((key) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={
                        `breathing.mechanics.${key}` as FieldPath<PrimarySurveyType>
                      }
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {key.split(/(?=[A-Z])/).join(" ")}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold">Neck Veins</h5>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="breathing.neckVeins.normal"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Normal</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="breathing.neckVeins.distended"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Distended</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="circulation">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  Object.keys(form.formState.errors.circulation || {}).length >
                  0,
              })}
            >
              <h4 className="text-lg font-semibold">Circulation</h4>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-4">
              <div className="space-y-2">
                <h5 className="font-bold">Haemorrhage</h5>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                  {Object.keys(
                    PrimarySurveySchema.shape.circulation.shape.haemorrhage
                      .shape,
                  ).map((key) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={
                        `circulation.haemorrhage.${key}` as FieldPath<PrimarySurveyType>
                      }
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {key.split(/(?=[A-Z])/).join(" ")}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold">Assessment of Pulses</h5>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                  {Object.keys(
                    PrimarySurveySchema.shape.circulation.shape
                      .assessmentOfPulses.shape,
                  ).map((key) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={
                        `circulation.assessmentOfPulses.${key}` as FieldPath<PrimarySurveyType>
                      }
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {key.split(/(?=[A-Z])/).join(" ")}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold">Perfusion</h5>
                <div className="grid gap-4 lg:grid-cols-3">
                  {Object.keys(
                    PrimarySurveySchema.shape.circulation.shape.perfusion.shape,
                  ).map((key) => (
                    <React.Fragment key={key}>
                      <FormField
                        control={form.control}
                        name={
                          `circulation.perfusion.${key}` as FieldPath<PrimarySurveyType>
                        }
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value as boolean}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">
                              {key.split(/(?=[A-Z])/).join(" ")}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="disability">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  Object.keys(form.formState.errors.disability || {}).length >
                  0,
              })}
            >
              <h4 className="text-lg font-semibold">Disability</h4>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-4">
              <div className="space-y-2">
                <h5 className="font-bold">Assessment Type</h5>
                <FormField
                  control={form.control}
                  name="disability.assessmentType"
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={(value) => {
                        const newType = value as "GCS" | "AVPU";
                        field.onChange(newType);
                        setAssessmentType(newType);
                        // Update form values based on assessment type
                        if (newType === "GCS") {
                          form.setValue("disability", {
                            ...form.getValues("disability"),
                            assessmentType: "GCS",
                            initialGCS: {
                              total: "",
                              motor: "",
                              verbal: "",
                              eyes: "",
                            },
                            AVPU: null,
                          });
                        } else {
                          form.setValue("disability", {
                            ...form.getValues("disability"),
                            assessmentType: "AVPU",
                            initialGCS: null,
                            AVPU: { value: "A" },
                          });
                        }
                      }}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="GCS" />
                        </FormControl>
                        <FormLabel className="font-normal">GCS</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="AVPU" />
                        </FormControl>
                        <FormLabel className="font-normal">AVPU</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  )}
                />
              </div>

              {/* Combative Section */}
              <div className="space-y-2">
                <h5 className="font-bold">Combative</h5>
                <div className="grid grid-cols-1 px-2">
                  <FormField
                    control={form.control}
                    name="disability.combative"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Combative</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {assessmentType === "GCS" ? (
                <div className="space-y-2">
                  <h5 className="font-bold">Initial GCS</h5>
                  <div className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Object.keys(InitialGCSSchema.shape).map((key) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name={
                          `disability.initialGCS.${key}` as FieldPath<PrimarySurveyType>
                        }
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="capitalize">
                              {key.split(/(?=[A-Z])/).join(" ")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={
                                  key === "verbal"
                                    ? "1-5 or T"
                                    : key === "motor"
                                      ? "1-6"
                                      : key === "eyes"
                                        ? "1-4"
                                        : "Total GCS"
                                }
                                disabled={key === "total"}
                                {...field}
                                value={
                                  key === "total"
                                    ? calculateTotal(
                                        form.watch(
                                          "disability.initialGCS.motor",
                                        ),
                                        form.watch(
                                          "disability.initialGCS.verbal",
                                        ),
                                        form.watch(
                                          "disability.initialGCS.eyes",
                                        ),
                                      )
                                    : (field.value as string)
                                }
                                type={
                                  key === "verbal" || key === "total"
                                    ? "text"
                                    : "number"
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (key === "total") return;
                                  if (key === "verbal") {
                                    field.onChange(value.toUpperCase());
                                  } else {
                                    field.onChange(value);
                                  }
                                }}
                              />
                            </FormControl>
                            {form.formState.errors.disability?.initialGCS?.[
                              key as keyof typeof form.formState.errors.disability.initialGCS
                            ] && (
                              <p className="text-sm text-destructive">
                                {
                                  (
                                    form.formState.errors.disability
                                      ?.initialGCS?.[
                                      key as keyof typeof form.formState.errors.disability.initialGCS
                                    ] as FieldError
                                  )?.message
                                }
                              </p>
                            )}
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h5 className="font-bold">AVPU Assessment</h5>
                  <FormField
                    control={form.control}
                    name="disability.AVPU.value"
                    render={({ field }) => (
                      <AVPURadioGroup
                        value={field.value}
                        onChange={field.onChange}
                        disabled={form.formState.isSubmitting}
                      />
                    )}
                  />
                </div>
              )}

              <div className="space-y-2">
                <h5 className="font-bold">Spinal</h5>
                <div className="grid grid-cols-1 space-y-4 px-2">
                  <div className="space-y-2">
                    <h6 className="font-medium">Motor Function</h6>
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                      {Object.keys(SpinalSchema.shape.motorFunction.shape).map(
                        (key) => {
                          return (
                            <FormField
                              key={key}
                              control={form.control}
                              name={
                                `disability.spinal.motorFunction.${key}` as FieldPath<PrimarySurveyType>
                              }
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={
                                        key === "deformity"
                                          ? form.getValues(
                                              "disability.spinal.motorFunction.deformity.present",
                                            )
                                          : !!field.value
                                      }
                                      onCheckedChange={(checked) => {
                                        field.onChange(checked);
                                        if (key === "deformity") {
                                          form.setValue(
                                            "disability.spinal.motorFunction.deformity.present",
                                            !!checked,
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal capitalize">
                                    {key.split(/(?=[A-Z])/).join(" ")}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          );
                        },
                      )}
                      {form.watch(
                        "disability.spinal.motorFunction.deformity.present",
                      ) && (
                        <FormField
                          control={form.control}
                          name={
                            `disability.spinal.motorFunction.deformity.explanation` as FieldPath<PrimarySurveyType>
                          }
                          render={({ field }) => (
                            <FormItem className="col-span-full">
                              <FormLabel className="font-normal capitalize">
                                Deformity Explanation
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Explain deformity"
                                  {...field}
                                  value={(field.value as string) ?? ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h6 className="font-medium">Sensation</h6>
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                      {Object.keys(SpinalSchema.shape.sensation.shape).map(
                        (key) => (
                          <FormField
                            key={key}
                            control={form.control}
                            name={
                              `disability.spinal.sensation.${key}` as FieldPath<PrimarySurveyType>
                            }
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value as boolean}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal capitalize">
                                  {key.split(/(?=[A-Z])/).join(" ")}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h5 className="font-bold">Location</h5>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                  {Object.keys(LocationSchema.shape).map((key) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={
                        `disability.location.${key}` as FieldPath<PrimarySurveyType>
                      }
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {key === "abdomen"
                              ? "Abdomen"
                              : key.split(/(?=[A-Z])/).join(" ")}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
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
