"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { cn } from "@/lib/utils";
import { IncidentInformationSchema } from "@/interfaces/prf-schema";
import { PRF_FORM } from "@/interfaces/prf-form";
import { useUpdatePrf } from "@/hooks/prf/useUpdatePrf";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import SceneAddressInput from "../SceneAddressInput";

export type IncidentInformationType = z.infer<typeof IncidentInformationSchema>;

type IncidentInformationFormProps = {
  initialData?: PRF_FORM;
};

const IncidentInformationForm = ({}: IncidentInformationFormProps) => {
  const prfId = usePathname().split("/")[2];
  const prf_from_store = useStore((state) => state.prfForms).find(
    (prf) => prf.prfFormId == prfId,
  );

  const updatePrfQuery = useUpdatePrf();
  const router = useRouter();
  const form = useForm<IncidentInformationType>({
    resolver: zodResolver(IncidentInformationSchema),
    defaultValues: {
      sceneAddress:
        prf_from_store?.prfData.incident_information?.data.sceneAddress || "",
      dispatchInfo:
        prf_from_store?.prfData.incident_information?.data.dispatchInfo || "",
      onArrival:
        prf_from_store?.prfData.incident_information?.data.onArrival || "",
      chiefComplaint:
        prf_from_store?.prfData.incident_information?.data.chiefComplaint || "",
      pastHistory: {
        allergies:
          prf_from_store?.prfData.incident_information?.data.pastHistory
            .allergies || "",
        medication:
          prf_from_store?.prfData.incident_information?.data.pastHistory
            .medication || "",
        medicalHx:
          prf_from_store?.prfData.incident_information?.data.pastHistory
            .medicalHx || "",
        lastMeal:
          prf_from_store?.prfData.incident_information?.data.pastHistory
            .lastMeal || "",
        cva:
          prf_from_store?.prfData.incident_information?.data.pastHistory.cva ||
          false,
        epilepsy:
          prf_from_store?.prfData.incident_information?.data.pastHistory
            .epilepsy || false,
        cardiac:
          prf_from_store?.prfData.incident_information?.data.pastHistory
            .cardiac || false,
        byPass:
          prf_from_store?.prfData.incident_information?.data.pastHistory
            .byPass || false,
        dmOneOrTwo:
          prf_from_store?.prfData.incident_information?.data.pastHistory
            .dmOneOrTwo || false,
        HPT:
          prf_from_store?.prfData.incident_information?.data.pastHistory.HPT ||
          false,
        asthma:
          prf_from_store?.prfData.incident_information?.data.pastHistory
            .asthma || false,
        copd:
          prf_from_store?.prfData.incident_information?.data.pastHistory.copd ||
          false,
      },
    },
  });

  function onSubmit(values: IncidentInformationType) {
    const prfUpdateValue: PRF_FORM = {
      prfFormId: prfId,
      prfData: {
        incident_information: {
          data: values,
          isCompleted: true,
          isOptional: false,
        },
        ...prf_from_store?.prfData,
      },
    };
    console.log(prfUpdateValue);

    updatePrfQuery.mutate(prfUpdateValue, {
      onSuccess: (data) => {
        toast.success("Incident Information Updated", {
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
    <Accordion
      type="single"
      defaultValue={"location-information"}
      collapsible
      className="w-full"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-8"
        >
          <AccordionItem value="location-information">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  Object.keys(form.formState.errors).length > 0,
              })}
            >
              <h4
                className={cn(
                  "col-span-full scroll-m-20 text-lg font-semibold tracking-tight",
                  {
                    "text-destructive":
                      Object.keys(form.formState.errors).length > 0,
                  },
                )}
              >
                Location Information
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              <SceneAddressInput
                name="sceneAddress"
                label="Scene Address"
                placeholder="Scene Address"
              />
              <FormField
                control={form.control}
                name="dispatchInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dispatch Info</FormLabel>
                    <FormControl>
                      <Input placeholder="Dispatch Info" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="onArrival"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>On Arrival</FormLabel>
                    <FormControl>
                      <Input placeholder="On Arrival" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chiefComplaint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chief Complaint</FormLabel>
                    <FormControl>
                      <Input placeholder="Chief Complaint" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="past-history">
            <AccordionTrigger
              className={cn({
                "text-destructive": form.formState.errors.pastHistory,
              })}
            >
              <h4
                className={cn(
                  "col-span-full scroll-m-20 text-lg font-semibold tracking-tight",
                )}
              >
                Past History
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="pastHistory.allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies</FormLabel>
                    <FormControl>
                      <Input placeholder="Allergies" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pastHistory.medication"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medication</FormLabel>
                    <FormControl>
                      <Input placeholder="Medication" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pastHistory.medicalHx"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical History</FormLabel>
                    <FormControl>
                      <Input placeholder="Medical History" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pastHistory.lastMeal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Meal</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Meal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pastHistory.cva"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>CVA</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pastHistory.epilepsy"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Epilepsy</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pastHistory.cardiac"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Cardiac</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pastHistory.byPass"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>ByPass</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pastHistory.dmOneOrTwo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>DM One or Two</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pastHistory.HPT"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>HPT</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pastHistory.asthma"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Asthma</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pastHistory.copd"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>COPD</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
          {/* Submit form */}
          <Button
            disabled={form.formState.isDirty === false}
            type="submit"
            className="self-end"
          >
            Save
          </Button>
        </form>
      </Form>
    </Accordion>
  );
};

export default IncidentInformationForm;
