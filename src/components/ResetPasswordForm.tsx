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
import { PasswordInput } from "./ui/password-input";
import {
  useResetPasswordMutation,
  useSendPasswordResetCodeMutation,
} from "@/hooks/auth/useLogin";
import { schemaResetPasswordForm } from "@/schema/auth";
import { type TypeResetPasswordForm } from "@/types/auth";
import { Loader, ArrowLeft } from "lucide-react";
import { Separator } from "./ui/separator";

interface ResetPasswordFormProps {
  email: string;
}

export default function ResetPasswordForm({ email }: ResetPasswordFormProps) {
  const sendPasswordResetCodeMutation = useSendPasswordResetCodeMutation();
  const resetPasswordMutation = useResetPasswordMutation();
  const form = useForm<TypeResetPasswordForm>({
    resolver: zodResolver(schemaResetPasswordForm),
    defaultValues: {
      email: email,
      code: "",
      newPassword: "",
    },
  });

  const onSubmit = (values: TypeResetPasswordForm) => {
    resetPasswordMutation.mutate(values);
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter the reset code sent to <strong>{email}</strong> and your new
          password.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reset Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the 5-character code from your email"
                    maxLength={5}
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
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <p>Password must contain:</p>
                  <ul className="grid list-inside list-disc grid-cols-2 space-y-0.5">
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

          <div className="flex flex-col gap-1">
            <Button
              type="submit"
              className="w-full"
              disabled={resetPasswordMutation.isPending}
            >
              Reset Password
              {resetPasswordMutation.isPending && (
                <Loader className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
            {/* Didn't receive the code? */}
            <div className="flex items-center justify-center text-muted-foreground">
              <p className="text-xs">Didn't receive the code?</p>
              <Button
                type="button"
                variant="link"
                className="p-1 text-xs text-inherit underline hover:text-primary"
                disabled={sendPasswordResetCodeMutation.isPending}
                onClick={() => {
                  sendPasswordResetCodeMutation.mutate({ email: email });
                }}
              >
                Send again
                {sendPasswordResetCodeMutation.isPending && (
                  <Loader className="ml-2 h-4 w-4 animate-spin" />
                )}
              </Button>
            </div>
            <Separator />
            <Button variant="link" className="mx-0 self-center text-xs">
              Cancel and go back to login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
