'use client'

import React, { useState } from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { TypeChangePasswordForm } from '@/types/auth';
import { useChangePassword } from '@/hooks/employee/useEmployee';


export default function ChangePasswordForm() {
  const [formData, setFormData] = useState<TypeChangePasswordForm>({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const mutation = useChangePassword()


  async function onSubmit() {
    setLoading(true)
    try {

      if (formData.confirmPassword !== formData.newPassword) {
        toast.error("Confirm password do not match new password");
        return;
      }

      mutation.mutateAsync(formData);

      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });

    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (<div className="w-full space-y-8 rounded-lg border p-6 shadow-lg">
    <div className="space-y-2 text-center">
      <h1 className="text-3xl font-bold">Change Password</h1>
    </div>

    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit() }}
      className=" flex flex-col gap-y-[1rem] " >

      <Input
        placeholder='Enter current password'
        value={formData.currentPassword}
        onChange={e => setFormData({ ...formData, currentPassword: e.target.value })} />

      <Input
        placeholder='Enter new password' value={formData.newPassword}
        onChange={e => setFormData({ ...formData, newPassword: e.target.value })} />

      <Input
        placeholder='Enter confirm password' value={formData.confirmPassword}
        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />

      <Button disabled={loading} type="submit" className="w-full mt-[2rem] ">
        Confirm
      </Button>
    </form>

  </div>
  )
}