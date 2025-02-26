"use client";

import React, { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Loader2, UserRoundPlus, X } from "lucide-react";
import { TransportationSchema } from "@/interfaces/prf-schema";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useUpdatePrf } from "@/hooks/prf/useUpdatePrf";
import { PRF_FORM } from "@/interfaces/prf-form";
import { toast } from "sonner";
import AddressAutoComplete from "../AddressAutoComplete";
import { useZuStandEmployeeStore } from "@/lib/zuStand/employee";

export type TransportationType = z.infer<typeof TransportationSchema>;

type TransportationFormProps = {
  initialData?: TransportationType;
};

const TransportationForm: React.FC<TransportationFormProps> = ({
  initialData,
}) => {
  const prfId = usePathname().split("/")[2];
  const prf_from_store = useStore((state) => state.prfForms).find(
    (prf) => prf.prfFormId == prfId,
  );
  const { zsEmployee } = useZuStandEmployeeStore();

  const updatePrfQuery = useUpdatePrf();
  const router = useRouter();
  const form = useForm<TransportationType>({
    resolver: zodResolver(TransportationSchema),
    values: prf_from_store?.prfData?.transportation?.data,
    defaultValues: prf_from_store?.prfData?.transportation?.data || {
      fromSuburbTown: "",
      by: "",
      to: "",
      crewDetails: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "crewDetails",
  });

  function onSubmit(values: TransportationType) {

    if (!zsEmployee) {
      toast.error("No Employee Information Found", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    const prfUpdateValue: PRF_FORM = {
      prfFormId: prfId,
      prfData: {
        ...prf_from_store?.prfData,
        transportation: {
          data: values,
          isCompleted: true,
          isOptional: false,
        },
      },
      EmployeeID: zsEmployee?.employeeNumber.toString(),
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

  // useEffect(() => {
  // add current user to the list of crew by default. 
  // run this only once, because there is only one logged in user
  // console.log("employee here...", zsEmployee)
  if (zsEmployee && zsEmployee.employeeNumber && fields.length === 0) {
    // since i don't know what is the HPCSANo, by default, i'll just add 1 of the fields
    const initialSurname: string = `${zsEmployee.person.initials} ${zsEmployee.person.lastName}`
    const hpcsano: string = `${zsEmployee.person.initials}-${zsEmployee.employeeNumber}`
    // don't add twice 
    if (!fields.some((fields) => fields.HPCSANo === hpcsano)) {
      append({ initialAndSurname: initialSurname, HPCSANo: hpcsano })
    }

    // const { data, error } = useGetCrewEmployeeID(zsEmployee?.employeeNumber.toString());
    // console.log("crew information...", data)
  }
  // }, [])


  return (
    <Accordion
      type="single"
      defaultValue="transportation"
      collapsible
      className="w-full"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-8"
        >
          <div className="flex items-center justify-between">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Transportation
            </h3>
          </div>
          <div>
            <h4
              className={cn(
                "col-span-full scroll-m-20 text-lg font-semibold tracking-tight",
                {
                  "text-destructive":
                    Object.keys(form.formState.errors).length > 0,
                },
              )}
            >
              Transportation Details
            </h4>
            <div className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              <AddressAutoComplete
                name="fromSuburbTown"
                label="From Suburb/Town"
                placeholder="From Suburb/Town"
              />
              <FormField
                control={form.control}
                name="by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>By (Transport Mode)</FormLabel>
                    <FormControl>
                      <Input placeholder="By (Transport Mode)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AddressAutoComplete
                name="to"
                label="To (Destination)"
                placeholder="To (Destination)"
                useCurrentLocation={false}
                showGetCurrentLocationButton={false}
              />
            </div>
          </div>
          <AccordionItem value="crew-details">
            <AccordionTrigger
              className={cn({
                "text-destructive": form.formState.errors.crewDetails,
              })}
            >
              <h4
                className={cn(
                  "col-span-full scroll-m-20 text-lg font-semibold tracking-tight",
                  {
                    "text-destructive": form.formState.errors.crewDetails,
                  },
                )}
              >
                Crew Details
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="col-span-full grid grid-cols-10 items-center gap-4 border-b pb-4"
                >
                  <FormField
                    control={form.control}
                    name={`crewDetails.${index}.initialAndSurname`}
                    render={({ field }) => (
                      <FormItem className="col-span-5">
                        <FormLabel>Initial and Surname</FormLabel>
                        <FormControl>
                          <Input placeholder="Initial and Surname" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`crewDetails.${index}.HPCSANo`}
                    render={({ field }) => (
                      <FormItem className="col-span-5">
                        <FormLabel>HPCSA No</FormLabel>
                        <FormControl>
                          <div className="grid w-full grid-cols-7 grid-rows-1 space-x-3">
                            <Input
                              className="col-span-5"
                              placeholder="HPCSA No"
                              {...field}
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => remove(index)}
                              className="col-span-2 border border-destructive bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              <Button
                variant="secondary"
                // align itself to the far right
                className="col-span-full justify-self-end border border-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => append({ initialAndSurname: "", HPCSANo: "" })}
              >
                <UserRoundPlus className="mr-2 h-4 w-4" /> Add Crew Member
              </Button>
            </AccordionContent>
          </AccordionItem>

          <Button
            type="submit"
            disabled={!form.formState.isDirty}
            className="self-end"
          >
            {form.formState.isSubmitting || updatePrfQuery.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
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

export default TransportationForm;
