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
import { useStore } from "@/lib/store";
import { useUpdatePrf } from "@/hooks/prf/useUpdatePrf";
import { PRF_FORM } from "@/interfaces/prf-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { DiagnosisSchema, DiagnosisType } from "@/interfaces/prf-schema";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";

export default function DiagnosisForm() {
  const prfId = usePathname().split("/")[2];
  const prf_from_store = useStore((state) => state.prfForms).find(
    (prf) => prf.prfFormId == prfId,
  );

  const updatePrfQuery = useUpdatePrf();
  const router = useRouter();

  const form = useForm<DiagnosisType>({
    resolver: zodResolver(DiagnosisSchema),
    defaultValues: prf_from_store?.prfData?.diagnosis?.data || {
      diagnosis: "",
    },
  });

  function onSubmit(values: DiagnosisType) {
    const prfUpdateValue: PRF_FORM = {
      prfFormId: prfId,
      prfData: {
        ...prf_from_store?.prfData,
        diagnosis: {
          data: values,
          isCompleted: true,
          isOptional: false,
        },
      },
    };

    updatePrfQuery.mutate(prfUpdateValue, {
      onSuccess: (data) => {
        toast.success("Diagnosis Information Updated", {
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

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {["1", "2", "3", "4"].map((priority) => (
                    <FormItem
                      key={priority}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={priority} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Priority {priority}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  checked={field.value}
                  onCheckedChange={field.onChange}
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
                      "Stridor",
                      "Wheezes",
                      "Erythema",
                      "Pruritus",
                      "Urticaria",
                    ].map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="allergicReaction.symptoms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(
                                  item as
                                  | "Stridor"
                                  | "Wheezes"
                                  | "Erythema"
                                  | "Pruritus"
                                  | "Urticaria",
                                )}
                                onCheckedChange={(checked) => {
                                  // make sure field.value is not null or undefined
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
                            <FormLabel className="font-normal">
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
                    {["Abd", "Head", "Limbs", "Torso"].map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="allergicReaction.location"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(
                                  item as "Abd" | "Head" | "Limbs" | "Torso",
                                )}
                                onCheckedChange={(checked) => {
                                  // there is an error here .. check field is valid and not null
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
                            <FormLabel className="font-normal">
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
          className="w-full sm:w-auto"
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