"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Suspense, useState } from "react";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { TypeLoginForm } from "@/types/auth";
import { authClient } from "@/lib/auth/client";


const LoginForm = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') || '/';
  const [formData, setFormData] = useState<TypeLoginForm>({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();


  async function onSubmit() {
    setLoading(true);
    try {
      const sessionToken = await authClient.signIn.credentials(formData);

      if (sessionToken) {
        // store token
        router.push(redirectTo);
        router.refresh();
      }
      else {
        toast.error("Failed to login");
      }
    }
    catch (error: unknown) {
      const m = (error instanceof Error) ? error.message : "Unknown error login";
      toast.error(m);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-6 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-500">Please sign in to continue</p>
        </div>

        {/*  */}
        <form
          onSubmit={(e) => { e.preventDefault(); onSubmit() }}
          className="space-y-6 flex flex-col gap-y-[1rem] " >

          <Input type='email' placeholder='Enter email' value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })} />

          <div className=' flex flex-row gap-x-[1rem] ' >
            <Input
              type={showPwd ? 'text' : 'password'}
              placeholder='Enter password' value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })} />
            <Button onClick={() => setShowPwd(!showPwd)} >
              {showPwd ? <EyeClosedIcon /> : <EyeIcon />}
            </Button>
          </div>

          <Button disabled={loading} type="submit" className="w-full">
            Sign In
          </Button>
        </form>
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