import { apiChangePassword, apiGetUserInformation } from "@/lib/api/apiEmployee"
import { TypeChangePasswordForm } from "@/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";


export const useGetEmployeeInformation = () => {

  return useQuery({
    queryKey: ['getEmployee'],
    queryFn: async () => {
      try {
        const res = await apiGetUserInformation();
        return res
      }
      catch (error: unknown) {
        throw error as Error;
      }
    }
  });
}

export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (passwords: TypeChangePasswordForm) => {
      await apiChangePassword(passwords);
      toast.success("Password successfully changed.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => { }
  })
}