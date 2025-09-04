"use client";

import { useSessionQuery } from "@/hooks/auth/useSession";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import Loading from "./loading";

interface ClientProtectedPageProps {
  children: ReactNode;
}

export function ClientProtectedPage({ children }: ClientProtectedPageProps) {
  const { data: session, isLoading } = useSessionQuery();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.push("/login");
    }
  }, [isLoading, session, router]);

  if (isLoading || !session) {
    return <Loading />;
  }

  return (
    <>
      {/* <h1>{JSON.stringify(session)}</h1> */}
      {children}
    </>
  );
}
