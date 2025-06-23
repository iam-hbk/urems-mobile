import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/lib/auth/api";

export const useSessionQuery = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: getSession,
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // refetchOnWindowFocus: true,
  });
}; 