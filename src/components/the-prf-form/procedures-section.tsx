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
import { DatePicker, Group } from "react-aria-components";
import { CalendarDate } from "@internationalized/date";
import { DateInput } from "../ui/datefield-rac";
import { cn } from "@/lib/utils";
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
    values: prf_from_store?.prfData?.procedures?.data,
    defaultValues: prf_from_store?.prfData?.procedures?.data || {
      airway: {
        ett: false,
        ettSize: undefined,
        depth: undefined,
        ettCuffPressure: "Not Measured",
        gastricTube: false,
        iGel: false,
        lma: false,
        lta: false,
        lateral: false,
        needleAirway: false,
        opa: false,
        rsi: false,
        suction: false,
        surgicalCric: false,
      },
      alignment: {
        extrication: false,
        headblocks: false,
        ked: false,
        logroll: false,
        mils: false,
        scoop: false,
        spiderHarness: false,
        spineboard: false,
        splint: false,
        tracIii: false,
      },
      breathing: {
        bvm: false,
        chestDecompression: false,
        cpap: false,
        etco2: false,
        icd: false,
        l: false,
        r: false,
        date: new Date(),
        oxygen: false,
        spo2: false,
        ventilation: false,
        ventilator: undefined,
        mode: undefined,
        peep: undefined,
        pip: undefined,
        fio2: undefined,
        ie: undefined,
        tv: undefined,
        rate: undefined,
      },
      circulation: {
        blood: false,
        bolus: false,
        buretrol: false,
        cpr: false,
        cardioversion: false,
        centralIv: false,
        defib: false,
        dialAFlow: false,
        ecg: false,
        lead12: false,
        fluidWarmer: false,
        hiCapLine: false,
        infusionPump: false,
        infusion: false,
        io: false,
        pacing: false,
        peripheralIv: false,
        plasma: false,
        syringeDriver: false,
      },
    },
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
      EmployeeID: zsEmployee.id,
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="flex flex-col space-y-8"
      >
        <div className="flex items-center justify-between">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Procedures
          </h3>
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue="airway"
          className="space-y-4"
        >
          {/* Airway Section */}
          <AccordionItem
            value="airway"
            className={cn(
              Object.keys(form.formState.errors).some(key => key.startsWith('airway'))
                ? "border-destructive"
                : ""
            )}
          >
            <AccordionTrigger
              className={cn(
                "text-lg font-semibold",
                Object.keys(form.formState.errors).some(key => key.startsWith('airway'))
                  ? "text-destructive"
                  : ""
              )}
            >
              Airway
            </AccordionTrigger>
            <AccordionContent className="space-y-6 p-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
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
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="airway.ettSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ETT SIZE (mm)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
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
                            <Input type="number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="airway.ettCuffPressure"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>E.T.T. CUFF PRESSURE</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            {[
                              "20-30cmH2O",
                              "Cuff Not Inflated",
                              "Not Measured",
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
                <div className="grid grid-cols-2 gap-4">
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
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Alignment Section */}
          <AccordionItem
            value="alignment"
            className={cn(
              Object.keys(form.formState.errors).some(key => key.startsWith('alignment'))
                ? "border-destructive"
                : ""
            )}
          >
            <AccordionTrigger
              className={cn(
                "text-lg font-semibold",
                Object.keys(form.formState.errors).some(key => key.startsWith('alignment'))
                  ? "text-destructive"
                  : ""
              )}
            >
              Alignment
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-4">
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
            </AccordionContent>
          </AccordionItem>

          {/* Breathing Section */}
          <AccordionItem
            value="breathing"
            className={cn(
              Object.keys(form.formState.errors).some(key => key.startsWith('breathing'))
                ? "border-destructive"
                : ""
            )}
          >
            <AccordionTrigger
              className={cn(
                "text-lg font-semibold",
                Object.keys(form.formState.errors).some(key => key.startsWith('breathing'))
                  ? "text-destructive"
                  : ""
              )}
            >
              Breathing
            </AccordionTrigger>
            <AccordionContent className="space-y-6 p-4">
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
              <div className="max-w-md">
                <FormField
                  control={form.control}
                  name="breathing.date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Date
                        <span className="ml-2 text-xs text-muted-foreground">
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
                                label="Last Dr Visit"
                                className="pe-9"
                              />
                            </Group>
                          </div>
                        </DatePicker>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
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
            </AccordionContent>
          </AccordionItem>

          {/* Circulation Section */}
          <AccordionItem
            value="circulation"
            className={cn(
              Object.keys(form.formState.errors).some(key => key.startsWith('circulation'))
                ? "border-destructive"
                : ""
            )}
          >
            <AccordionTrigger
              className={cn(
                "text-lg font-semibold",
                Object.keys(form.formState.errors).some(key => key.startsWith('circulation'))
                  ? "text-destructive"
                  : ""
              )}
            >
              Circulation
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-4">
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button
          type="submit"
          disabled={!form.formState.isDirty}
          className="w-full self-end sm:w-auto"
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
