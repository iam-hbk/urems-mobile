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
import { Accordion } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { IntravenousTherapySchema } from "@/interfaces/prf-schema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TimePicker } from "@/components/ui/time-picker";
import { useZuStandCrewStore } from "@/lib/zuStand/crew";
import {
  ensurePRFResponseSectionByName,
  useUpdatePrfResponse,
} from "@/hooks/prf/usePrfForms";
import { useQueryClient } from "@tanstack/react-query";

export type IntravenousTherapyType = z.infer<typeof IntravenousTherapySchema>;

export default function IntravenousTherapyForm() {
  const prfId = usePathname().split("/")[2];
  const qc = useQueryClient();
  // Using this store until we connect backend stock and inventory
  const { zsVehicle } = useZuStandCrewStore();

  const updatePrfQuery = useUpdatePrfResponse(prfId, "intravenous_therapy");
  const router = useRouter();
  const form = useForm<IntravenousTherapyType>({
    resolver: zodResolver(IntravenousTherapySchema),
    defaultValues: async () => {
      const intravenousTherapy = await ensurePRFResponseSectionByName(
        qc,
        prfId,
        "intravenous_therapy",
      );
      return intravenousTherapy?.data;
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "therapyDetails",
  });

  function onSubmit(values: IntravenousTherapyType) {
    // Update vehicle inventory for each therapy detail
    // values.therapyDetails.forEach((therapy) => {
    //   if (therapy.fluidId) {
    //     // Only update stock if it's a fluid from inventory
    //     zsUpdateFluidStock(
    //       therapy.fluidId,
    //       Math.ceil(therapy.volumeAdministered / therapy.volume),
    //     );
    //   }
    // });

    const prfUpdateValue = {
      data: values,
      isCompleted: true,
      isOptional: false,
    };

    updatePrfQuery.mutate(prfUpdateValue, {
      onSuccess: () => {
        toast.success("Intravenous Therapy Information Updated", {
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
                    fluidId: undefined,
                    volume: 0,
                    admin: "10dropper",
                    rate: "",
                    time: {
                      value: new Date().toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                      unknown: false,
                    },
                    jelco: "20G",
                    site: "Right Antecubital",
                    volumeAdministered: 0,
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
                    {/* Fluid Selection */}
                    <FormField
                      control={form.control}
                      name={`therapyDetails.${index}.fluid`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IV Fluid Type</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              const selectedFluid =
                                zsVehicle?.inventory.fluids.find(
                                  (f) => f.id === value,
                                );
                              if (selectedFluid) {
                                form.setValue(
                                  `therapyDetails.${index}.fluid`,
                                  selectedFluid.name,
                                );
                                form.setValue(
                                  `therapyDetails.${index}.fluidId`,
                                  selectedFluid.id,
                                );
                                form.setValue(
                                  `therapyDetails.${index}.volume`,
                                  selectedFluid.volume,
                                );
                              } else if (value === "custom") {
                                // Handle custom fluid entry
                                const customFluid = window.prompt(
                                  "Enter custom fluid name:",
                                );
                                if (customFluid) {
                                  form.setValue(
                                    `therapyDetails.${index}.fluid`,
                                    customFluid,
                                  );
                                  form.setValue(
                                    `therapyDetails.${index}.fluidId`,
                                    undefined,
                                  );
                                  // Let user input volume for custom fluid
                                  const customVolume = window.prompt(
                                    "Enter fluid volume (ml):",
                                  );
                                  form.setValue(
                                    `therapyDetails.${index}.volume`,
                                    Number(customVolume) || 0,
                                  );
                                }
                              }
                            }}
                            value={
                              field.value
                                ? zsVehicle?.inventory.fluids.find(
                                    (f) => f.name === field.value,
                                  )?.id || "custom"
                                : ""
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select fluid type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="custom">
                                Custom Fluid
                              </SelectItem>
                              {zsVehicle?.inventory.fluids.map((fluid) => (
                                <SelectItem key={fluid.id} value={fluid.id}>
                                  {fluid.name} ({fluid.currentStock} in stock)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Volume */}
                    <FormField
                      control={form.control}
                      name={`therapyDetails.${index}.volume`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Volume (ml)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Admin Set */}
                    <FormField
                      control={form.control}
                      name={`therapyDetails.${index}.admin`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Administration Set</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select admin set" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10dropper">
                                10 Dropper
                              </SelectItem>
                              <SelectItem value="20dropper">
                                20 Dropper
                              </SelectItem>
                              <SelectItem value="60dropper">
                                60 Dropper
                              </SelectItem>
                              <SelectItem value="extensionSet">
                                Extension Set
                              </SelectItem>
                              <SelectItem value="buretteSet">
                                Burette Set
                              </SelectItem>
                              <SelectItem value="bloodAdminSet">
                                Blood Admin Set
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Rate */}
                    <FormField
                      control={form.control}
                      name={`therapyDetails.${index}.rate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rate</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Time */}
                    <FormField
                      control={form.control}
                      name={`therapyDetails.${index}.time`}
                      render={() => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <TimePicker
                              name={`therapyDetails.${index}.time`}
                              showUnknownOption
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Jelco */}
                    <FormField
                      control={form.control}
                      name={`therapyDetails.${index}.jelco`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jelco Size</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select jelco size" />
                            </SelectTrigger>
                            <SelectContent>
                              {["14G", "16G", "18G", "20G", "22G", "24G"].map(
                                (size) => (
                                  <SelectItem key={size} value={size}>
                                    {size}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Site */}
                    <FormField
                      control={form.control}
                      name={`therapyDetails.${index}.site`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insertion Site</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select insertion site" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "Right Antecubital",
                                "Left Antecubital",
                                "Right Hand",
                                "Left Hand",
                                "Right Forearm",
                                "Left Forearm",
                                "Right Foot",
                                "Left Foot",
                                "Right External Jugular",
                                "Left External Jugular",
                                "Scalp",
                              ].map((site) => (
                                <SelectItem key={site} value={site}>
                                  {site}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Volume Administered */}
                    <FormField
                      control={form.control}
                      name={`therapyDetails.${index}.volumeAdministered`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Volume Given (ml)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={!form.formState.isDirty}
            className="self-end"
            onClick={() => {
              console.log("form.getValues() 🚀", form.getValues());
            }}
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
