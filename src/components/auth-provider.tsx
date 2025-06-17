"use client";

import { authClient } from "@/lib/auth/client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  authClient.useSession();

  return <>{children}</>;
} 