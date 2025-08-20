import { apiGetUserInformation } from "@/lib/api/apiEmployee"
import { getUser } from "@/lib/auth/dal";
import type { typeEmployee } from "@/types/person";
import { useQuery } from "@tanstack/react-query"
import { redirect } from "next/navigation";


export const useGetEmployeeInformation = (userId: string) => {

  return useQuery({
    queryKey: ['getEmployee'],
    queryFn: async () => {
      const res = await apiGetUserInformation(userId);
      return res
    }
  });
}

// found this useful
export function useGetEmployeeId() {

  return useQuery<typeEmployee>({
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