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

type Props = {
  collectData: (data: any) => void;
};
const patientDetailsSchema = z.object({
  username: z.string().min(2).max(50),
});
const PatientDetailsForm = (props: Props) => {
  const form = useForm<z.infer<typeof patientDetailsSchema>>({
    resolver: zodResolver(patientDetailsSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof patientDetailsSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    props.collectData(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col"
      >
        {/* Everything will go here */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit form */}
        <Button type="submit" className="self-end">
          Save
        </Button>
      </form>
    </Form>
  );
};

export default PatientDetailsForm;
