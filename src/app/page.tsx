"use client";
import { useSessionQuery } from "@/hooks/auth/useSession";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, isLoading } = useSessionQuery();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [session, isLoading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Image src="/urems-erp.png" alt="UREMS ERP" width={100} height={100} />
    </div>
  );
}
