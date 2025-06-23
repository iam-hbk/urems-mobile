import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { logout } from "@/lib/auth/api";
import { useRouter } from "next/navigation";

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("You have been logged out.");
      // Clear the session in the cache and redirect
      queryClient.setQueryData(["session"], null);
      router.push("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Logout failed. Please try again.");
    },
  });
}; 