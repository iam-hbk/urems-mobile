"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { getSession } from "@/lib/auth/api";

const queryClient = new QueryClient();

export default function QueryClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Prefetch session once on app shell mount
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["session"],
      queryFn: async () => {
        const result = await getSession();
        return result.match(
          (session) => session,
          () => null,
        );
      },
      staleTime: 10 * 60 * 1000,
    }).catch(() => {});
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
