"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitErrorHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { NotesType, NotesSchema } from "@/interfaces/prf-schema";
import { Textarea } from "../ui/textarea";
import {
  ensurePRFResponseSectionByName,
  useUpdatePrfResponse,
} from "@/hooks/prf/usePrfForms";
import { useQueryClient } from "@tanstack/react-query";

export default function NotesForm() {
  const prfId = usePathname().split("/")[2];
  const qc = useQueryClient();
  const updatePrfQuery = useUpdatePrfResponse(prfId, "notes");
  const router = useRouter();

  const form = useForm<NotesType>({
    resolver: zodResolver(NotesSchema),
    defaultValues: async () => {
      const notes = await ensurePRFResponseSectionByName(qc, prfId, "notes");
      return { notes: notes?.data?.notes || "" };
    },
  });

  function onSubmit(values: NotesType) {
    const prfUpdateValue = {
      data: { notes: values.notes },
      isCompleted: true,
      isOptional: true,
    };

    updatePrfQuery.mutate(prfUpdateValue, {
      onSuccess: () => {
        toast.success("Notes Updated", {
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
    });
  }

  const onError: SubmitErrorHandler<NotesType> = (errors) => {
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
          disabled={
            !form.formState.isDirty ||
            form.formState.isSubmitting ||
            updatePrfQuery.isPending
          }
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
              <Loader className="mr-2 h-4 w-4 animate-spin" /> Saving
            </>
          ) : (
            "Save Notes"
          )}
        </Button>
      </form>
    </Form>
  );
}
