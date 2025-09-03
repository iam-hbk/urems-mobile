import { apiGetUserInformation } from "@/lib/api/apiEmployee"
import { getUser } from "@/lib/auth/dal";
import { useQuery } from "@tanstack/react-query"
import { redirect } from "next/navigation";
import { UserData } from "@/lib/auth/dal";


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

  return useQuery<UserData>({
    queryKey: ['getEmployee'],
    queryFn: async (): Promise<UserData> => {
      try {
        const employeeData = await getUser();
        return employeeData;
      } catch (error) {
        console.error("Error loading employee data:", error);
        // Redirect to login on authentication errors
        redirect("/login");
      }
    }
  })
} 