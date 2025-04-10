"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useZuStandEmployeeStore } from "@/lib/zuStand/employee";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Schema matching the expected API response format
const loginFormSchema = z.object({
  employeeNumber: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string(),
  initials: z.string(),
  gender: z.string(),
  email: z.string().email(),
  cellNumber: z.string(),
});

export default function LoginPage() {
  const { zsSetEmployee } = useZuStandEmployeeStore();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      employeeNumber: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      initials: "",
      gender: "",
      email: "",
      cellNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    // Transform the form data to match the expected EmployeeData format
    const employeeData = {
      employeeNumber: parseInt(values.employeeNumber),
      employeeType: {
        employeeTypeId: 1,
        typeDescription: "Emergency Medical Technician",
      },
      person: {
        personId: parseInt(values.employeeNumber),
        firstName: values.firstName,
        secondName: "",
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth,
        initials: values.initials,
        gender: values.gender,
        personContactDetails: [
          {
            isPrimary: true,
            contactDetails: {
              cellNumber: values.cellNumber,
              email: values.email,
              telephoneNumber: "",
              contactDetailsType: 1,
              contactDetailsTypeNavigation: {
                typeDescription: "Primary",
              },
            },
          },
        ],
        personIdentifications: [],
      },
      assignedVehicle: null,
    };

    try {
      // Set the session cookie
      // Since we can't directly set cookies in client components,
      // we'll make a request to an API route that will set the cookie
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        throw new Error('Failed to set session');
      }

      // Store employee data in Zustand
      zsSetEmployee(employeeData);
      toast.success("Login successful!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to login. Please try again.");
    }
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="text-2xl">Login to UREMS</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="employeeNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your employee number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="initials"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initials</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your initials" {...field} />
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
                        <Input placeholder="Enter your gender" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cellNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cell Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your cell number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 