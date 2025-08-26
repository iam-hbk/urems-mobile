import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/lib/auth/api";
import { toast } from "sonner";
import { getUser, type Session } from "@/lib/auth/dal";
import type { ApiError } from "@/types/api";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export const useSessionQuery = () => {
  const router = useRouter();
  const pathname = usePathname();
  const publicPaths = ["/login", "/forgot-password"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  return useQuery<Pick<Session, "user"> | null, ApiError>({
    queryKey: ["session"],
    queryFn: async () => {
      const result = await getSession();

      return result.match(
        (session) => session,
        (e) => {
          if (e.type !== "AuthenticationError") {
            toast.error(`Error loading session: ${e.detail}`);
          } else if (!isPublicPath) {
            router.push("/login");
          }
          throw e;
        },
      );
    },
    retry: (failureCount, error) => {
      // console.log("ERROR IN SESSION", error);
      if (error.type === "AuthenticationError") {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};


// 
// get current user
export function useGetUser() {

  return useQuery({
    queryKey: ['getUser'],
    queryFn: async () => {
      const data = await getUser();
      return data;
    }
  });
}

// Lightweight selector hook to access just the user from the session cache
export const useAuthedUser = () => {
  const { data } = useSessionQuery();
  return data?.user ?? null;
};

// Cached-only read: returns whatever is already in the cache without fetching
export const useCachedUser = (): { user: Session["user"] | null } => {
  const queryClient = useQueryClient();
  const cached = queryClient.getQueryData<Pick<Session, "user"> | null>([
    "session",
  ]);
  return { user: cached?.user ?? null };
};
