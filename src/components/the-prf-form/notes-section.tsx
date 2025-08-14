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
  FormMessage,
} from "@/components/ui/form";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useUpdatePrf } from "@/hooks/prf/useUpdatePrf";
import { PRF_FORM } from "@/interfaces/prf-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { NotesType, NotesSchema } from "@/interfaces/prf-schema";
import { Textarea } from "../ui/textarea";

export default function NotesForm() {
  const prfId = usePathname().split("/")[2];
  const prf_from_store = useStore((state) => state.prfForms).find(
    (prf) => prf.prfFormId == prfId,
  );
  
  const updatePrfQuery = useUpdatePrf();
  const router = useRouter();
  
  // Get notes from store
  const { notesByPrfId, updateNotes, clearNotes } = useStore();
  const savedNotes = notesByPrfId[prfId]?.notes || "";

  // Get the original notes from PRF data
  const originalNotes = prf_from_store?.prfData?.notes?.data?.notes || "";

  const form = useForm<NotesType>({
    resolver: zodResolver(NotesSchema),
    values: {
      notes: savedNotes || originalNotes,
    },
  });

  // Watch notes changes and update store
  const notes = form.watch("notes");
  React.useEffect(() => {
    if (notes) {
      updateNotes(prfId, notes);
    }
  }, [notes, prfId, updateNotes]);

  // Check if current notes are different from original PRF data
  const hasChanges = notes !== originalNotes;

  function onSubmit(values: NotesType) {
    const prfUpdateValue: PRF_FORM = {
      prfFormId: prfId,
      prfData: {
        ...prf_from_store?.prfData,
        notes: {
          data: values,
          isCompleted: true,
          isOptional: true,
        },
      },
      EmployeeID: prf_from_store?.EmployeeID || "2",
    };

    updatePrfQuery.mutate(prfUpdateValue, {
      onSuccess: (data) => {
        clearNotes(prfId);
        toast.success("Notes Updated", {
          duration: 3000,
          position: "top-right",
        });
        router.push(`/edit-prf/${prfId}`);
      },
      onError: (error) => {
        toast.error("An error occurred", {
          duration: 3000,
          position: "top-right",
        });
      },
    });
  }

  const onError = (errors: any) => {
    const errorMessages = Object.entries(errors)
      .map(([_, error]: [string, any]) => error?.message)
      .filter(Boolean);

    const errorMessage =
      errorMessages[0] || "Please fill in all required fields";

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
            Notes
          </h3>
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={!hasChanges || form.formState.isSubmitting || updatePrfQuery.isPending}
          className="w-full self-end sm:w-auto"
          onClick={() => {
            const formErrors = form.formState.errors;
            if (Object.keys(formErrors).length > 0) {
              const firstError = Object.entries(formErrors)[0];
              const errorPath = firstError[0];
              const errorMessage = firstError[1].message;

              toast.error(`Validation Error: ${errorPath} - ${errorMessage}`, {
                duration: 3000,
                position: "top-right",
              });
            }
          }}
        >
          {form.formState.isSubmitting || updatePrfQuery.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
            </>
          ) : (
            "Save Notes"
          )}
        </Button>
      </form>
    </Form>
  );
}
