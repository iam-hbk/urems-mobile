"use client";

import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  return (
    <div className="flex h-full items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900">
        <div className="flex justify-center">
          <Image
            src="/urems-erp.png"
            alt="UREMS Logo"
            width={120}
            height={40}
            priority
          />
        </div>

        <div className="flex justify-center">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
