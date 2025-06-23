import { apiGetUserInformation } from "@/lib/api/apiEmployee"
import { useQuery } from "@tanstack/react-query"


export const useGetEmployeeInformation = (userId: string) => {

  return useQuery({
    queryKey: ['getEmployee'],
    queryFn: async () => {
      try {
        const res = await apiGetUserInformation(userId);
        return res
      }
      catch (error: unknown) {
        throw error as Error;
      }
    }
  });
}