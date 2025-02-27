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
import { Input } from "../ui/input";
import React from "react";
import { z } from "zod";
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
import { FileEdit, Loader2, MoveRight, Plus } from "lucide-react";
import { PRF_FORM } from "@/interfaces/prf-form";
import { useCreatePrf } from "@/hooks/prf/useCreatePrf";
import { useRouter } from "next/navigation";
import { useUpdatePrf } from "@/hooks/prf/useUpdatePrf";
import { CaseDetailsSchema } from "@/interfaces/prf-schema";
import { useZuStandEmployeeStore } from "@/lib/zuStand/employee";
import { useZuStandCrewStore } from "@/lib/zuStand/crew";
import { DatePicker, Group } from "react-aria-components";
import { DateInput } from "../ui/datefield-rac";
import { CalendarDate } from "@internationalized/date";

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
  const { zsEmployee } = useZuStandEmployeeStore();
  const { zsCrewID, zsVehicle } = useZuStandCrewStore();
  const dialogCloseRef = React.useRef<HTMLButtonElement>(null);
  const form = useForm<z.infer<typeof CaseDetailsSchema>>({
    resolver: zodResolver(CaseDetailsSchema),
    defaultValues: {
      regionDistrict:
        initialData?.prfData.case_details?.data.regionDistrict || "",
      base: initialData?.prfData.case_details?.data.base || "",
      province: initialData?.prfData.case_details?.data.province || "",
      vehicle:
        initialData?.prfData.case_details?.data.vehicle ||
        (zsVehicle
          ? {
              id: zsVehicle.vehicleId,
              name: zsVehicle.vehicleName,
              license: zsVehicle.vehicleLicense,
              registrationNumber: zsVehicle.vehicleRegistrationNumber,
            }
          : {
              id: 0,
              name: "",
              license: "",
              registrationNumber: "",
            }),
      dateOfCase:
        action === "create"
          ? new Date()
          : initialData?.prfData.case_details?.data.dateOfCase
            ? new Date(initialData?.prfData.case_details?.data.dateOfCase)
            : new Date(),
    },
  });

  const onSubmit = async (values: z.infer<typeof CaseDetailsSchema>) => {
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

    if (action === "create") {
      createPrfQuery.mutate(prf, {
        onSuccess: (data, v, context) => {
          toast.success("Form Summary Updated", {
            duration: 3000,
            position: "top-right",
          });

          router.push(`/edit-prf/${data?.prfFormId}`);
          dialogCloseRef.current?.click();
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
          dialogCloseRef.current?.click();
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
    if (!zsEmployee) {
      toast.error("No Employee Information Found", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }
    const prf: PRF_FORM = {
      prfData: {},
      EmployeeID: zsEmployee?.employeeNumber.toString(),
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
                name="dateOfCase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Date of Case
                      <span className="text-xs text-muted-foreground">
                        (mm/dd/yyyy)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        value={
                          field.value
                            ? new CalendarDate(
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
                            <DateInput className="pe-9" />
                          </Group>
                        </div>
                      </DatePicker>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="vehicle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Information</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <FormLabel className="text-sm">
                              Vehicle Name
                            </FormLabel>
                            <Input
                              placeholder="Vehicle Name"
                              value={field.value.name}
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <FormLabel className="text-sm">License</FormLabel>
                            <Input
                              placeholder="License"
                              value={field.value.license}
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  license: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <FormLabel className="text-sm">
                              Registration Number
                            </FormLabel>
                            <Input
                              placeholder="Registration Number"
                              value={field.value.registrationNumber}
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  registrationNumber: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                      {zsVehicle && field.value.id !== zsVehicle.vehicleId && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Note: This vehicle differs from your assigned vehicle
                          ({zsVehicle.vehicleName})
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button disabled={form.formState.isDirty === false} type="submit">
                {createPrfQuery.isPending || updatePrfQuery.isPending ? (
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
        <DialogClose ref={dialogCloseRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};

export default PRFEditSummary;
