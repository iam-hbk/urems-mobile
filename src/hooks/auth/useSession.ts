import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/lib/auth/api";
import { toast } from "sonner";
import { getUser, type Session } from "@/lib/auth/dal";
import type { ApiError } from "@/types/api";
import { usePathname, useRouter } from "next/navigation";

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
    // staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
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
