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
import { PRF_FORM_CASE_DETAILS } from "@/interfaces/prf-form";
import {
  useCreatePrf,
  useGetPRFResponseSectionByName,
  useUpdatePrfResponse,
} from "@/hooks/prf/usePrfForms";
import { CaseDetailsSchema } from "@/interfaces/prf-schema";
import { DatePicker, Group } from "react-aria-components";
import { DateInput } from "../ui/datefield-rac";
import { CalendarDate } from "@internationalized/date";
import { useSessionQuery } from "@/hooks/auth/useSession";
import { useGetCrewEmployeeID } from "@/hooks/crew/useCrew";

export type CaseDetailsType = z.infer<typeof CaseDetailsSchema>;

type CaseDetailsFormProps = {
  buttonTitle: string;
  action?: "create" | "edit";
  prfResponseId: string;
};

const PRFEditSummary = ({
  buttonTitle,
  action = "create",
  prfResponseId,
}: CaseDetailsFormProps) => {
  const createPrfQuery = useCreatePrf();
  const updatePrfQuery = useUpdatePrfResponse(prfResponseId, "case_details");
  const { data: caseDetails } = useGetPRFResponseSectionByName(
    prfResponseId,
    "case_details",
  );
  const { data: session } = useSessionQuery();
  const { data: crew } = useGetCrewEmployeeID();

  const dialogCloseRef = React.useRef<HTMLButtonElement>(null);
  const form = useForm<z.infer<typeof CaseDetailsSchema>>({
    resolver: zodResolver(CaseDetailsSchema),
    defaultValues: {
      regionDistrict: caseDetails?.data.regionDistrict || "",
      base: caseDetails?.data.base || "",
      province: caseDetails?.data.province || "",
      vehicle:
        caseDetails?.data.vehicle ||
        (crew
          ? {
              id: crew[0].crew.vehicleId,
              name: crew[0].crew.vehicleId,
              license: crew[0].crew.vehicleId,
              registrationNumber: crew[0].crew.vehicleId,
            }
          : {
              id: "",
              name: "",
              license: "",
              registrationNumber: "",
            }),
      dateOfCase:
        action === "create"
          ? new Date()
          : caseDetails?.data.dateOfCase
            ? new Date(caseDetails.data.dateOfCase)
            : new Date(),
    },
  });

  const onSubmit = async (values: z.infer<typeof CaseDetailsSchema>) => {
    if (!session?.user.id) {
      toast.error("No Employee Information Found", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    const caseDetails: PRF_FORM_CASE_DETAILS = {
      ...values,
    };

    if (action === "create") {
      // TODO: This needs to be updated and reviewed
      createPrfQuery.mutate({
        case_details: {
          data: caseDetails,
          isOptional: false,
          isCompleted: true,
        },
      });
      // } else {
      //   updatePrfQuery.mutate({
      //     prfFormId: initialData?.prfFormId,
      //     prfData: { case_details: prf.prfData.case_details },
      //   } as PRF_FORM);
      //TODO: Add update case details
    }
    dialogCloseRef.current?.click();
  };
  const onSkipForNow = async () => {
    if (!session?.user.id) {
      toast.error("No Employee Information Found", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    if (action === "create") {
      createPrfQuery.mutate({});
    }
    dialogCloseRef.current?.click();
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
      <DialogContent
        className="sm:max-w-2xl"
        aria-describedby="case-details-dialog"
      >
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
                        aria-label="Date of Case"
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
                      {crew && field.value.id !== crew[0].crew.vehicleId && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Note: This vehicle differs from your assigned vehicle
                          ({crew[0].crew.vehicleId})
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                disabled={
                  form.formState.isDirty === false || createPrfQuery.isReady
                }
                type="submit"
              >
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
