"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useSendPasswordResetCodeMutation } from "@/hooks/auth/useLogin";
import { schemaForgotPasswordForm } from "@/schema/auth";
import { type TypeForgotPasswordForm } from "@/types/auth";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordForm() {
  const sendPasswordResetCodeMutation = useSendPasswordResetCodeMutation();
  const router = useRouter();
  const form = useForm<TypeForgotPasswordForm>({
    resolver: zodResolver(schemaForgotPasswordForm),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: TypeForgotPasswordForm) => {
    sendPasswordResetCodeMutation.mutate(values, {
      onSuccess: (result) => {
        console.log("values", result);
        router.push(`/forgot-password/reset-password?email=${values.email}`);
      },
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Forgot Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we&apos;ll send you a reset code.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full"
              disabled={sendPasswordResetCodeMutation.isPending}
            >
              Send Reset Code
              {sendPasswordResetCodeMutation.isPending && (
                <Loader className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
