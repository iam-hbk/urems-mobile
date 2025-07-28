import { apiCrewGetCurrent, apiCrewGetCurrentv1, apiCrewGetEmployee, apiGetCrewEmployeeID } from "@/lib/api/crew-apis";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { WretchError } from "wretch";
import { toast } from "sonner";
import { getCookie } from "@/utils/cookies";
import { cookieNameUserId } from "@/utils/constant";
import { UserTokenCookieName } from "@/lib/auth/config";
import { typeCrew, typeCrewInfoV1 } from "@/types/crew";

export function useGetCrewEmployeeID() {

  // returns -> typeCrewInfoV1[]
  return useQuery({
    queryKey: ['crewEmployeeID'],
    queryFn: async () => {
      try {
        const token = await getCookie(UserTokenCookieName)
        const userId = await getCookie(cookieNameUserId)

        if (!token || !userId) {
          throw new Error("Invalid user session, please try again");
        }

        const { data, error } = await apiCrewGetEmployee(userId, token);

        if (error) throw new Error(error);

        return data;
        // 
      } catch (error: unknown) {
        const err = error as WretchError;
        toast.error(`Error Fetching Employee Crew ID -> ${err.json.title}`);
        // redirect("/login");
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

export function useCrewGetCurrentv1() {

  return useQuery<typeCrewInfoV1>({
    queryKey: ['crewEmployeeID'],
    queryFn: async () => {
      try {
        const token = await getCookie(UserTokenCookieName)
        const userId = await getCookie(cookieNameUserId)

        if (!token || !userId) {
          throw new Error("Invalid user session, please try again");
        }

        const { data, error } = await apiCrewGetCurrentv1(userId, token);

        if (error) throw new Error(error);

        return data;

      } catch (error: unknown) {
        const err = error as WretchError;
        toast.error(`Error Fetching Employee Current Crew ID -> ${err.json.title}`);
      }
    }
  })
}