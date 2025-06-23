import ResetPasswordForm from "@/components/ResetPasswordForm";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your password",
};
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const email = searchParams?.email as string;
  if (!email) {
    return (
      <div className="flex h-full items-center justify-center">
        <Button variant="link" className="mx-0 self-center text-xs">
          Back to Forgot Password
        </Button>
      </div>
    );
  }

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
        <ResetPasswordForm email={email} />
      </div>
    </div>
  );
}

export default Page;
