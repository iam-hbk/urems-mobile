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
import { FileEdit, Loader, Plus } from "lucide-react";
import { PRF_FORM_CASE_DETAILS } from "@/interfaces/prf-form";
import {
  ensurePRFResponseSectionByName,
  useCreatePrf,
  useUpdatePrfResponse,
} from "@/hooks/prf/usePrfForms";
import { CaseDetailsSchema } from "@/interfaces/prf-schema";
import { DatePicker, Group } from "react-aria-components";
import { DateInput } from "../ui/datefield-rac";
import { CalendarDate } from "@internationalized/date";
import { useSessionQuery } from "@/hooks/auth/useSession";
import { useGetCrewEmployeeID } from "@/hooks/crew/useCrew";
import { useQueryClient } from "@tanstack/react-query";

export type CaseDetailsType = z.infer<typeof CaseDetailsSchema>;

type BaseProps = {
  buttonTitle: string;
};

type CreateProps = BaseProps & {
  action?: "create";
};

type EditProps = BaseProps & {
  action: "edit";
  prfResponseId: string;
};

/* -------------------------------- Create -------------------------------- */
const CreatePRFButton = ({ buttonTitle }: CreateProps) => {
  const createPrfQuery = useCreatePrf();
  const { data: session } = useSessionQuery();

  const onCreate = async () => {
    if (!session?.user.id) {
      toast.error("No Employee Information Found", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    createPrfQuery.mutate({});
  };

  const isSubmitting = createPrfQuery.isPending;

  return (
    <Button
      disabled={isSubmitting}
      onClick={onCreate}
      className="flex items-center"
    >
      <Plus className="mr-2" />
      {buttonTitle}
      {isSubmitting && <Loader className="ml-2 h-4 w-4 animate-spin" />}
    </Button>
  );
};

/* --------------------------------- Edit --------------------------------- */
const EditCaseDetailsDialog = ({ buttonTitle, prfResponseId }: EditProps) => {
  const updatePrfQuery = useUpdatePrfResponse(prfResponseId, "case_details");
  const { data: session } = useSessionQuery();
  const { data: crew } = useGetCrewEmployeeID();
  const qc = useQueryClient();

  const dialogCloseRef = React.useRef<HTMLButtonElement>(null);

  const form = useForm<z.infer<typeof CaseDetailsSchema>>({
    resolver: zodResolver(CaseDetailsSchema),
    mode: "onChange",
    defaultValues: async () => {
      const section = await ensurePRFResponseSectionByName(
        qc,
        prfResponseId,
        "case_details",
      );
      const data = section.data;
      return {
        ...data,
        vehicle: {
          id: data.vehicle?.id ?? crew?.[0]?.crew?.vehicleId ?? "",
          name: data.vehicle?.name ?? "",
          license: data.vehicle?.license ?? "",
          registrationNumber: data.vehicle?.registrationNumber ?? "",
        },
        dateOfCase: data.dateOfCase ? new Date(data.dateOfCase) : new Date(),
      };
    },
  });

  const onSubmit = async (values: z.infer<typeof CaseDetailsSchema>) => {
    // console.log("submitting");
    if (!session?.user.id) {
      toast.error("No Employee Information Found", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    const caseDetails: PRF_FORM_CASE_DETAILS = { ...values };
    // console.log(caseDetails);
    updatePrfQuery.mutate(
      { data: caseDetails, isCompleted: true },
      {
        onSuccess: () => dialogCloseRef.current?.click(),
        onError: (error) => {
          if (error) { }
        },
      },
    );
  };

  const isSubmitting = updatePrfQuery.isPending;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <FileEdit className="mr-2" />
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
            Edit the Patient Report Form Case Details
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // console.log("🌟", form.getValues());
              // console.log("🚀", form.formState.errors);
              form.handleSubmit(onSubmit)();
            }}
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
                        {" "}
                        (mm/dd/yyyy)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        aria-label="Date of Case"
                        value={
                          field.value
                            ? new CalendarDate(
                              (field.value instanceof Date
                                ? field.value
                                : new Date(field.value)
                              ).getFullYear(),
                              (field.value instanceof Date
                                ? field.value
                                : new Date(field.value)
                              ).getMonth() + 1,
                              (field.value instanceof Date
                                ? field.value
                                : new Date(field.value)
                              ).getDate(),
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

              <div className="col-span-2 grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="vehicle.id"
                  render={({ field }) => <input type="hidden" {...field} />}
                />

                <FormField
                  control={form.control}
                  name="vehicle.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Vehicle Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicle.license"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License</FormLabel>
                      <FormControl>
                        <Input placeholder="License" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicle.registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Registration Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                disabled={isSubmitting || !form.formState.isDirty}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" /> Saving
                  </>
                ) : (
                  "Update Case Details"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        <DialogClose ref={dialogCloseRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};

/* ------------------------------ Default wrapper ------------------------------ */
type WrapperProps = (CreateProps | EditProps) & { prfResponseId?: string };

const PRFCaseDetailsDialog = (props: WrapperProps) => {
  if (props.action === "edit" && props.prfResponseId) {
    return (
      <EditCaseDetailsDialog
        buttonTitle={props.buttonTitle}
        action="edit"
        prfResponseId={props.prfResponseId}
      />
    );
  }
  return <CreatePRFButton buttonTitle={props.buttonTitle} action="create" />;
};

export { CreatePRFButton, EditCaseDetailsDialog };
export default PRFCaseDetailsDialog;
