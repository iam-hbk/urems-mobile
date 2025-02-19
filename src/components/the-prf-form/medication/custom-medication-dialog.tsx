"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

export function CustomMedicationDialog({
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