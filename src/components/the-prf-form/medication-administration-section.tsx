"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, FieldPath } from "react-hook-form";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useUpdatePrf } from "@/hooks/prf/useUpdatePrf";
import { PRF_FORM } from "@/interfaces/prf-form";
import { toast } from "sonner";
import {
  MedicationAdministeredSchema,
  MedicationAdministeredType,
} from "@/interfaces/prf-schema";
import { useZuStandCrewStore } from "@/lib/zuStand/crew";
import { Separator } from "../ui/separator";

interface CustomMedicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { medicine: string; dose: string; route: string }) => void;
  initialValues?: {
    medicine: string;
    dose: string;
    route: string;
  };
}

function CustomMedicationDialog({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
}: CustomMedicationDialogProps) {
  const [doseValue, doseUnit] = React.useMemo(() => {
    if (!initialValues?.dose) return ["", "mg"];
    const match = initialValues.dose.match(/^([\d.]+)(\w+)$/);
    return match ? [match[1], match[2]] : ["", "mg"];
  }, [initialValues?.dose]);

  const customMedForm = useForm({
    defaultValues: {
      medicine: initialValues?.medicine || "",
      doseValue: doseValue,
      doseUnit: doseUnit,
      route: initialValues?.route || "",
    },
    resolver: zodResolver(
      z.object({
        medicine: z.string().min(1, "Medicine name is required"),
        doseValue: z.string().min(1, "Dose value is required"),
        doseUnit: z.string().min(1, "Dose unit is required"),
        route: z.string().min(1, "Route is required"),
      }),
    ),
  });

  // Reset form when initialValues change
  React.useEffect(() => {
    if (initialValues) {
      customMedForm.reset({
        medicine: initialValues.medicine,
        doseValue: doseValue,
        doseUnit: doseUnit,
        route: initialValues.route,
      });
    }
  }, [initialValues, doseValue, doseUnit]);

  // Mock route options
  const routeOptions = [
    { value: "IV", label: "Intravenous (IV)" },
    { value: "IM", label: "Intramuscular (IM)" },
    { value: "SC", label: "Subcutaneous (SC)" },
    { value: "PO", label: "Oral (PO)" },
    { value: "SL", label: "Sublingual (SL)" },
    { value: "PR", label: "Per Rectum (PR)" },
    { value: "IN", label: "Intranasal (IN)" },
    { value: "NEB", label: "Nebulization" },
  ];

  // Mock dose unit options
  const doseUnitOptions = [
    { value: "mg", label: "mg" },
    { value: "ml", label: "ml" },
    { value: "mcg", label: "mcg" },
    { value: "g", label: "g" },
    { value: "IU", label: "IU" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Medication</DialogTitle>
          <DialogDescription>
            Enter the details for a medication not in the vehicle inventory.
          </DialogDescription>
        </DialogHeader>
        <Form {...customMedForm}>
          <form
            onSubmit={customMedForm.handleSubmit((data) => {
              onSubmit({
                medicine: data.medicine,
                dose: `${data.doseValue}${data.doseUnit}`,
                route: data.route,
              });
              customMedForm.reset();
              onOpenChange(false);
            })}
            className="space-y-4"
          >
            <FormField
              control={customMedForm.control}
              name="medicine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medication Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter medication name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <FormField
                control={customMedForm.control}
                name="doseValue"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Dose</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter dose value"
                        min="0"
                        step="any"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={customMedForm.control}
                name="doseUnit"
                render={({ field }) => (
                  <FormItem className="w-[100px]">
                    <FormLabel>Unit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {doseUnitOptions.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={customMedForm.control}
              name="route"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select administration route" />
                    </SelectTrigger>
                    <SelectContent>
                      {routeOptions.map((route) => (
                        <SelectItem key={route.value} value={route.value}>
                          {route.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Medication</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function MedicationAdministeredForm() {
  const [customMedDialogOpen, setCustomMedDialogOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [editingMedication, setEditingMedication] = React.useState<
    | {
        medicine: string;
        dose: string;
        route: string;
      }
    | undefined
  >(undefined);
  const prfId = usePathname().split("/")[2];
  const prf_from_store = useStore((state) => state.prfForms).find(
    (prf) => prf.prfFormId == prfId,
  );
  const user = useStore((state) => state.user);
  const { zsVehicle, zsUpdateMedicationStock } = useZuStandCrewStore();

  const updatePrfQuery = useUpdatePrf();
  const router = useRouter();
  const form = useForm<MedicationAdministeredType>({
    resolver: zodResolver(MedicationAdministeredSchema),
    defaultValues: prf_from_store?.prfData?.medication_administration?.data || {
      medications: [
        {
          medicine: "",
          medicationId: undefined,
          dose: "",
          route: "",
          time: "",
          hpcsa: user?.hpcsaNumber || "",
          name: user?.name || "",
          signature: user?.signature || "",
        },
      ],
      consultation: {
        consulted: false,
        practitioner: "",
        hpcsa: "",
        summaryOfConsult: "",
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medications",
  });

  const handleCustomMedication = (data: {
    medicine: string;
    dose: string;
    route: string;
  }) => {
    if (activeIndex !== null) {
      form.setValue(`medications.${activeIndex}.medicine`, data.medicine);
      form.setValue(`medications.${activeIndex}.medicationId`, undefined);
      form.setValue(`medications.${activeIndex}.dose`, data.dose);
      form.setValue(`medications.${activeIndex}.route`, data.route);
      setEditingMedication(undefined);
    }
  };

  function onSubmit(values: MedicationAdministeredType) {
    // Update medication inventory
    values.medications.forEach((medication) => {
      if (medication.medicationId) {
        // Only update stock if it's a medication from inventory
        zsUpdateMedicationStock(medication.medicationId, 1); // Assuming 1 unit per administration
      }
    });

    const prfUpdateValue: PRF_FORM = {
      prfFormId: prfId,
      prfData: {
        ...prf_from_store?.prfData,
        medication_administration: {
          data: values,
          isCompleted: true,
          isOptional: false,
        },
      },
      EmployeeID: prf_from_store?.EmployeeID || "P123456",
    };

    updatePrfQuery.mutate(prfUpdateValue, {
      onSuccess: (data) => {
        toast.success("Medication Administered Information Updated", {
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
      defaultValue="medication-administered"
      collapsible
      className="w-full"
    >
      <CustomMedicationDialog
        open={customMedDialogOpen}
        onOpenChange={(open) => {
          setCustomMedDialogOpen(open);
          if (!open) {
            setEditingMedication(undefined);
            setActiveIndex(null);
          }
        }}
        onSubmit={handleCustomMedication}
        initialValues={editingMedication}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-8"
        >
          <div className="flex items-center justify-between">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Medication Administered
            </h3>
          </div>
          <AccordionItem value="medication-administered">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  Object.keys(form.formState.errors).length > 0,
              })}
            >
              <h4
                className={cn(
                  "col-span-full scroll-m-20 text-lg font-semibold tracking-tight",
                  {
                    "text-destructive":
                      Object.keys(form.formState.errors).length > 0,
                  },
                )}
              >
                Medication Details
              </h4>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={cn({
                    "flex w-full flex-col rounded-md border px-4 transition-all delay-100 hover:border-primary":
                      true,
                    "border-destructive":
                      form.formState.errors?.medications?.[index],
                  })}
                >
                  <div className="flex flex-row items-center justify-start space-x-1 rounded-md">
                    <h5
                      className={cn({
                        "font-bold": true,
                        "text-destructive":
                          form.formState.errors?.medications?.[index],
                      })}
                    >
                      Medication Entry {index + 1}
                    </h5>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 pb-4 sm:grid-cols-3 lg:grid-cols-7">
                    {/* Medication Selection */}
                    <FormField
                      control={form.control}
                      name={`medications.${index}.medicine`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medicine</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              const selectedMed =
                                zsVehicle?.inventory.medications.find(
                                  (m) => m.id === value,
                                );
                              if (selectedMed) {
                                form.setValue(
                                  `medications.${index}.medicine`,
                                  selectedMed.name,
                                );
                                form.setValue(
                                  `medications.${index}.medicationId`,
                                  selectedMed.id,
                                );
                                form.setValue(
                                  `medications.${index}.dose`,
                                  selectedMed.dose,
                                );
                                form.setValue(
                                  `medications.${index}.route`,
                                  selectedMed.route,
                                );
                              } else if (value === "custom") {
                                setActiveIndex(index);
                                // If editing existing custom medication, pass its values
                                if (field.value && !selectedMed) {
                                  setEditingMedication({
                                    medicine: field.value,
                                    dose: form.getValues(
                                      `medications.${index}.dose`,
                                    ),
                                    route: form.getValues(
                                      `medications.${index}.route`,
                                    ),
                                  });
                                }
                                setCustomMedDialogOpen(true);
                              }
                            }}
                            value={
                              field.value
                                ? zsVehicle?.inventory.medications.find(
                                    (m) => m.name === field.value,
                                  )?.id || "custom"
                                : ""
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select medication">
                                {field.value || "Select medication"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {zsVehicle?.inventory.medications.map((med) => (
                                <SelectItem key={med.id} value={med.id}>
                                  {med.name} ({med.currentStock} in stock)
                                </SelectItem>
                              ))}
                              <Separator className="my-2" />
                              <SelectItem value="custom">
                                {field.value &&
                                !zsVehicle?.inventory.medications.find(
                                  (m) => m.name === field.value,
                                ) ? (
                                  field.value
                                ) : (
                                  <span className="flex items-center gap-2">
                                    Custom Medication
                                    <Plus className="h-4 w-4" />
                                  </span>
                                )}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Dose */}
                    <FormField
                      control={form.control}
                      name={`medications.${index}.dose`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dose</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Route */}
                    <FormField
                      control={form.control}
                      name={`medications.${index}.route`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Route</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Time */}
                    <FormField
                      control={form.control}
                      name={`medications.${index}.time`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* HPCSA */}
                    <FormField
                      control={form.control}
                      name={`medications.${index}.hpcsa`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HPCSA</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Name */}
                    <FormField
                      control={form.control}
                      name={`medications.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Signature */}
                    <FormField
                      control={form.control}
                      name={`medications.${index}.signature`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Signature</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  append({
                    medicine: "",
                    medicationId: undefined,
                    dose: "",
                    route: "",
                    time: "",
                    hpcsa: user?.hpcsaNumber || "",
                    name: user?.name || "",
                    signature: user?.signature || "",
                  })
                }
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Medication
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="consultation">
            <AccordionTrigger>Consultation</AccordionTrigger>
            <AccordionContent className="space-y-4 p-3">
              <FormField
                control={form.control}
                name="consultation.consulted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Consulted</FormLabel>
                  </FormItem>
                )}
              />
              {form.watch("consultation.consulted") && (
                <>
                  <FormField
                    control={form.control}
                    name="consultation.practitioner"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Practitioner</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="consultation.hpcsa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>HPCSA</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="consultation.summaryOfConsult"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Summary of Consult</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
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
}
