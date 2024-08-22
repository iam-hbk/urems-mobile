"use client";

import React from "react";
import { z } from "zod";

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
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { X } from "lucide-react";
import { toast } from "sonner";
import { PRF_FORM } from "@/interfaces/prf-form";
import { useUpdatePrf } from "@/hooks/prf/useUpdatePrf";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { cn } from "@/lib/utils";
import { PatientDetailsSchema } from "@/interfaces/prf-schema";

export type PatientDetailsType = z.infer<typeof PatientDetailsSchema>;

type PatientDetailsFormProps = {
  initialData?: PRF_FORM;
};

const PatientDetailsForm = ({}: PatientDetailsFormProps) => {
  const prfId = usePathname().split("/")[2];
  const prf_from_store = useStore((state) => state.prfForms).find(
    (prf) => prf.prfFormId == prfId,
  );

  const updatePrfQuery = useUpdatePrf();
  const router = useRouter();
  const form = useForm<z.infer<typeof PatientDetailsSchema>>({
    resolver: zodResolver(PatientDetailsSchema),
    defaultValues: {
      age:
        Number(prf_from_store?.prfData.patient_details?.data.age) || undefined,
      gender: prf_from_store?.prfData.patient_details?.data.gender || undefined,
      patientName:
        prf_from_store?.prfData.patient_details?.data.patientName || "",
      id: prf_from_store?.prfData.patient_details?.data.id || "",
      patientSurname:
        prf_from_store?.prfData.patient_details?.data.patientSurname || "",
      passport: prf_from_store?.prfData.patient_details?.data.passport || "",
      nextOfKin: {
        name:
          prf_from_store?.prfData.patient_details?.data.nextOfKin.name || "",
        relationToPatient:
          prf_from_store?.prfData.patient_details?.data.nextOfKin
            .relationToPatient || "",
        email:
          prf_from_store?.prfData.patient_details?.data.nextOfKin.email || "",
        physicalAddress:
          prf_from_store?.prfData.patient_details?.data.nextOfKin
            .physicalAddress || "",
        phoneNo:
          prf_from_store?.prfData.patient_details?.data.nextOfKin.phoneNo || "",
        alternatePhoneNo:
          prf_from_store?.prfData.patient_details?.data.nextOfKin
            .alternatePhoneNo || "",
        otherNOKPhoneNo:
          prf_from_store?.prfData.patient_details?.data.nextOfKin
            .otherNOKPhoneNo || "",
      },
      medicalAid: {
        name:
          prf_from_store?.prfData.patient_details?.data.medicalAid.name || "",
        number:
          prf_from_store?.prfData.patient_details?.data.medicalAid.number || "",
        principalMember:
          prf_from_store?.prfData.patient_details?.data.medicalAid
            .principalMember || "",
        authNo:
          prf_from_store?.prfData.patient_details?.data.medicalAid.authNo || "",
      },
      employer: {
        name: prf_from_store?.prfData.patient_details?.data.employer.name || "",
        workPhoneNo:
          prf_from_store?.prfData.patient_details?.data.employer.workPhoneNo ||
          "",
        workAddress:
          prf_from_store?.prfData.patient_details?.data.employer.workAddress ||
          "",
      },
    },
  });

  function onSubmit(values: z.infer<typeof PatientDetailsSchema>) {
    const prfUpdateValue: PRF_FORM = {
      prfFormId: prfId,
      prfData: {
        patient_details: {
          data: values,
          isCompleted: true,
          isOptional: false,
        },
        ...prf_from_store?.prfData,
      },
    };
    console.log("$$$$$:", prf_from_store?.prfData);
    console.log("#####:", prfUpdateValue);

    updatePrfQuery.mutate(prfUpdateValue, {
      onSuccess: (data) => {
        toast.success("Form Summary Updated", {
          duration: 3000,
          position: "top-right",
        });

        console.log("Updated PRF ------>>>>>>>", data);
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

  return (
    <Accordion
      type="single"
      defaultValue={"patient-details"}
      collapsible
      className="w-full"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-8"
        >
          {/* Patient Details */}
          <AccordionItem value="patient-details">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  form.formState.errors.age ||
                  form.formState.errors.gender ||
                  form.formState.errors.patientName ||
                  form.formState.errors.patientSurname ||
                  form.formState.errors.id ||
                  form.formState.errors.passport,
              })}
            >
              <h4
                className={cn({
                  "col-span-full scroll-m-20 text-lg font-semibold tracking-tight":
                    true,
                  "text-destructive":
                    form.formState.errors.age ||
                    form.formState.errors.gender ||
                    form.formState.errors.patientName ||
                    form.formState.errors.patientSurname ||
                    form.formState.errors.id ||
                    form.formState.errors.passport,
                })}
              >
                Patient Information
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Patient Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patientSurname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Surname</FormLabel>
                    <FormControl>
                      <Input placeholder="Patient Surname" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <div className="relative flex flex-row">
                        <Input
                          type="number"
                          placeholder="Age"
                          {...field}
                          onChange={(e) => {
                            if (!!Number(e.target.value))
                              field.onChange(Number(e.target.value));
                          }}
                        />
                        {(form.formState.touchedFields.age ||
                          form.formState.errors.age) && (
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              console.log(e);
                              field.onChange("");
                            }}
                            variant={"ghost"}
                            size={"icon"}
                            className="absolute right-0 z-10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex h-10 flex-row space-x-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal">Female</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>ID</FormLabel>
                    <FormControl>
                      <Input placeholder="ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport</FormLabel>
                    <FormControl>
                      <Input placeholder="Passport" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Next of Kin */}
          <AccordionItem value="next-of-kin">
            <AccordionTrigger
              className={cn({
                "text-destructive": form.formState.errors.nextOfKin,
              })}
            >
              <h4
                className={cn({
                  "col-span-full scroll-m-20 text-lg font-semibold tracking-tight":
                    true,
                  "text-destructive": form.formState.errors.nextOfKin,
                })}
              >
                Next of Kin Information
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="nextOfKin.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next of Kin Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Next of Kin Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nextOfKin.relationToPatient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relation to Patient</FormLabel>
                    <FormControl>
                      <Input placeholder="Relation to Patient" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nextOfKin.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nextOfKin.physicalAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Physical Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Physical Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nextOfKin.phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone No</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone No" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nextOfKin.alternatePhoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternate Phone No</FormLabel>
                    <FormControl>
                      <Input placeholder="Alternate Phone No" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nextOfKin.otherNOKPhoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other NOK Phone No</FormLabel>
                    <FormControl>
                      <Input placeholder="Other NOK Phone No" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Medical Aid */}
          <AccordionItem value="medical-aid">
            <AccordionTrigger
              className={cn({
                "text-destructive": form.formState.errors.medicalAid,
              })}
            >
              <h4
                className={cn({
                  "col-span-full scroll-m-20 text-lg font-semibold tracking-tight":
                    true,
                  "text-destructive": form.formState.errors.medicalAid,
                })}
              >
                Medical Aid Information
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="medicalAid.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Aid Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Medical Aid Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medicalAid.number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Aid Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Medical Aid Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medicalAid.principalMember"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Principal Member</FormLabel>
                    <FormControl>
                      <Input placeholder="Principal Member" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medicalAid.authNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auth No</FormLabel>
                    <FormControl>
                      <Input placeholder="Auth No" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Employer */}
          <AccordionItem value="employer">
            <AccordionTrigger
              className={cn({
                "text-destructive": form.formState.errors.employer,
              })}
            >
              <h4
                className={cn({
                  "col-span-full scroll-m-20 text-lg font-semibold tracking-tight":
                    true,
                  "text-destructive": form.formState.errors.employer,
                })}
              >
                Employer Information
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="employer.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Employer Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employer.workPhoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Phone No</FormLabel>
                    <FormControl>
                      <Input placeholder="Work Phone No" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employer.workAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Work Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
          {/* Submit form */}
          <Button
            disabled={form.formState.isDirty === false}
            type="submit"
            className="self-end"
          >
            Save
          </Button>
        </form>
      </Form>
    </Accordion>
  );
};

export default PatientDetailsForm;
