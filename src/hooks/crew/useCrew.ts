import { apiCrewGetCurrent, apiGetCrewEmployeeID } from "@/lib/api/crew-apis";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/dal";
import { WretchError } from "wretch";
import { toast } from "sonner";
import { getCookie } from "@/utils/cookies";
import { cookieNameUserId } from "@/utils/constant";
import { UserTokenCookieName } from "@/lib/auth/config";
import { Err } from "neverthrow";
import { typeCrew } from "@/types/crew";

export function useGetCrewEmployeeID() {
  return useQuery({
    queryKey: ['crewEmployeeID'],
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

// employee current or future crew
export function useCrewGetCurrent() {

  return useQuery<typeCrew[]>({
    queryKey: ['crewEmployeeID'],
    queryFn: async () => {
      try {
        const token = await getCookie(UserTokenCookieName)
        const userId = await getCookie(cookieNameUserId)

        if (!token || !userId) {
          throw new Error("Invalid user session, please try again");
        }

        const { data, error } = await apiCrewGetCurrent(userId, token);

        if (error) throw new Error(error);

        // there is > 1 up coming shift.. only get the nearest shift/crew, after sorting by start Date
        // else, just return that shift/crew
        if (data.length > 1) {
          // sort ascending order
          data.sort((a: typeCrew, b: typeCrew) => {
            const aa = new Date(a.startTime).getTime();
            const bb = new Date(b.startTime).getTime();

            // validation
            if (isNaN(aa) || isNaN(bb)) return 0;

            return aa - bb; // descending : bb - aa
          });
        }

        return data;

      } catch (error: unknown) {
        const err = error as WretchError;
        toast.error(`Error Fetching Employee Current Crew ID -> ${err.json.title}`);
      }
    }
  })
}