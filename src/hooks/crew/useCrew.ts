import { apiGetCrewEmployeeID } from "@/lib/api/crew-apis";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { WretchError } from "wretch";


export function useGetCrewEmployeeID(id: string) {
  return useQuery({
    queryKey: ['crewemployeeID', id],
    queryFn: async () => {
      try {
        const res = await apiGetCrewEmployeeID(id);
        console.log(res);
        // 
      } catch (error: unknown) {
        const err = error as WretchError;
        toast.error(`Error Fetching Employee Crew ID -> ${err.json.title}`);
      }
    }
  })
}