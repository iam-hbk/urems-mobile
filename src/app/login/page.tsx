"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { PasswordInput } from "@/components/ui/password-input";
import { useLoginMutation } from "@/hooks/auth/useLogin";
import { useSessionQuery } from "@/hooks/auth/useSession";
import { schemaLoginForm, type LoginPayload } from "@/schema/auth";
import Image from "next/image";
import Link from "next/link";
import { Loader } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isLoading: isSessionLoading } = useSessionQuery();
  const loginMutation = useLoginMutation();

  const form = useForm<LoginPayload>({
    resolver: zodResolver(schemaLoginForm),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginPayload) => {
    loginMutation.mutate(values);
  };

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  // Display a loading state while checking for an active session
  if (isSessionLoading) {
    return <Loader className="h-12 w-12 animate-spin" />;
  }

  // Don't render the form if a session is found
  if (session) {
    return null;
  }

  return (
    <div className="flex h-full items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg p-8 shadow-lg">
        <div className="flex justify-center">
          <Image
            src="/urems-erp.png"
            alt="UREMS Logo"
            width={120}
            height={40}
            priority
          />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account.
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              Sign In
              {loginMutation.isPending && (
                <Loader className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
