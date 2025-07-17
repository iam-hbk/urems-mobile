import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/lib/store";
import { PRF_FORM } from "@/interfaces/prf-form";
import { toast } from "sonner";
import { ApiError } from "@/types/api";
import {
  fetchFormResponseById,
  fetchFormTemplateWithResponses,
} from "@/lib/api/dynamic-forms-api";
import { translateResponseToPrf } from "@/lib/prf-adapter";
import { PRF_FORM_TEMPLATE_ID } from "./useCreatePrf";
import { DetailedFormResponse } from "@/types/form-template";

export const useGetPrfForms = () => {
  const setPrfForms = useStore((state) => state.setPrfForms);

  return useQuery<PRF_FORM[], ApiError>({
    queryKey: ["prfForms"],
    queryFn: async () => {
      const templateResult = await fetchFormTemplateWithResponses(
        PRF_FORM_TEMPLATE_ID,
      );

      return templateResult.match(
        async (templateData) => {
          if (!templateData.formResponses) {
            return [];
          }

          const detailedResponsesPromises = templateData.formResponses.map(
            (summary) => fetchFormResponseById(summary.id),
          );

          const detailedResponsesResults = await Promise.all(
            detailedResponsesPromises,
          );

          const successfulDetailedResponses = detailedResponsesResults
            .map((result) => {
              if (result.isErr()) {
                console.error(
                  "Failed to fetch detailed response:",
                  result.error.detail,
                );
                return null;
              }
              return result.value;
            })
            .filter(
              (response): response is DetailedFormResponse => response !== null,
            );

          const prfs = successfulDetailedResponses.map(translateResponseToPrf);

          setPrfForms(prfs);
          return prfs;
        },
        (error) => {
          toast.error(`Failed to load PRF list: ${error.detail}`);
          throw error;
        },
      );
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
};

export const useGetPrfFormById = (id: string) => {
  return useQuery<PRF_FORM, ApiError>({
    queryKey: ["prfForm", id],
    queryFn: async () => {
      // This now fetches from the new system and translates
      const result = await fetchFormResponseById(id);

      return result.match(
        (data) => {
          return translateResponseToPrf(data);
        },
        (error) => {
          toast.error(`Error fetching PRF form -> ${error.title}`);
          throw error;
        },
      );
    },
  });
};
