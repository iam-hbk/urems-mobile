"use client";

import {
  Dialog,
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

const prfSummarySchema = z.object({
  regionDistrict: z.string().min(2, "Region/District is required").max(50),
  base: z.string().min(2, "Base is required").max(50),
  province: z.string().min(2, "Province is required").max(50),
  rescueUnit: z.string().min(2, "Rescue Unit is required").max(50),
  rv: z.string().min(2, "RV is required").max(50),
  dateOfCase: z.string().min(2, "Date of Case is required").max(50),
  dodNumber: z.string().optional(),
  ambulance: z.string().min(2, "Ambulance is required").max(50),
});

type CaseDetailsFormProps = {
  collectData?: (data: any) => void;
};

const PRFEditSummary = ({ collectData }: CaseDetailsFormProps) => {
  const form = useForm<z.infer<typeof prfSummarySchema>>({
    resolver: zodResolver(prfSummarySchema),
    defaultValues: {
      regionDistrict: "",
      base: "",
      province: "",
      rescueUnit: "",
      rv: "",
      dateOfCase: "",
      dodNumber: "",
      ambulance: "",
    },
  });

  const onSubmit = (values: z.infer<typeof prfSummarySchema>) => {
    console.log(values);
    toast.success("Form Summary Updated",{
        duration: 3000,
        position: "top-right",
    });
    // collectData(values);
  };

  const onClear = () => {
    form.reset();
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl ">
        <DialogHeader>
          <DialogTitle>Patient Details Form Summary</DialogTitle>
          <DialogDescription>
            Edit the patient details form summary
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col"
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
                    <FormControl>
                      <Input placeholder="Date of Case" {...field} />
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
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PRFEditSummary;
