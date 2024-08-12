"use client";

import React from "react";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { X } from "lucide-react";
import { toast } from "sonner";

type Props = {
  collectData: (data: any) => void;
};

const patientDetailsSchema = z.object({
  patientName: z.string().min(2).max(50),
  patientSurname: z.string().min(2).max(50),
  age: z.number().int().positive().min(1).max(200),
  gender: z.enum(["male", "female"], {
    required_error: "You need to select a gender.",
  }),
  id: z.string().min(1).max(50),
  passport: z.string().optional(),
  nextOfKin: z.object({
    name: z.string().min(2).max(50),
    relationToPatient: z.string().min(2).max(50),
    email: z.string().email(),
    physicalAddress: z.string().min(2).max(100),
    phoneNo: z.string().min(2).max(15),
    alternatePhoneNo: z.string().optional(),
    otherNOKPhoneNo: z.string().optional(),
  }),
  medicalAid: z.object({
    name: z.string().min(2).max(50),
    number: z.string().min(1).max(50),
    principalMember: z.string().min(2).max(50),
    authNo: z.string().optional(),
  }),
  employer: z.object({
    name: z.string().min(2).max(50),
    workPhoneNo: z.string().min(2).max(15),
    workAddress: z.string().min(2).max(100),
  }),
});

const PatientDetailsForm = (props: Props) => {
  const form = useForm<z.infer<typeof patientDetailsSchema>>({
    resolver: zodResolver(patientDetailsSchema),
    defaultValues: {
      patientName: "",
      id: "",
      patientSurname: "",
      passport: "",
      nextOfKin: {
        name: "",
        relationToPatient: "",
        email: "",
        physicalAddress: "",
        phoneNo: "",
        alternatePhoneNo: "",
        otherNOKPhoneNo: "",
      },
      medicalAid: {
        name: "",
        number: "",
        principalMember: "",
        authNo: "",
      },
      employer: {
        name: "",
        workPhoneNo: "",
        workAddress: "",
      },
    },
  });

  function onSubmit(values: z.infer<typeof patientDetailsSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    props.collectData(values);
    toast("Patient Details Saved", {
      position: "top-right",
      description: `Patient details for ${values.patientName} ${values.patientSurname} have been saved.`,
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col"
      >
        {/* Patient Details */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <h4 className="scroll-m-20 font-semibold col-span-full text-lg tracking-tight">
            Patient Information
          </h4>
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
                  <div className="flex flex-row relative ">
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
                        className="z-10 absolute right-0"
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
                    className="flex flex-row  h-10 space-x-1"
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
        </div>

        {/* Next of Kin */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <h4 className="scroll-m-20 col-span-full font-semibold text-lg tracking-tight">
            Next of Kin Information
          </h4>
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
        </div>

        {/* Medical Aid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <h4 className="scroll-m-20 col-span-full font-semibold text-lg tracking-tight">
            Medical Aid Information
          </h4>
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
        </div>

        {/* Employer */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <h4 className="scroll-m-20 col-span-full font-semibold text-lg tracking-tight">
            Employer Information
          </h4>
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
        </div>
        {/* Submit form */}
        <Button type="submit" className="self-end">
          Save
        </Button>
      </form>
    </Form>
  );
};

export default PatientDetailsForm;
