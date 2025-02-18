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
import { PRF_FORM } from "@/interfaces/prf-form";
import { useCreatePrf } from "@/hooks/prf/useCreatePrf";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { useUpdatePrf } from "@/hooks/prf/useUpdatePrf";
import { CaseDetailsSchema } from "@/interfaces/prf-schema";
import { useZuStandEmployeeStore } from "@/lib/zuStand/employee";
import { useZuStandCrewStore } from "@/lib/zuStand/crew";

export type CaseDetailsType = z.infer<typeof CaseDetailsSchema>;

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
  const form = useForm<z.infer<typeof CaseDetailsSchema>>({
    resolver: zodResolver(CaseDetailsSchema),
    defaultValues: {
      regionDistrict:
        initialData?.prfData.case_details?.data.regionDistrict || "",
      base: initialData?.prfData.case_details?.data.base || "",
      province: initialData?.prfData.case_details?.data.province || "",
      rescueUnit: initialData?.prfData.case_details?.data.rescueUnit || "",
      rv: initialData?.prfData.case_details?.data.rv || "",
      dodNumber: initialData?.prfData.case_details?.data.dodNumber || "",
      ambulance: initialData?.prfData.case_details?.data.ambulance || "",
      dateOfCase: action === "create" ? new Date() : initialData?.prfData.case_details?.data.dateOfCase
        ? new Date(initialData?.prfData.case_details?.data.dateOfCase)
        : new Date(),
    },
  });
  // ZuStand-SM
  const { zsEmployee } = useZuStandEmployeeStore()
  const { zsCrewID } = useZuStandCrewStore();
  // 
  const onSubmit = async (values: z.infer<typeof CaseDetailsSchema>) => {
    // if there is valid employee info
    if (!zsEmployee) {
      toast.error("No Employee Information Found", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

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
      EmployeeID: zsEmployee?.employeeNumber.toString(),
      CrewID: zsCrewID?.toString(),
    };

    // console.log("form data here...", prf);

    if (action === "create") {
      createPrfQuery.mutate(prf, {
        onSuccess: (data, v, context) => {
          toast.success("Form Summary Updated", {
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
    } else {
      updatePrfQuery.mutate(prf, {
        onSuccess: (data, v, context) => {
          toast.success("Form Summary Updated", {
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
  };

  const onSkipForNow = async () => {
    // if there is valid employee info
    if (!zsEmployee) {
      toast.error("No Employee Information Found", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }
    const prf: PRF_FORM = {
      prfData: {

      },
      EmployeeID: zsEmployee?.employeeNumber.toString(),
      CrewID: zsCrewID?.toString(),
    };
    if (action === "create") {
      createPrfQuery.mutate(prf, {
        onSuccess: (data, v, context) => {
          toast.success("You have successfully created a new empty PRF", {
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Patient Report Form Case Details</DialogTitle>
          <DialogDescription>
            {action == "edit"
              ? "Edit the Patient Report Form Case Details"
              : "Create a new Patient Report Form Case Details"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-8"
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
                            {format(field.value, "PPP")}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          defaultMonth={field.value}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
              <Button disabled={form.formState.isDirty === false} type="submit">
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
