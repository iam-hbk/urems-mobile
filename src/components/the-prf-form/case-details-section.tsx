"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { format } from "date-fns";
import React from "react";
import { optional, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { CalendarIcon, FileEdit, Loader2, MoveRight, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { PRF_FORM } from "@/interfaces/prf-form";
import { useCreatePrf } from "@/hooks/prf/useCreatePrf";
import { useRouter } from "next/navigation";
import { create } from "domain";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { useUpdatePrf } from "@/hooks/prf/useUpdatePrf";

const prfSummarySchema = z.object({
  regionDistrict: z.string().min(2, "Region/District is required").max(50),
  base: z.string().min(2, "Base is required").max(50),
  province: z.string().min(2, "Province is required").max(50),
  rescueUnit: z.string().min(2, "Rescue Unit is required").max(50),
  rv: z.string().min(2, "RV is required").max(50),
  dateOfCase: z.date({
    required_error: "A date of birth is required.",
  }),
  dodNumber: z.string().optional(),
  ambulance: z.string().min(2, "Ambulance is required").max(50),
});
export type CaseDetailsType = z.infer<typeof prfSummarySchema>;

type CaseDetailsFormProps = {
  buttonTitle: string;
  action?: "create" | "edit";
  initialData?: PRF_FORM;
};

const PRFEditSummary = ({
  buttonTitle,
  action = "create",
  initialData,
}: CaseDetailsFormProps) => {
  const router = useRouter();
  const createPrfQuery = useCreatePrf();
  const updatePrfQuery = useUpdatePrf();
  const form = useForm<z.infer<typeof prfSummarySchema>>({
    resolver: zodResolver(prfSummarySchema),
    defaultValues: {
      regionDistrict:
        initialData?.prfData.case_details?.data.regionDistrict || "",
      base: initialData?.prfData.case_details?.data.base || "",
      province: initialData?.prfData.case_details?.data.province || "",
      rescueUnit: initialData?.prfData.case_details?.data.rescueUnit || "",
      rv: initialData?.prfData.case_details?.data.rv || "",
      dodNumber: initialData?.prfData.case_details?.data.dodNumber || "",
      ambulance: initialData?.prfData.case_details?.data.ambulance || "",
      dateOfCase: initialData?.prfData.case_details?.data.dateOfCase
        ? new Date(initialData?.prfData.case_details?.data.dateOfCase)
        : undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof prfSummarySchema>) => {
    const prf: PRF_FORM = {
      prfFormId: initialData?.prfFormId,
      prfData: {
        ...initialData?.prfData,
        case_details: {
          data: values,
          isCompleted: true,
          isOptional: false,
        },
      },
    };

    if (action === "create") {
      createPrfQuery.mutate(prf, {
        onSuccess: (data, v, context) => {
          toast.success("Form Summary Updated", {
            duration: 3000,
            position: "top-right",
          });
          console.log("Created PRF ------>>>>>>>", data, v, context);

          router.push(`/edit-prf/${data?.prfFormId}`);
        },
        onError: (error) => {
          toast.error("An error occurred", {
            duration: 3000,
            position: "top-right",
          });
        },
      });
    } else {
      updatePrfQuery.mutate(prf, {
        onSuccess: (data, v, context) => {
          toast.success("Form Summary Updated", {
            duration: 3000,
            position: "top-right",
          });
          console.log("Updated PRF ------>>>>>>>", data);
          console.log("Value Sent PRF ------>>>>>>>", v);

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
  };
  const onSkipForNow = async () => {
    const prf: PRF_FORM = {
      prfData: {},
    };
    if (action === "create") {
      createPrfQuery.mutate(prf, {
        onSuccess: (data, v, context) => {
          toast.success("You have successfully created a new empty PRF", {
            duration: 3000,
            position: "top-right",
          });
          console.log("Created PRF ------>>>>>>>", data, v, context);

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
  };
  const onClear = () => {
    form.reset();
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={action == "edit" ? "outline" : "default"}>
          {action == "create" ? (
            <Plus className="mr-2" />
          ) : (
            <FileEdit className="mr-2" />
          )}
          {buttonTitle}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl ">
        <DialogHeader>
          <DialogTitle>Patient Report Form Summary</DialogTitle>
          <DialogDescription>
            {action == "edit"
              ? "Edit the Patient Report Form Summary"
              : "Create a new Patient Report Form Summary"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col"
          >
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="regionDistrict"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region/District</FormLabel>
                    <FormControl>
                      <Input placeholder="Region/District" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RV</FormLabel>
                    <FormControl>
                      <Input placeholder="RV" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="base"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base</FormLabel>
                    <FormControl>
                      <Input placeholder="Base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfCase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Case</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
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
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <FormControl>
                      <Input placeholder="Province" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dodNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DOD Number</FormLabel>
                    <FormControl>
                      <Input placeholder="DOD Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rescueUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rescue Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="Rescue Unit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ambulance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ambulance</FormLabel>
                    <FormControl>
                      <Input placeholder="Ambulance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit">
                {createPrfQuery.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                  </>
                ) : action === "edit" ? (
                  "Update PRF Summary"
                ) : (
                  "Create PRF"
                )}
              </Button>
              {action == "create" && (
                <DialogClose asChild>
                  <Button variant={"outline"} onClick={onSkipForNow}>
                    <MoveRight className="mr-2 h-4 w-4" /> Skip For Now
                  </Button>
                </DialogClose>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PRFEditSummary;
