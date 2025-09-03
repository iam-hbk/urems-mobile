"use client";

import React from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import {
  ensurePRFResponseSectionByName,
  useUpdatePrfResponse,
} from "@/hooks/prf/usePrfForms";
import { toast } from "sonner";
import {
  MechanismOfInjurySchema,
  MechanismOfInjuryType,
} from "@/interfaces/prf-schema";
import { Switch } from "../ui/switch";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";

export default function MechanismOfInjuryForm() {
  const prfId = usePathname().split("/")[2];
  const qc = useQueryClient();

  const updatePrfQuery = useUpdatePrfResponse(prfId, "mechanism_of_injury");
  const router = useRouter();

  const form = useForm<MechanismOfInjuryType>({
    resolver: zodResolver(MechanismOfInjurySchema),
    mode: "all",
    defaultValues: async () => {
      const section = await ensurePRFResponseSectionByName(
        qc,
        prfId,
        "mechanism_of_injury",
      );
      return {
        ...section.data,
        extractionMethod:
          section.data.extractionMethod &&
            section.data.extractionMethod.length > 0
            ? section.data.extractionMethod
            : undefined,
        helmetRemoval:
          section.data.helmetRemoval && section.data.helmetRemoval.length > 0
            ? section.data.helmetRemoval
            : undefined,
        burns: {
          ...section.data.burns,
          duration: section.data.burns?.duration || "",
          type:
            section.data.burns?.type && section.data.burns.type.length > 0
              ? section.data.burns.type
              : undefined,
          bsa:
            section.data.burns?.bsa && section.data.burns.bsa.length > 0
              ? section.data.burns.bsa
              : undefined,
        },
        vehicleType: {
          ...section.data.vehicleType,
          vehicleTypesSelection:
            section.data.vehicleType?.vehicleTypesSelection &&
              section.data.vehicleType.vehicleTypesSelection.length > 0
              ? section.data.vehicleType.vehicleTypesSelection
              : undefined,
        },
        speed: section.data.speed || undefined,
        personType: section.data.personType || undefined,
        drowning: {
          ...section.data.drowning,
          duration: section.data.drowning?.duration || undefined,
        },
        entrapment: {
          ...section.data.entrapment,
          duration: section.data.entrapment?.duration || undefined,
        },
      };
    },
  });

  function onSubmit(values: MechanismOfInjuryType) {
    updatePrfQuery.mutate(
      { data: values, isCompleted: true },
      {
        onSuccess: () => {
          toast.success("Mechanism of Injury Information Updated", {
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
        className="flex flex-col space-y-8"
      >
        <div className="flex items-center justify-between">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Mechanism of Injury
          </h3>
        </div>

        {/* Vehicle Related Injuries Section */}
        <div className="space-y-8 rounded-lg border p-4">
          <h4 className="text-xl font-semibold">Vehicle Related Injuries</h4>

          {/* vehicle type */}
          <FormField
            control={form.control}
            name="vehicleType.occured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Vehicle type</FormLabel>
                  <FormDescription>Select vehicle type?</FormDescription>
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

          {form.watch("vehicleType.occured") && (
            <>
              <FormField
                control={form.control}
                name="vehicleType.vehicleTypesSelection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-4 gap-2"
                      >
                        {[
                          "MVA",
                          "MBA",
                          "PVA",
                          "Bus",
                          "Cyclist",
                          "Taxi",
                          "Train",
                          "Truck",
                          "Aircraft",
                        ].map((vehicle) => (
                          <FormItem
                            key={vehicle
                              .replace(" ", "")
                              .replace("-", "")
                              .toLowerCase()
                              .trim()}
                            className="flex max-w-32 items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={vehicle} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {vehicle}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* impact type */}
              <FormField
                control={form.control}
                name="impactType"
                render={() => (
                  <FormItem>
                    <FormLabel>Impact Type</FormLabel>
                    <div className="flex flex-wrap gap-4">
                      {[
                        "Frontal Impact",
                        "Rear",
                        "Rollover",
                        "T - Boned",
                        "Vehicle Spun",
                      ].map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="impactType"
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
                                      | "Frontal Impact"
                                      | "Rear"
                                      | "Rollover"
                                      | "T - Boned"
                                      | "Vehicle Spun",
                                    )}
                                    onCheckedChange={(checked) => {
                                      // make it an empty array if field value is undefined
                                      const currentValue = Array.isArray(
                                        field.value,
                                      )
                                        ? field.value
                                        : [];

                                      if (checked) {
                                        // if checked
                                        // not included
                                        if (
                                          !currentValue.includes(
                                            item as
                                            | "Frontal Impact"
                                            | "Rear"
                                            | "Rollover"
                                            | "T - Boned"
                                            | "Vehicle Spun",
                                          )
                                        ) {
                                          field.onChange([
                                            ...currentValue,
                                            item as
                                            | "Frontal Impact"
                                            | "Rear"
                                            | "Rollover"
                                            | "T - Boned"
                                            | "Vehicle Spun",
                                          ]);
                                        }
                                      } else {
                                        // remove item if unchecked
                                        field.onChange(
                                          currentValue.filter(
                                            (value) => value !== item,
                                          ),
                                        );
                                      }
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

              {/* speed */}
              <FormField
                control={form.control}
                name="speed"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Speed</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {["<60km/h", "60-100km/h", ">120km/h"].map((speed) => (
                          <FormItem
                            key={speed}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={speed} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {speed}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* role in injury - driver, passenger, unknown */}
              <FormField
                control={form.control}
                name="personType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Person Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row items-center space-x-4"
                      >
                        {["Driver", "Passenger", "Unknown"].map((person) => (
                          <FormItem
                            key={person}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={person} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {person}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* safety features */}
              <FormField
                control={form.control}
                name="safetyFeatures"
                render={() => (
                  <FormItem>
                    <FormLabel>Safety Features</FormLabel>
                    <div className="flex flex-wrap gap-4">
                      {["Airbags", "Restrained"].map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="safetyFeatures"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(
                                    item as "Airbags" | "Restrained",
                                  )}
                                  onCheckedChange={(checked) => {
                                    const currentValue = Array.isArray(
                                      field.value,
                                    )
                                      ? field.value
                                      : [];

                                    if (checked) {
                                      // if checked
                                      // not included
                                      if (
                                        !currentValue.includes(
                                          item as "Airbags" | "Restrained",
                                        )
                                      ) {
                                        field.onChange([
                                          ...currentValue,
                                          item as "Airbags" | "Restrained",
                                        ]);
                                      }
                                    } else {
                                      // remove item if unchecked
                                      field.onChange(
                                        currentValue.filter(
                                          (value) => value !== item,
                                        ),
                                      );
                                    }
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
        </div>

        {/* Other Mechanisms of Injury */}
        <div className="space-y-8 rounded-lg border p-4">
          <h4 className="text-xl font-semibold">Other Mechanisms of Injury</h4>

          {/* Falls */}
          <FormField
            control={form.control}
            name="falls.type"
            render={() => (
              <FormItem>
                <FormLabel>Falls Type</FormLabel>
                <div className="flex flex-wrap gap-4">
                  {["Bed", "Same Level", ">3m", ">10m"].map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="falls.type"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(
                                item as "Bed" | "Same Level" | ">3m" | ">10m",
                              )}
                              onCheckedChange={(checked) => {
                                const currentValue = Array.isArray(field.value)
                                  ? field.value
                                  : [];

                                if (checked) {
                                  // if checked
                                  // not included
                                  if (
                                    !currentValue.includes(
                                      item as
                                      | "Bed"
                                      | "Same Level"
                                      | ">3m"
                                      | ">10m",
                                    )
                                  ) {
                                    field.onChange([
                                      ...currentValue,
                                      item as
                                      | "Bed"
                                      | "Same Level"
                                      | ">3m"
                                      | ">10m",
                                    ]);
                                  }
                                } else {
                                  // remove item if unchecked
                                  field.onChange(
                                    currentValue.filter(
                                      (value) => value !== item,
                                    ),
                                  );
                                }
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

          {/* weapon type */}
          <FormField
            control={form.control}
            name="falls.weaponType"
            render={() => (
              <FormItem>
                <FormLabel>Weapon Type</FormLabel>
                <div className="flex flex-wrap gap-4">
                  {["Gun Shot Wound", "AR", "Handgun", "Rifle"].map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="falls.weaponType"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(
                                item as
                                | "Gun Shot Wound"
                                | "AR"
                                | "Handgun"
                                | "Rifle",
                              )}
                              onCheckedChange={(checked) => {
                                // make it an empty array if field value is undefined
                                const currentValue = Array.isArray(field.value)
                                  ? field.value
                                  : [];

                                if (checked) {
                                  // if checked
                                  // not included
                                  if (
                                    !currentValue.includes(
                                      item as
                                      | "Gun Shot Wound"
                                      | "AR"
                                      | "Handgun"
                                      | "Rifle",
                                    )
                                  ) {
                                    field.onChange([
                                      ...currentValue,
                                      item as
                                      | "Gun Shot Wound"
                                      | "AR"
                                      | "Handgun"
                                      | "Rifle",
                                    ]);
                                  }
                                } else {
                                  // remove item if unchecked
                                  field.onChange(
                                    currentValue.filter(
                                      (value) => value !== item,
                                    ),
                                  );
                                }
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

          {/* Violence Type */}
          <FormField
            control={form.control}
            name="violenceType"
            render={() => (
              <FormItem>
                <FormLabel>Violence Type</FormLabel>
                <div className="flex flex-wrap gap-4">
                  {[
                    "Assault",
                    "Stabbing",
                    "Rape",
                    "Strangulation",
                    "Armed Robbery",
                  ].map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="violenceType"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(
                                item as
                                | "Assault"
                                | "Stabbing"
                                | "Rape"
                                | "Strangulation"
                                | "Armed Robbery",
                              )}
                              onCheckedChange={(checked) => {
                                // make it an empty array if field value is undefined
                                const currentValue = Array.isArray(field.value)
                                  ? field.value
                                  : [];

                                if (checked) {
                                  // if checked
                                  // not included
                                  if (
                                    !currentValue.includes(
                                      item as
                                      | "Assault"
                                      | "Stabbing"
                                      | "Rape"
                                      | "Strangulation"
                                      | "Armed Robbery",
                                    )
                                  ) {
                                    field.onChange([
                                      ...currentValue,
                                      item as
                                      | "Assault"
                                      | "Stabbing"
                                      | "Rape"
                                      | "Strangulation"
                                      | "Armed Robbery",
                                    ]);
                                  }
                                } else {
                                  // remove item if unchecked
                                  field.onChange(
                                    currentValue.filter(
                                      (value) => value !== item,
                                    ),
                                  );
                                }
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

          {/* Other Incidents */}
          <FormField
            control={form.control}
            name="otherIncidents"
            render={() => (
              <FormItem>
                <FormLabel>Other Incidents</FormLabel>
                <div className="flex flex-wrap gap-4">
                  {[
                    "Industrial Accident",
                    "Sports Injury",
                    "Limited Patient Access",
                    "Self-Inflicted Wounds",
                    "Suicidal Tendencies",
                  ].map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="otherIncidents"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(
                                item as
                                | "Industrial Accident"
                                | "Sports Injury"
                                | "Limited Patient Access"
                                | "Self-Inflicted Wounds"
                                | "Suicidal Tendencies",
                              )}
                              onCheckedChange={(checked) => {
                                const currentValue = Array.isArray(field.value)
                                  ? field.value
                                  : [];

                                if (checked) {
                                  // if checked
                                  // not included
                                  if (
                                    !currentValue.includes(
                                      item as
                                      | "Industrial Accident"
                                      | "Sports Injury"
                                      | "Limited Patient Access"
                                      | "Self-Inflicted Wounds"
                                      | "Suicidal Tendencies",
                                    )
                                  ) {
                                    field.onChange([
                                      ...currentValue,
                                      item as
                                      | "Industrial Accident"
                                      | "Sports Injury"
                                      | "Limited Patient Access"
                                      | "Self-Inflicted Wounds"
                                      | "Suicidal Tendencies",
                                    ]);
                                  }
                                } else {
                                  // remove item if unchecked
                                  field.onChange(
                                    currentValue.filter(
                                      (value) => value !== item,
                                    ),
                                  );
                                }
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
        </div>

        {/* Environmental Injuries */}
        <div className="space-y-8 rounded-lg border p-4">
          <h4 className="text-xl font-semibold">Environmental Injuries</h4>

          {/* Entrapment */}
          <FormField
            control={form.control}
            name="entrapment.occurred"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Entrapment</FormLabel>
                  <FormDescription>Did entrapment occur?</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      if (!checked) {
                        form.setValue("entrapment.duration", undefined);
                      }
                      field.onChange(checked);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("entrapment.occurred") && (
            <FormField
              control={form.control}
              name="entrapment.duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entrapment Duration</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {[
                        "<30 Mins",
                        "30mins-1hr",
                        "1-2hr",
                        ">2hr",
                        "Unknown",
                      ].map((duration) => (
                        <FormItem
                          key={duration}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={duration} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {duration}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {/* Crush Injury */}
          <FormField
            control={form.control}
            name="crushInjury"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Crush Injury</FormLabel>
                  <FormDescription>Was there a crush injury?</FormDescription>
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

          {/* Drowning */}
          <FormField
            control={form.control}
            name="drowning.occurred"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Drowning</FormLabel>
                  <FormDescription>Did drowning occur?</FormDescription>
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

          {form.watch("drowning.occurred") && (
            <>
              <FormField
                control={form.control}
                name="drowning.duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drowning Duration</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {["< 5min", "5 - 10min", "> 10min", "Unknown"].map(
                          (duration) => (
                            <FormItem
                              key={duration}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={duration} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {duration}
                              </FormLabel>
                            </FormItem>
                          ),
                        )}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="drowning.type"
                render={() => (
                  <FormItem>
                    <FormLabel>Drowning Type</FormLabel>
                    <div className="flex flex-wrap gap-4">
                      {["Cold Water", "River / Dam", "Flood", "Pool"].map(
                        (item) => (
                          <FormField
                            key={item}
                            control={form.control}
                            name="drowning.type"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(
                                      item as
                                      | "Cold Water"
                                      | "River / Dam"
                                      | "Flood"
                                      | "Pool",
                                    )}
                                    onCheckedChange={(checked) => {
                                      // make it an empty array if field value is undefined
                                      const currentValue = Array.isArray(
                                        field.value,
                                      )
                                        ? field.value
                                        : [];

                                      if (checked) {
                                        // if checked
                                        // not included
                                        if (
                                          !currentValue.includes(
                                            item as
                                            | "Cold Water"
                                            | "River / Dam"
                                            | "Flood"
                                            | "Pool",
                                          )
                                        ) {
                                          field.onChange([
                                            ...currentValue,
                                            item as
                                            | "Cold Water"
                                            | "River / Dam"
                                            | "Flood"
                                            | "Pool",
                                          ]);
                                        }
                                      } else {
                                        // remove item if unchecked
                                        field.onChange(
                                          currentValue.filter(
                                            (value) => value !== item,
                                          ),
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item}
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

              <FormField
                control={form.control}
                name="drowning.bystanderCPR"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Bystander CPR</FormLabel>
                      <FormDescription>
                        Was bystander CPR performed?
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
            </>
          )}

          {/* Burns */}
          <FormField
            control={form.control}
            name="burns.occurred"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Burns</FormLabel>
                  <FormDescription>Did burns occur?</FormDescription>
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

          {form.watch("burns.occurred") && (
            <>
              <FormField
                control={form.control}
                name="burns.bsa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Burn Surface Area</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {["<15%", ">15%"].map((bsa) => (
                          <FormItem
                            key={bsa}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={bsa} />
                            </FormControl>
                            <FormLabel className="font-normal">{bsa}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="burns.confinedSpace"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Confined Space
                      </FormLabel>
                      <FormDescription>
                        Did the burn occur in a confined space?
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

              <FormField
                control={form.control}
                name="burns.duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Burn Duration</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={""} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="burns.type"
                render={() => (
                  <FormItem>
                    <FormLabel>Burn Type</FormLabel>
                    <div className="flex flex-wrap gap-4">
                      {[
                        "Chemical",
                        "Electrical",
                        "Flash",
                        "Lightning",
                        "Steam",
                        "Smoke Inhalation",
                        "Thermal",
                      ].map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="burns.type"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(
                                    item as
                                    | "Chemical"
                                    | "Electrical"
                                    | "Flash"
                                    | "Lightning"
                                    | "Steam"
                                    | "Smoke Inhalation"
                                    | "Thermal",
                                  )}
                                  onCheckedChange={(checked) => {
                                    // make it an empty array if field value is undefined
                                    const currentValue = Array.isArray(
                                      field.value,
                                    )
                                      ? field.value
                                      : [];

                                    if (checked) {
                                      // if checked
                                      // not included
                                      if (
                                        !currentValue.includes(
                                          item as
                                          | "Chemical"
                                          | "Electrical"
                                          | "Flash"
                                          | "Lightning"
                                          | "Steam"
                                          | "Smoke Inhalation"
                                          | "Thermal",
                                        )
                                      ) {
                                        field.onChange([
                                          ...currentValue,
                                          item as
                                          | "Chemical"
                                          | "Electrical"
                                          | "Flash"
                                          | "Lightning"
                                          | "Steam"
                                          | "Smoke Inhalation"
                                          | "Thermal",
                                        ]);
                                      }
                                    } else {
                                      // remove item if unchecked
                                      field.onChange(
                                        currentValue.filter(
                                          (value) => value !== item,
                                        ),
                                      );
                                    }
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
        </div>

        <Button
          type="submit"
          disabled={!form.formState.isDirty}
          className="w-full self-end sm:w-auto"
          onClick={() => {
            // console.log("form values", form.getValues());
            // console.log("form errors", form.formState.errors);
          }}
        >
          {form.formState.isSubmitting || updatePrfQuery.isPending ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" /> Saving
            </>
          ) : (
            "Save Mechanism of Injury"
          )}
        </Button>
      </form>
    </Form>
  );
}
