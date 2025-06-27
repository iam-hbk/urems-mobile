import { useQuery } from "@tanstack/react-query";
import api from "../../lib/wretch";
import { useStore } from "@/lib/store";
import { PRF_FORM } from "@/interfaces/prf-form";
import { toast } from "sonner";
import { Result } from "neverthrow";
import { ApiError } from "@/types/api";

export const fetchPrfForms = async (): Promise<Result<PRF_FORM[], ApiError>> => {
  return api.get<PRF_FORM[]>("/prfform");
};

export const fetchPrfForm = async (id: string): Promise<Result<PRF_FORM, ApiError>> => {
  return api.get<PRF_FORM>(`/prfform/${id}`);
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
      const result = await fetchPrfForms();
      
      if (result.isOk()) {
        const data = result.value;
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
        // console.log("*****************Processed data:", processedData);
        return processedData;
      } else {
        toast.error("Forms not found");
        throw new Error(result.error.detail);
      }
    },
  });
};

export const usePrfForm = (id: string) => {
  return useQuery({
    queryKey: ["prfForm", id],
    queryFn: async () => {
      const result = await fetchPrfForm(id);
      
      if (result.isOk()) {
        const data = result.value;
        data.prfData = JSON.parse(data.prfData as string);
        return data;
      } else {
        toast.error(`Error fetching PRF form -> ${result.error.title}`);
        throw new Error(result.error.detail);
      }
    },
  });
};
