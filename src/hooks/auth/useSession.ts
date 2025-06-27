import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/lib/auth/api";
import { toast } from "sonner";
import type { Session } from "@/lib/auth/dal";
import type { ApiError } from "@/types/api";

export const useSessionQuery = () => {
  return useQuery<Pick<Session, "user"> | null, ApiError>({
    queryKey: ["session"],
    queryFn: async () => {
      const result = await getSession();
      return result.match(
        (session) => session,
        (e) => {
          // Don't show toast for auth errors as they're expected when not logged in
          if (e.type !== "AuthenticationError") {
            toast.error(`Error loading session: ${e.detail}`);
          }
          throw e;
        },
      );
    },
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // refetchOnWindowFocus: true,
  });
};
