"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, SubmitErrorHandler } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { usePathname, useRouter } from "next/navigation";
import {
  ensurePRFResponseSectionByName,
  useUpdatePrfResponse,
} from "@/hooks/prf/usePrfForms";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  PastMedicalHistorySchema,
  PastMedicalHistoryType,
} from "@/interfaces/prf-schema";
import { cn } from "@/lib/utils";

export default function PastMedicalHistoryForm() {
  const prfId = usePathname().split("/")[2];
  const qc = useQueryClient();

  const updatePrfQuery = useUpdatePrfResponse(prfId, "past_medical_history");
  const router = useRouter();

  const form = useForm<PastMedicalHistoryType>({
    resolver: zodResolver(PastMedicalHistorySchema),
    defaultValues: async () => {
      const section = await ensurePRFResponseSectionByName(
        qc,
        prfId,
        "past_medical_history",
      );
      return {
        ...section.data,
        familyHistory: section.data.familyHistory || [],
      };
    },
  });

  // Field arrays
  const {
    fields: allergyFields,
    append: appendAllergy,
    remove: removeAllergy,
  } = useFieldArray({
    control: form.control,
    name: "allergies",
  });

  const {
    fields: medicationFields,
    append: appendMedication,
    remove: removeMedication,
  } = useFieldArray({
    control: form.control,
    name: "currentMedications",
  });

  const {
    fields: surgeryFields,
    append: appendSurgery,
    remove: removeSurgery,
  } = useFieldArray({
    control: form.control,
    name: "surgicalHistory",
  });

  // Handle family history manually since it's a simple string array
  const familyHistory = form.watch("familyHistory") || [];

  function onSubmit(values: PastMedicalHistoryType) {
    updatePrfQuery.mutate(
      { data: values, isCompleted: true },
      {
        onSuccess: () => {
          toast.success("Past Medical History Updated", {
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

  const onError: SubmitErrorHandler<PastMedicalHistoryType> = (errors) => {
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

  const cardiovascularConditions = [
    "Hypertension",
    "Previous MI",
    "Angina",
    "Bypass Surgery",
    "Pacemaker",
    "Heart Failure",
    "Arrhythmia",
    "Other",
  ] as const;

  const respiratoryConditions = [
    "Asthma",
    "COPD",
    "Tuberculosis",
    "Sleep Apnea",
    "Other",
  ] as const;

  const neurologicalConditions = [
    "CVA/Stroke",
    "Epilepsy",
    "TIA",
    "Seizures",
    "Other",
  ] as const;

  const endocrineConditions = [
    "Diabetes Type 1",
    "Diabetes Type 2",
    "Thyroid Disease",
    "Other",
  ] as const;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="flex flex-col space-y-8"
      >
        <div className="flex items-center justify-between">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Past Medical History
          </h3>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {/* Allergies Section */}
          <AccordionItem value="allergies">
            <AccordionTrigger>Allergies</AccordionTrigger>
            <AccordionContent className="space-y-4 p-3">
              {allergyFields.map((field, index) => (
                <div
                  key={field.id}
                  className={cn(
                    "flex w-full flex-col rounded-md border px-4 py-4 transition-all delay-100 hover:border-primary",
                    {
                      "border-destructive":
                        form.formState.errors?.allergies?.[index],
                    },
                  )}
                >
                  <div className="mb-3 flex flex-row items-center justify-between">
                    <h5 className="font-bold">Allergy {index + 1}</h5>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAllergy(index)}
                      className="hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name={`allergies.${index}.allergen`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allergen *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Penicillin" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`allergies.${index}.reaction`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reaction *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., Rash, Swelling"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`allergies.${index}.severity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Severity *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select severity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Mild">Mild</SelectItem>
                              <SelectItem value="Moderate">Moderate</SelectItem>
                              <SelectItem value="Severe">Severe</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  appendAllergy({
                    allergen: "",
                    reaction: "",
                    severity: "Mild",
                  })
                }
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Allergy
              </Button>
            </AccordionContent>
          </AccordionItem>

          {/* Current Medications Section */}
          <AccordionItem value="current-medications">
            <AccordionTrigger>Current Medications</AccordionTrigger>
            <AccordionContent className="space-y-4 p-3">
              {medicationFields.map((field, index) => (
                <div
                  key={field.id}
                  className={cn(
                    "flex w-full flex-col rounded-md border px-4 py-4 transition-all delay-100 hover:border-primary",
                    {
                      "border-destructive":
                        form.formState.errors?.currentMedications?.[index],
                    },
                  )}
                >
                  <div className="mb-3 flex flex-row items-center justify-between">
                    <h5 className="font-bold">Medication {index + 1}</h5>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMedication(index)}
                      className="hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <FormField
                      control={form.control}
                      name={`currentMedications.${index}.medication`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medication *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Aspirin" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`currentMedications.${index}.dosage`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dosage *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 100mg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`currentMedications.${index}.frequency`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequency *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Once daily" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`currentMedications.${index}.lastTaken`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Taken</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., This morning"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  appendMedication({
                    medication: "",
                    dosage: "",
                    frequency: "",
                    lastTaken: "",
                  })
                }
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Medication
              </Button>
            </AccordionContent>
          </AccordionItem>

          {/* Last Meal Section */}
          <AccordionItem value="last-meal">
            <AccordionTrigger>Last Meal</AccordionTrigger>
            <AccordionContent className="space-y-4 p-3">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="lastMeal.time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., 2 hours ago, 12:00 PM"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastMeal.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Light breakfast" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Medical Conditions Section */}
          <AccordionItem value="medical-conditions">
            <AccordionTrigger>Medical Conditions</AccordionTrigger>
            <AccordionContent className="space-y-6 p-3">
              {/* Cardiovascular */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="medicalConditions.cardiovascular.hasCondition"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (!checked) {
                              form.setValue(
                                "medicalConditions.cardiovascular.conditions",
                                [],
                              );
                              form.setValue(
                                "medicalConditions.cardiovascular.details",
                                "",
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-base font-semibold">
                        Cardiovascular Conditions
                      </FormLabel>
                    </FormItem>
                  )}
                />
                {form.watch(
                  "medicalConditions.cardiovascular.hasCondition",
                ) && (
                  <div className="ml-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {cardiovascularConditions.map((condition) => (
                        <FormField
                          key={condition}
                          control={form.control}
                          name="medicalConditions.cardiovascular.conditions"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(condition)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          condition,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== condition,
                                          ) || [],
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {condition}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormField
                      control={form.control}
                      name="medicalConditions.cardiovascular.details"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Details</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Provide additional details about cardiovascular conditions"
                              className="min-h-[80px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Respiratory */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="medicalConditions.respiratory.hasCondition"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (!checked) {
                              form.setValue(
                                "medicalConditions.respiratory.conditions",
                                [],
                              );
                              form.setValue(
                                "medicalConditions.respiratory.details",
                                "",
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-base font-semibold">
                        Respiratory Conditions
                      </FormLabel>
                    </FormItem>
                  )}
                />
                {form.watch("medicalConditions.respiratory.hasCondition") && (
                  <div className="ml-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {respiratoryConditions.map((condition) => (
                        <FormField
                          key={condition}
                          control={form.control}
                          name="medicalConditions.respiratory.conditions"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(condition)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          condition,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== condition,
                                          ) || [],
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {condition}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormField
                      control={form.control}
                      name="medicalConditions.respiratory.details"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Details</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Provide additional details about respiratory conditions"
                              className="min-h-[80px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Neurological */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="medicalConditions.neurological.hasCondition"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (!checked) {
                              form.setValue(
                                "medicalConditions.neurological.conditions",
                                [],
                              );
                              form.setValue(
                                "medicalConditions.neurological.details",
                                "",
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-base font-semibold">
                        Neurological Conditions
                      </FormLabel>
                    </FormItem>
                  )}
                />
                {form.watch("medicalConditions.neurological.hasCondition") && (
                  <div className="ml-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {neurologicalConditions.map((condition) => (
                        <FormField
                          key={condition}
                          control={form.control}
                          name="medicalConditions.neurological.conditions"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(condition)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          condition,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== condition,
                                          ) || [],
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {condition}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormField
                      control={form.control}
                      name="medicalConditions.neurological.details"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Details</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Provide additional details about neurological conditions"
                              className="min-h-[80px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Endocrine */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="medicalConditions.endocrine.hasCondition"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (!checked) {
                              form.setValue(
                                "medicalConditions.endocrine.conditions",
                                [],
                              );
                              form.setValue(
                                "medicalConditions.endocrine.details",
                                "",
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-base font-semibold">
                        Endocrine Conditions
                      </FormLabel>
                    </FormItem>
                  )}
                />
                {form.watch("medicalConditions.endocrine.hasCondition") && (
                  <div className="ml-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {endocrineConditions.map((condition) => (
                        <FormField
                          key={condition}
                          control={form.control}
                          name="medicalConditions.endocrine.conditions"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(condition)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          condition,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== condition,
                                          ) || [],
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {condition}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormField
                      control={form.control}
                      name="medicalConditions.endocrine.details"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Details</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Provide additional details about endocrine conditions"
                              className="min-h-[80px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Surgical History Section */}
          <AccordionItem value="surgical-history">
            <AccordionTrigger>Surgical History</AccordionTrigger>
            <AccordionContent className="space-y-4 p-3">
              {surgeryFields.map((field, index) => (
                <div
                  key={field.id}
                  className={cn(
                    "flex w-full flex-col rounded-md border px-4 py-4 transition-all delay-100 hover:border-primary",
                    {
                      "border-destructive":
                        form.formState.errors?.surgicalHistory?.[index],
                    },
                  )}
                >
                  <div className="mb-3 flex flex-row items-center justify-between">
                    <h5 className="font-bold">Surgery {index + 1}</h5>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSurgery(index)}
                      className="hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name={`surgicalHistory.${index}.procedure`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Procedure *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., Appendectomy"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`surgicalHistory.${index}.date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., 2020, January 2020"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`surgicalHistory.${index}.complications`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complications</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Any complications" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  appendSurgery({
                    procedure: "",
                    date: "",
                    complications: "",
                  })
                }
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Surgery
              </Button>
            </AccordionContent>
          </AccordionItem>

          {/* Family History Section */}
          <AccordionItem value="family-history">
            <AccordionTrigger>Family History</AccordionTrigger>
            <AccordionContent className="space-y-4 p-3">
              {familyHistory.length > 0 &&
                familyHistory.map((_item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name={`familyHistory.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., Father - Heart Disease, Mother - Diabetes"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newHistory = familyHistory.filter(
                          (_, i) => i !== index,
                        );
                        form.setValue("familyHistory", newHistory);
                      }}
                      className="hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const newHistory = [...familyHistory, ""];
                  form.setValue("familyHistory", newHistory);
                }}
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Family History
              </Button>
            </AccordionContent>
          </AccordionItem>

          {/* Additional Notes Section */}
          <AccordionItem value="additional-notes">
            <AccordionTrigger>Additional Notes</AccordionTrigger>
            <AccordionContent className="space-y-4 p-3">
              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Any additional medical history information"
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
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
            console.log("Form Values -> ", form.getValues());
            console.log("Form Errors -> ", form.formState.errors);
          }}
        >
          {form.formState.isSubmitting || updatePrfQuery.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
            </>
          ) : (
            "Save Past Medical History"
          )}
        </Button>
      </form>
    </Form>
  );
}
