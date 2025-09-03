import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchFormTemplateById,
  fetchFormTemplateWithResponses,
  createFormResponse,
  fetchFormResponseById,
  apiUpdateFormResponse,
} from "@/lib/api/dynamic-forms-api";
import { toast } from "sonner";
// import { useRouter } from "next/navigation";
import {
  CreateFormResponsePayload,
  DetailedFormResponse,
  FormTemplate,
  FormTemplateWithResponses,
  Section,
  FormResponseSummary,
  FormResponseUpdateDto,
} from "@/types/form-template";
import { ApiError } from "@/types/api";
import { Result } from "neverthrow";

export const useFormTemplate = (formId: string) => {
  return useQuery<FormTemplate, ApiError>({
    queryKey: ["formTemplate", formId],
    queryFn: async () => {
      const result = await fetchFormTemplateById(formId);
      return result.match(
        (data) => {
          // console.log("🚀 Hook unwrapped data:", data);
          return data;
        },
        (e) => {
          toast.error(
            `Error loading form template: ${e.detail || "Not found"}`,
          );
          throw e;
        },
      );
    },
    enabled: !!formId,
    // TODO: Uncomment this when we are ready to cache the form template and pushing to production
    // staleTime: 1000 * 60 * 60,
    // gcTime: 1000 * 60 * 60 * 24,
  });
};

export const useFormTemplateWithResponses = (
  templateId: string,
  userId?: string,
) => {
  return useQuery<FormTemplateWithResponses, ApiError>({
    queryKey: ["formTemplateWithResponses", templateId],
    queryFn: async () => {
      const result = await fetchFormTemplateWithResponses(templateId);
      return result.match(
        (data) => data,
        (e) => {
          toast.error(`Error loading responses: ${e.detail || "Not found"}`);
          throw e;
        },
      );
    },
    enabled: !!templateId && !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

type CreateFormResponseOptions = {
  formTemplateId: string;
  sections: Section[] | undefined;
};

export const useCreateFormResponse = ({
  formTemplateId,
  // sections,
}: CreateFormResponseOptions) => {
  const queryClient = useQueryClient();

  return useMutation<
    Result<FormResponseSummary, ApiError>,
    ApiError,
    Omit<CreateFormResponsePayload, "formTemplateId">
  >({
    mutationFn: (payload) => createFormResponse({ ...payload, formTemplateId }),
    onSuccess: (result) => {
      result.match(
        (newResponseData) => {
          if (newResponseData) { }
          // console.log("🚀 newResponseData:", newResponseData);
          toast.success("New form response created successfully!");
          queryClient.invalidateQueries({
            queryKey: ["formTemplateWithResponses", formTemplateId],
          });
        },
        (e) => {
          toast.error(`Failed to create response: ${e.detail}`);
        },
      );
    },
    onError: (error) => {
      // This will only be called for unexpected errors, not API errors wrapped in Result
      // console.log("🚀 Unexpected error:", error);
      toast.error(`An unexpected error occurred: ${error.detail}`);
    },
  });
};

export const useFormResponse = (responseId: string) => {
  return useQuery<DetailedFormResponse, ApiError>({
    queryKey: ["formResponse", responseId],
    queryFn: async () => {
      const result = await fetchFormResponseById(responseId);
      return result.match(
        (data) => data,
        (e) => {
          toast.error(
            `Error loading form response: ${e.detail || "Not found"}`,
          );
          throw e;
        },
      );
    },
    enabled: !!responseId,
  });
};

export const useUpdateFormResponse = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Result<{ status: number }, ApiError>,
    ApiError,
    { responseId: string; payload: FormResponseUpdateDto }
  >({
    mutationFn: ({ responseId, payload }) =>
      apiUpdateFormResponse(responseId, payload),
    onSuccess: (result, variables) => {
      result.match(
        () => {
          toast.success("Form response updated successfully!");
          // Invalidate the form response query to refresh data
          queryClient.invalidateQueries({
            queryKey: ["formResponse", variables.responseId],
          });
        },
        (e) => {
          toast.error(`Failed to update response: ${e.detail}`);
        },
      );
    },
    onError: (error) => {
      toast.error(`An unexpected error occurred: ${error.detail}`);
    },
  });
};

// Note: useFormTemplateAndResponse has been removed since we now fetch the template server-side
// and only fetch responses on the client to reduce layout shift
