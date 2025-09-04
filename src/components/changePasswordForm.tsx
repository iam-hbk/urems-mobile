"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInput } from "./ui/password-input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { TypeChangePasswordForm } from "@/types/auth";
import { useChangePasswordMutation } from "@/hooks/auth/useChangePassword";
import { schemaChangePasswordForm } from "@/schema/auth";
import { Loader } from "lucide-react";
import { z } from "zod";

// Extended form interface for client-side confirm password validation
interface ChangePasswordFormData extends TypeChangePasswordForm {
  confirmPassword: string;
}

export default function ChangePasswordForm() {
  const mutation = useChangePasswordMutation();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(
      schemaChangePasswordForm.extend({
        confirmPassword: z.string().min(1, "Please confirm your new password"),
      }),
    ),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ChangePasswordFormData) => {
    if (values.confirmPassword !== values.newPassword) {
      toast.error("Confirm password does not match new password");
      return;
    }

    // Only send currentPassword and newPassword to the API
    const apiPayload: TypeChangePasswordForm = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    };

    mutation.mutate(apiPayload, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <div className="w-full space-y-8 rounded-lg border p-6 shadow-lg">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Change Password</h1>
        <p className="text-sm text-muted-foreground">
          Update your current password to a new one.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Enter current password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <p>Password must contain:</p>
                  <ul className="list-inside list-disc space-y-0.5">
                    <li>At least 6 characters</li>
                    <li>One uppercase letter (A-Z)</li>
                    <li>One lowercase letter (a-z)</li>
                    <li>One digit (0-9)</li>
                    <li>One special character</li>
                  </ul>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-6 w-full"
            disabled={mutation.isPending}
          >
            Change Password
            {mutation.isPending && (
              <Loader className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
