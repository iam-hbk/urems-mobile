"use client";

import React from "react";
// import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePathname, useRouter } from "next/navigation";
import {
  ensurePRFResponseSectionByName,
  useUpdatePrfResponse,
} from "@/hooks/prf/usePrfForms";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { DiagnosisSchema, DiagnosisType } from "@/interfaces/prf-schema";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export default function DiagnosisForm() {
  const prfId = usePathname().split("/")[2];
  const qc = useQueryClient();
  const updatePrfQuery = useUpdatePrfResponse(prfId, "diagnosis");
  const router = useRouter();

  const form = useForm<DiagnosisType>({
    resolver: zodResolver(DiagnosisSchema),
    defaultValues: async () => {
      const section = await ensurePRFResponseSectionByName(
        qc,
        prfId,
        "diagnosis",
      );
      return {
        ...section.data,
        priorityType:
          (section.data.priorityType ?? "").length > 0
            ? section.data.priorityType
            : "color",
        priority:
          (section.data.priority ?? "").length > 0
            ? section.data.priority
            : "red",
        poisoning: section.data.poisoning || false,
        symptoms: section.data.symptoms || [],
      };
    },
  });

  // Priority color mapping
  const priorityColors = {
    red: "bg-red-500 hover:bg-red-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    orange: "bg-orange-500 hover:bg-orange-600",
    green: "bg-green-500 hover:bg-green-600",
    blue: "bg-blue-500 hover:bg-blue-600",
  };
  const priorityRingColors = {
    red: "ring-2 ring-red-500",
    yellow: "ring-2 ring-yellow-500",
    orange: "ring-2 ring-orange-500",
    green: "ring-2 ring-green-500",
    blue: "ring-2 ring-blue-500",
  };
  const priorityTextColors = {
    red: "text-red-500",
    yellow: "text-yellow-500",
    orange: "text-orange-500",
    green: "text-green-500",
    blue: "text-blue-500",
  };

  function onSubmit(values: DiagnosisType) {
    updatePrfQuery.mutate(
      { data: values, isCompleted: true },
      {
        onSuccess: () => {
          toast.success("Diagnosis Information Updated", {
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Diagnosis
          </h3>
        </div>
        <FormField
          control={form.control}
          name="diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diagnosis</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the diagnosis"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h4 className="text-base font-semibold">Priority Selection</h4>
              <p className="text-sm text-muted-foreground">
                Select priority type and value
              </p>
            </div>
            <FormField
              control={form.control}
              name="priorityType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <span
                        className={
                          field.value === "number"
                            ? "font-bold"
                            : "text-muted-foreground"
                        }
                      >
                        Numbers
                      </span>
                      <Switch
                        checked={field.value === "color"}
                        onCheckedChange={(checked) => {
                          field.onChange(checked ? "color" : "number");
                          form.setValue("priority", checked ? "red" : "1");
                        }}
                      />
                      <span
                        className={
                          field.value === "color"
                            ? "font-bold"
                            : "text-muted-foreground"
                        }
                      >
                        Colors
                      </span>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {form.watch("priorityType") === "number" ? (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4 sm:grid-cols-4"
                    >
                      {["1", "2", "3", "4"].map((priority) => (
                        <FormItem
                          key={priority}
                          className={`flex items-center justify-center rounded-lg border-2 p-4 ${
                            field.value === priority
                              ? "border-primary"
                              : "border-muted"
                          } cursor-pointer hover:bg-accent`}
                          onClick={() => field.onChange(priority)}
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={priority}
                              className="hidden"
                            />
                          </FormControl>
                          <FormLabel className="m-0 cursor-pointer font-semibold">
                            Priority {priority}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  ) : (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4 sm:grid-cols-5"
                    >
                      {["red", "yellow", "orange", "green", "blue"].map(
                        (color) => (
                          <FormItem
                            key={color}
                            className={cn({
                              "flex cursor-pointer items-center justify-center rounded-lg p-4 text-white transition-all":
                                true,
                              [priorityColors[
                                color as keyof typeof priorityColors
                              ]]: field.value === color,
                              [priorityRingColors[
                                color as keyof typeof priorityRingColors
                              ]]: field.value !== color,
                              [priorityTextColors[
                                color as keyof typeof priorityTextColors
                              ]]: field.value !== color,
                            })}
                            onClick={() => field.onChange(color)}
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={color}
                                className="hidden"
                              />
                            </FormControl>
                            <FormLabel className="m-0 cursor-pointer font-semibold capitalize">
                              {color}
                            </FormLabel>
                          </FormItem>
                        ),
                      )}
                    </RadioGroup>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Allergic Reaction */}
        <FormField
          control={form.control}
          name="allergicReaction.occurred"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Allergic Reaction</FormLabel>
                <FormDescription>
                  Did an allergic reaction occur?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value || false}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (!checked) {
                      // Reset symptoms and location when allergic reaction is turned off
                      form.setValue("allergicReaction.symptoms", []);
                      form.setValue("allergicReaction.location", []);
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch("allergicReaction.occurred") && (
          <>
            <FormField
              control={form.control}
              name="allergicReaction.symptoms"
              render={() => (
                <FormItem>
                  <FormLabel>Allergic Reaction Symptoms</FormLabel>
                  <div className="flex flex-wrap gap-4">
                    {[
                      "stridor",
                      "wheezes",
                      "erythema",
                      "pruritus",
                      "urticaria",
                    ].map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="allergicReaction.symptoms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={
                                  field.value?.includes(
                                    item as
                                      | "stridor"
                                      | "wheezes"
                                      | "erythema"
                                      | "pruritus"
                                      | "urticaria",
                                  ) || false
                                }
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  return checked
                                    ? field.onChange([...currentValue, item])
                                    : field.onChange(
                                        currentValue.filter(
                                          (value) => value !== item,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">
                              {item}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allergicReaction.location"
              render={() => (
                <FormItem>
                  <FormLabel>Allergic Reaction Location</FormLabel>
                  <div className="flex flex-wrap gap-4">
                    {["abd", "head", "limbs", "torso"].map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="allergicReaction.location"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={
                                  field.value?.includes(
                                    item as "abd" | "head" | "limbs" | "torso",
                                  ) || false
                                }
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  return checked
                                    ? field.onChange([...currentValue, item])
                                    : field.onChange(
                                        currentValue.filter(
                                          (value) => value !== item,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">
                              {item}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
          </>
        )}

        {/* Poisoning */}
        <FormField
          control={form.control}
          name="poisoning"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Poisoning</FormLabel>
                <FormDescription>Did poisoning occur?</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Symptoms */}
        <FormField
          control={form.control}
          name="symptoms"
          render={() => (
            <FormItem>
              <FormLabel>Symptoms</FormLabel>
              <div className="flex flex-wrap gap-4">
                {[
                  "Abdominal Pain",
                  "Altered LOC",
                  "Bradycardia",
                  "Secretions",
                  "Diaphoresis",
                  "Hypotension",
                  "Incontinence",
                  "Miosis",
                  "Seizures",
                  "Vomiting",
                ].map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="symptoms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(
                              item as
                                | "Abdominal Pain"
                                | "Altered LOC"
                                | "Bradycardia"
                                | "Secretions"
                                | "Diaphoresis"
                                | "Hypotension"
                                | "Incontinence"
                                | "Miosis"
                                | "Seizures"
                                | "Vomiting",
                            )}
                            onCheckedChange={(checked) => {
                              return field.value && checked
                                ? field.onChange([...field.value, item])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item,
                                    ),
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
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={!form.formState.isDirty}
          className="w-full self-end sm:w-auto"
          onClick={() => {
            console.log(form.getValues());
            console.log(form.formState.errors);
          }}
        >
          {form.formState.isSubmitting || updatePrfQuery.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
            </>
          ) : (
            "Save Diagnosis"
          )}
        </Button>
      </form>
    </Form>
  );
}
