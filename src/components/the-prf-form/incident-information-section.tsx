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
import AddressAutoComplete from "@/components/AddressAutoComplete";

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
      EmployeeID: prf_from_store?.EmployeeID || "2",
    };

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
              <AddressAutoComplete
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
