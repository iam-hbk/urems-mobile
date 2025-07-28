"use client";

import { useSession } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import Loading from "./loading";

interface ClientProtectedPageProps {
  children: ReactNode;
}

export function ClientProtectedPage({ children }: ClientProtectedPageProps) {
  const { data: session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.push("/login");
    }
  }, [loading, session, router]);

  if (loading || !session) {
    return <Loading />;
  }

  return (
    <>
      {/* <h1>{JSON.stringify(session)}</h1> */}
      {children}
    </>
  );
}
