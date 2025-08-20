"use client";

import React, { useState } from "react";
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
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useUpdatePrf } from "@/hooks/prf/useUpdatePrf";
import { PRF_FORM } from "@/interfaces/prf-form";
import { toast } from "sonner";
import { CalendarIcon, Loader2 } from "lucide-react";
import {
  PatientHandoverSchema,
  PatientHandoverType,
} from "@/interfaces/prf-schema";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { SignatureField } from "@/components/signature-field";
import { SignaturePreview } from "@/components/signature-preview";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useZuStandEmployeeStore } from "@/lib/zuStand/employee";

export default function PatientHandoverForm() {
  const path = usePathname();
  const prfId = path.split("/")[2];
  const prf_from_store = useStore((state) => state.prfForms).find(
    (prf) => prf.prfFormId == prfId,
  );
  const { zsEmployee } = useZuStandEmployeeStore();
  const updatePrfQuery = useUpdatePrf();
  const router = useRouter();
  // const user = useStore((state) => state.user);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [currentSignatureField, setCurrentSignatureField] = useState<
    "patientSignature" | "witnessSignature" | null
  >(null);

  const form = useForm<PatientHandoverType>({
    resolver: zodResolver(PatientHandoverSchema),
    defaultValues: {
      fullName: prf_from_store?.prfData?.patient_handover?.data?.fullName || "",
      date: prf_from_store?.prfData?.patient_handover?.data?.date
        ? new Date(prf_from_store.prfData.patient_handover.data.date)
        : new Date(),
      patientSignature:
        prf_from_store?.prfData?.patient_handover?.data?.patientSignature || "",
      witnessSignature:
        prf_from_store?.prfData?.patient_handover?.data?.witnessSignature || "",
    },
  });

  function onSubmit(values: PatientHandoverType) {
    if (!zsEmployee) {
      // no needed .. just for building
      return;
    }
    const prfUpdateValue: PRF_FORM = {
      prfFormId: prfId,
      prfData: {
        ...prf_from_store?.prfData,
        patient_handover: {
          data: values,
          isCompleted: true,
          isOptional: false,
        },
      },
      EmployeeID: zsEmployee.id || "2", // fallback
    };

    updatePrfQuery.mutate(prfUpdateValue, {
      onSuccess: () => {
        toast.success("Patient Handover Information Updated", {
          duration: 3000,
          position: "bottom-right",
          action: {
            label: "View",
            onClick: () => router.push(path),
          },
        });
        router.push(`/edit-prf/${prfId}`);
      },
      onError: () => {
        toast.error("An error occurred", {
          duration: 3000,
          position: "bottom-right",
        });
      },
    });
  }

  const handleEditSignature =
    (field: "patientSignature" | "witnessSignature") =>
    (event: React.MouseEvent) => {
      event.preventDefault();
      setCurrentSignatureField(field);
      setSignatureModalOpen(true);
    };

  const handleSaveSignature = (signature: string) => {
    if (currentSignatureField) {
      form.setValue(currentSignatureField, signature, { shouldDirty: true });
      setSignatureModalOpen(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-8"
      >
        <div className="flex items-center justify-between">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Refusal of Treatment / Transport Waiver
          </h3>
        </div>
        <p className="col-span-full flex flex-row px-6 text-sm text-muted-foreground">
          &quot;I, the patient or responsible person, hereby waive any treatment
          or transportation offered to me by the National EMS and understand
          that by signing this waiver, I indemnify the National EMS from all
          further responsibility for my well-being henceforth.&quot;
        </p>

        <div className="grid grid-cols-1 items-center justify-center gap-2 md:grid-cols-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Handover Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => field.onChange(date)}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full flex-col items-start justify-start gap-3 min-[1197px]:flex-row min-[1197px]:items-center">
          <FormField
            control={form.control}
            name="patientSignature"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Patient Signature</FormLabel>
                <FormControl>
                  <SignaturePreview
                    label="Patient Signature"
                    value={field.value}
                    onEdit={handleEditSignature("patientSignature")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="witnessSignature"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Witness Signature</FormLabel>
                <FormControl>
                  <SignaturePreview
                    label="Witness Signature"
                    value={field.value}
                    onEdit={handleEditSignature("witnessSignature")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={!form.formState.isDirty}
          className="w-full sm:w-auto min-[1197px]:self-end"
        >
          {form.formState.isSubmitting || updatePrfQuery.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
            </>
          ) : (
            "Save Patient Handover"
          )}
        </Button>
      </form>
      <Dialog open={signatureModalOpen} onOpenChange={setSignatureModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentSignatureField === "patientSignature"
                ? "Patient Signature"
                : "Witness Signature"}
            </DialogTitle>
          </DialogHeader>
          <SignatureField
            label={
              currentSignatureField === "patientSignature"
                ? "Patient Signature"
                : "Witness Signature"
            }
            onSave={handleSaveSignature}
            onCancel={() => setSignatureModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Form>
  );
}
