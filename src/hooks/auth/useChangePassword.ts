import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { changePassword } from "@/lib/auth/api";


export const useChangePasswordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changePassword,
    onSuccess: (result) => {
      if (result.isOk()) {
        toast.success("Password successfully changed.");
        // Optionally invalidate session query in case tokens are refreshed
        queryClient.invalidateQueries({ queryKey: ["session"] });
      } else {
        alert(result.error.detail);
        toast.error(result.error.detail);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to change password");
    },
  });
}; 