"use client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export type UserData = {
  firstName: string;
  lastName: string;
  initials: string;
  gender: string;
  id: string;
  email: string;
  userName: string;
};

export type ClientSession = {
  user: UserData;
  sessionToken: string;
};

export type UseSessionReturn = {
  data: ClientSession | null;
  loading: boolean;
  sessionToken: string | null;
};

// Custom hook for session management
export const useSession = () => {
  const {
    data: session,
    isLoading: loading,
    isError,
  } = useQuery<ClientSession | null>({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/auth/session", {
          credentials: "include",
        });

        if (response.ok) {
          const sessionData = await response.json();
          if (sessionData && Object.keys(sessionData).length > 0) {
            return sessionData;
          }
          return null;
        }
        return null;
      } catch (error) {
        console.error("Failed to fetch session:", error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  return {
    data: isError ? null : session,
    loading,
    sessionToken: session?.sessionToken || null,
  };
};

export const authClient = {
  useSession,
};
