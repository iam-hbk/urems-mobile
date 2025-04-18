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
import { Loader2, X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useZuStandEmployeeStore } from "@/lib/zuStand/employee";
import AddressAutoComplete from "../AddressAutoComplete";

export type PatientDetailsType = z.infer<typeof PatientDetailsSchema>;

type PatientDetailsFormProps = {
  initialData?: PRF_FORM;
};

type AgeUnit = "years" | "months" | "days";

const PatientDetailsForm = ({}: PatientDetailsFormProps) => {
  const { zsEmployee } = useZuStandEmployeeStore();
  const prfId = usePathname().split("/")[2];

  const prf_from_store = useStore((state) => {
    return state.prfForms.find(
      (prf) => String(prf.prfFormId) === String(prfId),
    );
  });

  console.log("Found PRF from store:", prf_from_store); // Debug log

  const updatePrfQuery = useUpdatePrf();
  const router = useRouter();
  const form = useForm<z.infer<typeof PatientDetailsSchema>>({
    resolver: zodResolver(PatientDetailsSchema),
    values: prf_from_store?.prfData.patient_details?.data,
    // mode: "onBlur",
  });

  // Watch the unableToObtainInformation.status field
  const unableToObtainInfo = form.watch("unableToObtainInformation.status");
  // Add this state for the toggle
  const [useDateOfBirth, setUseDateOfBirth] = React.useState(false);

  // Function to calculate age from DOB
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    // Calculate months for infants
    if (age === 0) {
      const months = monthDiff + 12;
      if (months <= 0) {
        // Calculate days for newborns
        const diffTime = Math.abs(today.getTime() - birthDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        form.setValue("age", diffDays);
        form.setValue("ageUnit", "days");
      } else {
        form.setValue("age", months);
        form.setValue("ageUnit", "months");
      }
    } else {
      form.setValue("age", age);
      form.setValue("ageUnit", "years");
    }
  };

  // Function to handle the "Unable to obtain information" checkbox change
  const handleUnableToObtainInfoChange = (checked: boolean) => {
    // Batch all form value changes to avoid multiple re-renders and validations
    form.setValue("unableToObtainInformation.status", checked, {
      shouldDirty: true,
      shouldValidate: false, // Don't validate yet
    });

    // If checked, we'll keep any existing values but mark them as optional
    // If unchecked, we'll validate the required fields
    if (checked) {
      // Add estimated age and notes fields if they don't exist
      if (!form.getValues("unableToObtainInformation.estimatedAge")) {
        form.setValue("unableToObtainInformation.estimatedAge", undefined, {
          shouldValidate: false
        });
      }
      if (!form.getValues("unableToObtainInformation.notes")) {
        form.setValue("unableToObtainInformation.notes", "", {
          shouldValidate: false
        });
      }

      // Preserve existing patient information values, but they'll be optional
      // Only initialize if they don't exist
      if (!form.getValues("age")) {
        form.setValue("age", undefined, {
          shouldValidate: false
        });
      }
      if (!form.getValues("ageUnit")) {
        form.setValue("ageUnit", "years", {
          shouldValidate: false
        });
      }
      if (!form.getValues("gender")) {
        form.setValue("gender", undefined, {
          shouldValidate: false
        });
      }
      if (!form.getValues("patientName")) {
        form.setValue("patientName", "", {
          shouldValidate: false
        });
      }
      if (!form.getValues("patientSurname")) {
        form.setValue("patientSurname", "", {
          shouldValidate: false
        });
      }
      if (!form.getValues("id")) {
        form.setValue("id", "", {
          shouldValidate: false
        });
      }
      if (!form.getValues("passport")) {
        form.setValue("passport", "", {
          shouldValidate: false
        });
      }

      // Initialize optional fields with empty values if they don't exist
      if (!form.getValues("nextOfKin")) {
        form.setValue("nextOfKin", {
          name: "",
          relationToPatient: "",
          email: "",
          physicalAddress: "",
          phoneNo: "",
          alternatePhoneNo: "",
          otherNOKPhoneNo: "",
        }, {
          shouldValidate: false
        });
      }
      if (!form.getValues("medicalAid")) {
        form.setValue("medicalAid", {
          name: "",
          number: "",
          principalMember: "",
          authNo: "",
        }, {
          shouldValidate: false
        });
      }
      if (!form.getValues("employer")) {
        form.setValue("employer", {
          name: "",
          workPhoneNo: "",
          workAddress: "",
        }, {
          shouldValidate: false
        });
      }
      if (!form.getValues("pastHistory")) {
        form.setValue("pastHistory", {
          allergies: "",
          medication: "",
          medicalHx: "",
          lastMeal: "",
          cva: false,
          epilepsy: false,
          cardiac: false,
          byPass: false,
          dmOneOrTwo: false,
          HPT: false,
          asthma: false,
          copd: false,
        }, {
          shouldValidate: false
        });
      }

      // Clear any existing errors since fields are now optional
      form.clearErrors();
    }

    // Use a small delay to ensure state is updated before validation
    setTimeout(() => {
      // Finally trigger validation after all state changes are applied
      form.trigger();
    }, 0);
  };

  // Add this function to handle form errors
  const onError = (errors: any) => {
    console.log("Form validation errors:", errors);

    // Check if there are any errors
    if (Object.keys(errors).length === 0) {
      return;
    }

    // Get all error messages
    const errorMessages = Object.entries(errors)
      .map(([key, error]: [string, any]) => {
        if (error?.message) {
          return error.message;
        }
        // Handle nested errors
        if (typeof error === "object" && error !== null) {
          const nestedErrors = Object.values(error)
            .filter(Boolean)
            .map((e: any) => e?.message)
            .filter(Boolean);

          if (nestedErrors.length > 0) {
            return nestedErrors[0];
          }
        }
        return null;
      })
      .filter(Boolean);

    const errorMessage =
      errorMessages[0] || "Please fill in all required fields";

    toast.error(errorMessage, {
      duration: 3000,
      position: "top-right",
    });
  };

  function onSubmit(values: z.infer<typeof PatientDetailsSchema>) {
    // if there is valid employee info
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
        patient_details: {
          data: values,
          isCompleted: true,
          isOptional: false,
        },
        ...prf_from_store?.prfData,
      },
      EmployeeID: zsEmployee?.employeeNumber.toString(), // employeeID is required.
    };

    updatePrfQuery.mutate(prfUpdateValue, {
      onSuccess: (data) => {
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

  return (
    <Accordion
      type="single"
      defaultValue={"patient-details"}
      collapsible
      className="w-full"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="flex flex-col space-y-8"
        >
          <div className="flex items-center justify-between">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Patient Information
            </h3>
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
          </div>
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
                  form.formState.errors.passport  
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
                    <FormLabel
                      className={
                        unableToObtainInfo
                          ? "after:ml-1 after:text-muted-foreground after:content-['(optional)']"
                          : "after:ml-0.5 after:text-red-500 after:content-['*']"
                      }
                    >
                      Patient Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          unableToObtainInfo ? "Optional" : "Patient Name"
                        }
                        {...field}
                      />
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
                    <FormLabel
                      className={
                        unableToObtainInfo
                          ? "after:ml-1 after:text-muted-foreground after:content-['(optional)']"
                          : "after:ml-0.5 after:text-red-500 after:content-['*']"
                      }
                    >
                      Patient Surname
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          unableToObtainInfo ? "Optional" : "Patient Surname"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel
                      className={
                        unableToObtainInfo
                          ? "after:ml-1 after:text-muted-foreground after:content-['(optional)']"
                          : "after:ml-0.5 after:text-red-500 after:content-['*']"
                      }
                    >
                      Age
                    </FormLabel>
                    <div className="mb-2 flex items-center gap-2">
                      <Switch
                        checked={useDateOfBirth}
                        onCheckedChange={setUseDateOfBirth}
                      />
                      <FormLabel className="font-normal">
                        Use Date of Birth
                      </FormLabel>
                    </div>
                    <FormControl>
                      <div className="flex gap-2">
                        {useDateOfBirth ? (
                          <div className="flex-1">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(new Date(), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={
                                    field.value ? new Date() : undefined
                                  }
                                  onSelect={(date) => {
                                    if (date) {
                                      calculateAge(date);
                                    }
                                  }}
                                  disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        ) : (
                          <Input
                            type="number"
                            placeholder={
                              unableToObtainInfo ? "Optional" : "Age"
                            }
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || !isNaN(Number(value))) {
                                field.onChange(
                                  value === "" ? undefined : Number(value),
                                );
                              }
                            }}
                          />
                        )}
                        <Select
                          value={form.watch("ageUnit")}
                          onValueChange={(value) =>
                            form.setValue("ageUnit", value as AgeUnit)
                          }
                        >
                          <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="years">Years</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                            <SelectItem value="days">Days</SelectItem>
                          </SelectContent>
                        </Select>
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
                    <FormLabel
                      className={
                        unableToObtainInfo
                          ? "after:ml-1 after:text-muted-foreground after:content-['(optional)']"
                          : "after:ml-0.5 after:text-red-500 after:content-['*']"
                      }
                    >
                      Sex
                    </FormLabel>
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

              <FormField
                control={form.control}
                name="unableToObtainInformation.status"
                render={({ field }) => (
                  <FormItem className="col-span-full rounded-md border-2 border-dashed border-muted-foreground/20 p-4">
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) =>
                            handleUnableToObtainInfoChange(e.target.checked)
                          }
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="font-semibold">
                        Unable to obtain complete information
                      </FormLabel>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Check this box if you are unable to obtain complete
                      patient information. This will make patient name, surname,
                      age, gender, ID, and passport fields optional. You can
                      still enter any partial information you have.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("unableToObtainInformation.status") && (
                <>
                  <FormField
                    control={form.control}
                    name="unableToObtainInformation.estimatedAge"
                    render={({ field }) => (
                      <FormItem className="col-span-full sm:col-span-1">
                        <FormLabel>Estimated Age</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Estimated Age"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || !isNaN(Number(value))) {
                                field.onChange(
                                  value === "" ? undefined : Number(value),
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unableToObtainInformation.notes"
                    render={({ field }) => (
                      <FormItem className="col-span-full sm:col-span-2">
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Additional notes about inability to obtain information"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
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
              <AddressAutoComplete
                name="nextOfKin.physicalAddress"
                label="Physical Address"
                placeholder="Address of Next of Kin"
                useCurrentLocation={false}
                showGetCurrentLocationButton={false}
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
              <AddressAutoComplete
                name="employer.workAddress"
                label="Work Address"
                placeholder="Address of Employer"
                useCurrentLocation={false}
                showGetCurrentLocationButton={false}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Past Medical History */}
          <AccordionItem value="past-medical-history">
            <AccordionTrigger
              className={cn({
                "text-destructive": form.formState.errors.pastHistory,
              })}
            >
              <h4
                className={cn({
                  "col-span-full scroll-m-20 text-lg font-semibold tracking-tight":
                    true,
                  "text-destructive": form.formState.errors.pastHistory,
                })}
              >
                Past Medical History
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="pastHistory.allergies"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Allergies</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="List any known allergies"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pastHistory.medication"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Current Medications</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="List current medications"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pastHistory.medicalHx"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Medical History</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Relevant medical history"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pastHistory.lastMeal"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Last Meal</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Time and description of last meal"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-full grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="pastHistory.cva"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">CVA</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pastHistory.epilepsy"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Epilepsy</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pastHistory.cardiac"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Cardiac</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pastHistory.byPass"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Bypass</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pastHistory.dmOneOrTwo"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Diabetes</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pastHistory.HPT"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Hypertension
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pastHistory.asthma"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Asthma</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pastHistory.copd"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">COPD</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Submit form */}
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

export default PatientDetailsForm;
