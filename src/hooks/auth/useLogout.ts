import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { logout } from "@/lib/auth/api";
import { useRouter } from "next/navigation";
import { deleteCookie } from "@/utils/cookies";
import { cookieNameUserId } from "@/utils/constant";
import { UserTokenCookieName } from "@/lib/auth/config";

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // delete cookies
      deleteCookie(cookieNameUserId)
      deleteCookie(UserTokenCookieName)

      toast.success("You have been logged out.");
      // Clear the session in the cache and redirect
      queryClient.setQueryData(["session"], null);
      router.push("/login");
    },
    onError: (error) => {
      // when api fails, send user to login , token might have expired
      deleteCookie(cookieNameUserId)
      deleteCookie(UserTokenCookieName)

      queryClient.setQueryData(["session"], null);
      router.push("/login");

      toast.error(error.message || "Logout failed. Please try again.");
    },
  });
}; 