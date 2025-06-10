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
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
// import { authClient } from "@/lib/auth/client";
import { Suspense } from "react";

const loginFormSchema = z.object({
  employeeNumber: z.string().min(1, "Employee number is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') || '/';


  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      employeeNumber: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    try {

      if (!data) return;

      // const session = await authClient.signIn.credentials(data);
      const session = null;
      if (session) {
        toast.success("Login successful");
        // Add a small delay to ensure the session is properly set
        setTimeout(() => {
          router.push(redirectTo);
          router.refresh(); // Force a refresh to ensure new session is picked up
        }, 100);
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid credentials");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-6 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-500">Please sign in to continue</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
} 