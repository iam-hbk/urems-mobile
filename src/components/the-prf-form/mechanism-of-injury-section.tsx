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
import { useStore } from "@/lib/store";
import { useUpdatePrf } from "@/hooks/prf/useUpdatePrf";
import { PRF_FORM } from "@/interfaces/prf-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import {
  MechanismOfInjurySchema,
  MechanismOfInjuryType,
} from "@/interfaces/prf-schema";
import { Switch } from "../ui/switch";

export default function MechanismOfInjuryForm() {
  const prfId = usePathname().split("/")[2];
  const prf_from_store = useStore((state) => state.prfForms).find(
    (prf) => prf.prfFormId == prfId,
  );

  const updatePrfQuery = useUpdatePrf();
  const router = useRouter();

  const form = useForm<MechanismOfInjuryType>({
    resolver: zodResolver(MechanismOfInjurySchema),
    defaultValues: prf_from_store?.prfData?.mechanism_of_injury?.data || {},
  });

  function onSubmit(values: MechanismOfInjuryType) {
    const prfUpdateValue: PRF_FORM = {
      prfFormId: prfId,
      prfData: {
        ...prf_from_store?.prfData,
        mechanism_of_injury: {
          data: values,
          isCompleted: true,
          isOptional: false,
        },
      },
    };

    updatePrfQuery.mutate(prfUpdateValue, {
      onSuccess: (data) => {
        toast.success("Mechanism of Injury Information Updated", {
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
            Mechanism of Injury
          </h3>
        </div>

        <FormField
          control={form.control}
          name="vehicleType"
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
                  ].map((vehicle) => (
                    <FormItem
                      key={vehicle
                        .replace(" ", "")
                        .replace("-", "")
                        .toLowerCase()
                        .trim()}
                      className="flex max-w-32 items-center space-x-3 space-y-0 "
                    >
                      <FormControl>
                        <RadioGroupItem value={vehicle} />
                      </FormControl>
                      <FormLabel className="font-normal">{vehicle}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

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
                          <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />

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
                      <FormLabel className="font-normal">{speed}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row items-center space-x-4"
                >
                  {["Driver", "Passenger", "Unknown"].map((person) => (
                    <FormItem
                      key={person}
                      className="flex items-center space-x-3 space-y-0 "
                    >
                      <FormControl>
                        <RadioGroupItem value={person} />
                      </FormControl>
                      <FormLabel className="font-normal">{person}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
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
                        <FormLabel className="font-normal">{item}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />

        {/* Incident Details */}
        <FormField
          control={form.control}
          name="incidentDetails"
          render={() => (
            <FormItem>
              <FormLabel>Incident Details</FormLabel>
              <div className="flex flex-wrap gap-4">
                {["?↓LOC", "Multiple Patients", "P1", "or P4", "on Scene"].map(
                  (item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="incidentDetails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(
                                item as
                                  | "?↓LOC"
                                  | "Multiple Patients"
                                  | "P1"
                                  | "or P4"
                                  | "on Scene",
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
                          <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ),
                )}
              </div>
            </FormItem>
          )}
        />

        {/* Extraction Method */}
        <FormField
          control={form.control}
          name="extractionMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extraction Method</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {[
                    "Ejected",
                    "Removed by Bystander",
                    "Extricated by EMS",
                    "Self-Extricated",
                  ].map((method) => (
                    <FormItem
                      key={method}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={method} />
                      </FormControl>
                      <FormLabel className="font-normal">{method}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Helmet Removal */}
        <FormField
          control={form.control}
          name="helmetRemoval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Helmet Removal</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {["EMS", "Self", "Bystander", "No Helmet"].map((option) => (
                    <FormItem
                      key={option}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={option} />
                      </FormControl>
                      <FormLabel className="font-normal">{option}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
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
                        <FormLabel className="font-normal">{item}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />

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
                        <FormLabel className="font-normal">{item}</FormLabel>
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
          name="falls.weaponType"
          render={() => (
            <FormItem>
              <FormLabel>Weapon Type</FormLabel>
              <div className="flex flex-wrap gap-4">
                {["GSW", "AR", "Handgun", "Rifle"].map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="falls.weaponType"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(
                              item as "GSW" | "AR" | "Handgun" | "Rifle",
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
                        <FormLabel className="font-normal">{item}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />

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
                  onCheckedChange={field.onChange}
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
                    {["<30 Mins", "30mins-1hr", "1-2hr", ">2hr", "Unknown"].map(
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
                    <FormLabel className="text-base">Confined Space</FormLabel>
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
                    <Input {...field} />
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
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
          </>
        )}

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
            "Save Mechanism of Injury"
          )}
        </Button>
      </form>
    </Form>
  );
}
