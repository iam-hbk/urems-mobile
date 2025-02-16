import { useQuery } from "@tanstack/react-query";
import api from "../../lib/wretch";
import { useStore } from "@/lib/store";
import { PRF_FORM } from "@/interfaces/prf-form";
import { toast } from "sonner";
import { WretchError } from "wretch";

export const fetchPrfForms = async (): Promise<PRF_FORM[]> => {
  const req = api.catcher(404, (error) => {
    toast.error("Forms not found");
    return null;
  });

  return (await req.get("/prfform")) as Promise<PRF_FORM[]>;
};
export const fetchPrfForm = async (id: string): Promise<PRF_FORM> => {
  const req = api.catcher(404, (error) => {
    toast.error("Form not found");
    return null;
  });

  return (await req.get(`/prfform/${id}`)) as Promise<PRF_FORM>;
};

const needsDoubleParsing = (prf: any): boolean => {
  // Add your logic here to determine if a prf needs double parsing.
  // For example, check for a specific property or pattern in prf.prfData.
  // This is a placeholder - replace with your actual condition.
  return typeof prf.prfData === "string" && prf.prfData.startsWith('"{\\"');
};

export const usePrfForms = () => {
  const setPrfForms = useStore((state) => state.setPrfForms);

  return useQuery({
    queryKey: ["prfForms"],
    queryFn: async () => {
      try {
        const data = await fetchPrfForms();
        const processedData = data.map((prf) => {
          try {
            if (needsDoubleParsing(prf)) {
              // Double parse
              const outerParsed = {
                ...prf,
                prfData: JSON.parse(prf.prfData as string),
              };
              return {
                ...outerParsed,
                prfData: JSON.parse(outerParsed.prfData as string),
              };
            } else {
              // Single parse
              return {
                ...prf,
                prfData: JSON.parse(prf.prfData as string),
              };
            }
          } catch (parseError) {
            console.error(
              `Error parsing prfData for prfFormId ${prf.prfFormId}:`,
              parseError,
            );
            return prf; // Return the original object on error
          }
        });

        setPrfForms(processedData); // Store in Zustand on success
        console.log("*****************Processed data:", processedData);
        return processedData;
      } catch (error) {
        const err = error as WretchError;
        toast.error(`Error fetching PRF forms -> ${err.json.title}`);
        throw error; // Re-throw the error to let useQuery handle it
      }
    },
  });
};

export const usePrfForm = (id: string) => {
  return useQuery({
    queryKey: ["prfForm", id],
    queryFn: async () => {
      try {
        const data = await fetchPrfForm(id);
        data.prfData = JSON.parse(data.prfData as string);
        return data;
      } catch (error) {
        const err = error as WretchError;
        toast.error(`Error fetching PRF form -> ${err.json.title}`);
      }
    },
  });
};
