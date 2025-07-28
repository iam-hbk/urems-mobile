import { apiGetUserInformation } from "@/lib/api/apiEmployee"
import { getUser, UserData } from "@/lib/auth/dal";
import { useQuery } from "@tanstack/react-query"
import { redirect } from "next/navigation";


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

// found this useful
export function useGetEmployeeId() {

  return useQuery<UserData>({
    queryKey: ['getEmployee'],
    queryFn: async () => {
      const employeeData = await getUser();

      if (employeeData.isErr()) {
        redirect("/login");
      }

      return employeeData.value
    }
  })
} 