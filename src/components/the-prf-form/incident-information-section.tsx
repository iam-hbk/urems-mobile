"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitErrorHandler, useForm } from "react-hook-form";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { cn } from "@/lib/utils";
import { IncidentInformationSchema } from "@/interfaces/prf-schema";
import { PRF_FORM } from "@/interfaces/prf-form";
import {
  ensurePRFResponseSectionByName,
  useUpdatePrfResponse,
} from "@/hooks/prf/usePrfForms";
import { usePathname, useRouter } from "next/navigation";

import { toast } from "sonner";
import { AddressInput } from "@/components/address-input";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";

export type IncidentInformationType = z.infer<typeof IncidentInformationSchema>;

type IncidentInformationFormProps = {
  initialData?: PRF_FORM;
};

const IncidentInformationForm = ({}: IncidentInformationFormProps) => {
  const prfId = usePathname().split("/")[2];
  const qc = useQueryClient();

  const updatePrfQuery = useUpdatePrfResponse(prfId, "incident_information");
  const router = useRouter();
  const form = useForm<IncidentInformationType>({
    resolver: zodResolver(IncidentInformationSchema),
    mode: "all",
    defaultValues: async () => {
      const section = await ensurePRFResponseSectionByName(
        qc,
        prfId,
        "incident_information",
      );
      return {
        sceneAddress: section.data.sceneAddress || "",
        dispatchInfo: section.data.dispatchInfo || "",
        onArrival: section.data.onArrival || "",
        chiefComplaint: section.data.chiefComplaint || "",
      };
    },
  });

  function onSubmit(values: IncidentInformationType) {
    updatePrfQuery.mutate(
      {
        data: values,
        isCompleted: true,
      },
      {
        onSuccess: () => {
          toast.success("Incident Information Updated", {
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
  const onError: SubmitErrorHandler<IncidentInformationType> = (errors) => {
    const extractFirstMessage = (err: unknown): string | null => {
      if (!err) return null;
      if (typeof err === "object") {
        if ("message" in (err as Record<string, unknown>)) {
          const maybe = (err as { message?: unknown }).message;
          if (typeof maybe === "string") return maybe;
        }
        for (const value of Object.values(err as Record<string, unknown>)) {
          const found = extractFirstMessage(value);
          if (found) return found;
        }
      }
      return null;
    };

    const firstMessage =
      extractFirstMessage(errors) || "Please fill in all required fields";

    toast.error(firstMessage, {
      duration: 3000,
      position: "top-right",
    });
  };

  return (
    <Accordion
      type="single"
      defaultValue={"location-information"}
      collapsible
      className="w-full"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
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
              <AddressInput
                name="sceneAddress"
                control={form.control}
                label="Scene Address"
                placeholder="Scene Address"
                disabled={updatePrfQuery.isPending}
                className="col-span-full"
                useFullAddressAsValueOnly={true}
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
            disabled={
              form.formState.isDirty === false || updatePrfQuery.isPending
            }
            type="submit"
            className="self-end"
            onClick={() => {
              console.log("form.getValues() 🚀", form.getValues());
              console.log("form.formState.errors 🚀", form.formState.errors);
            }}
          >
            {form.formState.isSubmitting || updatePrfQuery.isPending ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" /> Saving
              </>
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </Form>
    </Accordion>
  );
};

export default IncidentInformationForm;
