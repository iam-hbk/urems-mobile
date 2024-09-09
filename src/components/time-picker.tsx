"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  time: z.object({
    hour: z.string(),
    minute: z.string(),
  }),
});

export default function Component() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      time: { hour: "12", minute: "00" },
    },
  });

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );
  const minutes = Array.from({ length: 12 }, (_, i) =>
    (i * 5).toString().padStart(2, "0"),
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Appointment Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={`w-[240px] justify-start text-left font-normal ${
                        !field.value && "text-muted-foreground"
                      }`}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {field.value ? (
                        `${field.value.hour}:${field.value.minute}`
                      ) : (
                        <span>Pick a time</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="flex space-x-2 p-4">
                    <Controller
                      name="time.hour"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Hour" />
                          </SelectTrigger>
                          <SelectContent>
                            {hours.map((hour) => (
                              <SelectItem key={hour} value={hour}>
                                {hour}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Controller
                      name="time.minute"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Minute" />
                          </SelectTrigger>
                          <SelectContent>
                            {minutes.map((minute) => (
                              <SelectItem key={minute} value={minute}>
                                {minute}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select the time for your appointment.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
