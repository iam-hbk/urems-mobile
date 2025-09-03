"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitErrorHandler } from "react-hook-form";
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
import {
  ensurePRFResponseSectionByName,
  useUpdatePrfResponse,
} from "@/hooks/prf/usePrfForms";
import { useQueryClient } from "@tanstack/react-query";
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

export default function ProceduresForm() {
  const prfId = usePathname().split("/")[2];
  const qc = useQueryClient();

  const updatePrfQuery = useUpdatePrfResponse(prfId, "procedures");
  const router = useRouter();

  const form = useForm<ProceduresType>({
    resolver: zodResolver(ProceduresSchema),
    defaultValues: async () => {
      const section = await ensurePRFResponseSectionByName(
        qc,
        prfId,
        "procedures",
      );
      return section.data;
    },
  });

  function onSubmit(values: ProceduresType) {
    updatePrfQuery.mutate(
      { data: values, isCompleted: true },
      {
        onSuccess: () => {
          toast.success("Procedures Information Updated", {
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
  const onError: SubmitErrorHandler<ProceduresType> = (errors) => {
    const firstMessage =
      Object.values(errors)
        .map((err) => {
          if (err && typeof err === "object" && "message" in err) {
            const maybeMessage = (err as { message?: unknown }).message;
            return typeof maybeMessage === "string" ? maybeMessage : null;
          }
          return null;
        })
        .find(Boolean) || "Please fill in all required fields";

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
              Object.keys(form.formState.errors).some((key) =>
                key.startsWith("airway"),
              )
                ? "border-destructive"
                : "",
            )}
          >
            <AccordionTrigger
              className={cn(
                "text-lg font-semibold",
                Object.keys(form.formState.errors).some((key) =>
                  key.startsWith("airway"),
                )
                  ? "text-destructive"
                  : "",
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
              Object.keys(form.formState.errors).some((key) =>
                key.startsWith("alignment"),
              )
                ? "border-destructive"
                : "",
            )}
          >
            <AccordionTrigger
              className={cn(
                "text-lg font-semibold",
                Object.keys(form.formState.errors).some((key) =>
                  key.startsWith("alignment"),
                )
                  ? "text-destructive"
                  : "",
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
              Object.keys(form.formState.errors).some((key) =>
                key.startsWith("breathing"),
              )
                ? "border-destructive"
                : "",
            )}
          >
            <AccordionTrigger
              className={cn(
                "text-lg font-semibold",
                Object.keys(form.formState.errors).some((key) =>
                  key.startsWith("breathing"),
                )
                  ? "text-destructive"
                  : "",
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
                              : new CalendarDate(
                                  new Date().getFullYear(),
                                  new Date().getMonth() + 1,
                                  new Date().getDate(),
                                )
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
                              <DateInput className="pe-9" />
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
              Object.keys(form.formState.errors).some((key) =>
                key.startsWith("circulation"),
              )
                ? "border-destructive"
                : "",
            )}
          >
            <AccordionTrigger
              className={cn(
                "text-lg font-semibold",
                Object.keys(form.formState.errors).some((key) =>
                  key.startsWith("circulation"),
                )
                  ? "text-destructive"
                  : "",
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
