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
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useUpdatePrf } from "@/hooks/prf/useUpdatePrf";
import { PRF_FORM } from "@/interfaces/prf-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ProceduresSchema, ProceduresType } from "@/interfaces/prf-schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useZuStandEmployeeStore } from "@/lib/zuStand/employee";

export default function ProceduresForm() {
  const prfId = usePathname().split("/")[2];
  const prf_from_store = useStore((state) => state.prfForms).find(
    (prf) => prf.prfFormId == prfId,
  );

  const updatePrfQuery = useUpdatePrf();
  const router = useRouter();

  const { zsEmployee } = useZuStandEmployeeStore();

  const form = useForm<ProceduresType>({
    resolver: zodResolver(ProceduresSchema),
    defaultValues: prf_from_store?.prfData?.procedures?.data || {},
  });

  function onSubmit(values: ProceduresType) {

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
        procedures: {
          data: values,
          isCompleted: true,
          isOptional: false,
        },
      },
      EmployeeID: zsEmployee?.employeeNumber.toString(),
    };

    updatePrfQuery.mutate(prfUpdateValue, {
      onSuccess: (data) => {
        toast.success("Procedures Information Updated", {
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
            Procedures
          </h3>
        </div>

        <Accordion type="single" collapsible defaultValue="airway">
          {/* Airway Section */}
          <AccordionItem value="airway" className="">
            <AccordionTrigger className="p-2 text-lg font-semibold">
              Airway
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-2 gap-4 space-y-4 p-2">
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="airway.ett"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>E.T.T.</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="airway.ettSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ETT SIZE (mm)</FormLabel>
                      <FormControl>
                        <Input min={"0"} type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="airway.depth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DEPTH (cm)</FormLabel>
                      <FormControl>
                        <Input min={"0"} type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="airway.ettCuffPressure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E.T.T. CUFF PRESSURE</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row space-y-1"
                        >
                          {[
                            "20-30cmH2O",
                            "CUFF NOT INFLATED",
                            "NOT MEASURED",
                          ].map((option) => (
                            <FormItem
                              key={option}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={option} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 space-y-2 px-2">
                {[
                  "gastricTube",
                  "iGel",
                  "lma",
                  "lta",
                  "lateral",
                  "needleAirway",
                  "opa",
                  "rsi",
                  "suction",
                  "surgicalCric",
                ].map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name={`airway.${item}` as "airway.gastricTube"}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>{item.toUpperCase()}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Alignment Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Alignment</h4>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {[
                "extrication",
                "headblocks",
                "ked",
                "logroll",
                "mils",
                "scoop",
                "spiderHarness",
                "spineboard",
                "splint",
                "tracIii",
              ].map((item) => (
                <FormField
                  key={item}
                  control={form.control}
                  name={`alignment.${item}` as "alignment.extrication"}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>{item.toUpperCase()}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          {/* Breathing Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Breathing</h4>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {[
                "bvm",
                "chestDecompression",
                "cpap",
                "etco2",
                "icd",
                "l",
                "r",
                "oxygen",
                "spo2",
                "ventilation",
              ].map((item) => (
                <FormField
                  key={item}
                  control={form.control}
                  name={`breathing.${item}` as "breathing.bvm"}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>{item.toUpperCase()}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormField
              control={form.control}
              name="breathing.date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {[
                "ventilator",
                "mode",
                "peep",
                "pip",
                "fio2",
                "ie",
                "tv",
                "rate",
              ].map((item) => (
                <FormField
                  key={item}
                  control={form.control}
                  name={`breathing.${item}` as "breathing.ventilator"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{item.toUpperCase()}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          {/* Circulation Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Circulation</h4>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {[
                "blood",
                "bolus",
                "buretrol",
                "cpr",
                "cardioversion",
                "centralIv",
                "defib",
                "dialAFlow",
                "ecg",
                "lead12",
                "fluidWarmer",
                "hiCapLine",
                "infusionPump",
                "infusion",
                "io",
                "pacing",
                "peripheralIv",
                "plasma",
                "syringeDriver",
              ].map((item) => (
                <FormField
                  key={item}
                  control={form.control}
                  name={`circulation.${item}` as "circulation.blood"}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>
                        {item.toUpperCase().replace("_", " ")}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
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
            "Save Procedures"
          )}
        </Button>
      </form>
    </Form>
  );
}
