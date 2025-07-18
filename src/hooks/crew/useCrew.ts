import { apiGetCrewEmployeeID } from "@/lib/api/crew-apis";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/dal";
import { WretchError } from "wretch";
import { toast } from "sonner";

export function useGetCrewEmployeeID() {
  return useQuery({
    queryKey: ['crewemployeeID'],
    queryFn: async () => {
      try {
        const employeeData = await getUser();

        if (employeeData.isErr()) {
          redirect("/login");
        }

        const userData = employeeData.value

        const res = await apiGetCrewEmployeeID(userData.id);

        return res;
        // 
      } catch (error: unknown) {
        const err = error as WretchError;
        toast.error(`Error Fetching Employee Crew ID -> ${err.json.title}`);
      }
    }
  })
}