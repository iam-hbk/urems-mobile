import { PRFFormDataSchema } from "./../../interfaces/prf-schema";
import {
  PRF_FORM_RESPONSE_METADATA,
  SectionName,
  PRF_FORM_DATA,
  PRFormResponseStatus,
} from "@/interfaces/prf-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { ApiError } from "@/types/api";
import {
  createFormResponse,
  fetchFormResponseById,
  fetchPRFTemplateWithResponses,
  getPRFTemplate,
} from "@/lib/api/dynamic-forms-api";
import {
  CreatePRFResponsePayload,
  DetailedFormResponse,
  FormTemplate,
  FormTemplateWithResponses,
} from "@/types/form-template";
import { useRouter } from "next/navigation";
import { useAuthedUser } from "../auth/useSession";
import {
  getPrfResponseMetadata,
  getPrfResponseSectionByName,
  updatePrfResponse,
  SectionDataTypeMap,
  getPrfResponseStatus,
} from "@/lib/api/prf-api";

export const useGetPrfForms = () => {
  const setPrfForms = useStore((state) => state.setPrfForms);

  return useQuery<FormTemplateWithResponses | null, ApiError>({
    queryKey: ["prfForms"],
    queryFn: async () => {
      const templateResult = await fetchPRFTemplateWithResponses();

      return templateResult.match(
        (templateData) => {
          if (!templateData.formResponses) {
            return null;
          }
          setPrfForms(templateData.formResponses);
          return templateData;
        },
        (error) => {
          toast.error(`Failed to load PRF list: ${error.detail}`);
          throw error;
        },
      );
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    retry: false,
  });
};

export const useGetPrfFormById = (id: string) => {
  return useQuery<DetailedFormResponse, ApiError>({
    queryKey: ["prfForm", id],
    queryFn: async () => {
      // This now fetches from the new system and translates
      const result = await fetchFormResponseById(id);

      return result.match(
        (data) => {
          // return translateResponseToPrf(data);
          return data;
        },
        (error) => {
          toast.error(`Error fetching PRF form -> ${error.title}`);
          throw error;
        },
      );
    },
  });
};
export const useCreatePrf = () => {
  const {
    data: prfTemplate,
    isLoading: isTemplateLoading,
    error: templateError,
  } = useGetPRFTemplate();
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useAuthedUser();
  const mutation = useMutation({
    mutationFn: (prfData: PRF_FORM_DATA) => {
      if (!prfTemplate) {
        throw new Error("PRF template not available");
      }
      const employeeId = user?.id;
      if (!employeeId) {
        throw new Error(
          "Missing employeeId. Please re-authenticate and try again.",
        );
      }
      // Map the legacy PRF_FORM to the new CreateFormResponsePayload
      const payload: CreatePRFResponsePayload = {
        formTemplateId: prfTemplate.id,
        employeeId,
        patientId: null, // New PRFs start without a patient
        vehicleId: null,
        crewId: null,
        caseDetails: prfData.case_details?.data || null,
      };

      return createFormResponse(payload);
    },
    onSuccess: (result) => {
      result.match(
        (newResponse) => {
          toast.success("New PRF created successfully!");
          // Invalidate queries to refresh the list of forms
          queryClient.invalidateQueries({ queryKey: ["prfForms"] });
          queryClient.invalidateQueries({
            queryKey: ["formTemplateWithResponses", "PRF"],
          });
          // Redirect to the new form response page
          router.push(`/edit-prf/${newResponse.id}`);
        },
        (error) => {
          toast.error(`Failed to create PRF: ${error.detail}`);
        },
      );
    },
    onError: (error: ApiError) => {
      toast.error(`An unexpected error occurred: ${error.detail}`);
    },
  });

  return {
    ...mutation,
    isTemplateLoading,
    templateError,
    isReady: !!prfTemplate && !!user?.id && !isTemplateLoading,
  };
};

export const useGetPRFTemplate = () => {
  return useQuery<FormTemplate, ApiError>({
    queryKey: ["PRF_TEMPLATE"],
    queryFn: async () => {
      const result = await getPRFTemplate();
      console.log("🚀 result:", result);
      return result.match(
        (data) => data,
        (error) => {
          toast.error(`Error fetching PRF template: ${error.detail}`);
          throw error;
        },
      );
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24, // Data is considered fresh for 24 hours
    gcTime: 1000 * 60 * 60 * 24, // Keep the data in the cache for a day
  });
};

/**
 * Type-safe hook to fetch a specific PRF section by name.
 * The return type is automatically inferred based on the section name.
 *
 * @example
 * // TypeScript knows this returns case details data
 * const { data: caseDetails } = useGetPRFResponseSectionByName("123", "case_details");
 *
 * // TypeScript knows this returns vital signs data
 * const { data: vitalSigns } = useGetPRFResponseSectionByName("123", "vital_signs");
 */
export function useGetPRFResponseSectionByName<T extends SectionName>(
  PRFResponseId: string,
  sectionName: T,
): ReturnType<typeof useQuery<SectionDataTypeMap[T], ApiError>>;

export function useGetPRFResponseSectionByName<T extends SectionName>(
  PRFResponseId: string,
  sectionName: T,
) {
  return useQuery<SectionDataTypeMap[T], ApiError>({
    queryKey: ["prfSection", PRFResponseId, sectionName],
    queryFn: async () => {
      const result = await getPrfResponseSectionByName(
        PRFResponseId,
        sectionName,
      );
      return result.match(
        (data) => data,
        (error) => {
          toast.error(`Error fetching ${sectionName} section: ${error.detail}`);
          throw error;
        },
      );
    },
  });
}

/**
 * Type-safe hook to update a specific PRF section.
 * The data parameter type is automatically enforced based on the section name.
 *
 * @example
 * // TypeScript enforces case details structure
 * const updateCaseDetails = useUpdatePrfResponse("123", "case_details");
 * updateCaseDetails.mutate({ regionDistrict: "...", base: "...", ... });
 *
 * // TypeScript enforces vital signs structure
 * const updateVitalSigns = useUpdatePrfResponse("123", "vital_signs");
 * updateVitalSigns.mutate({ vital_signs: [...], ... });
 */
export function useUpdatePrfResponse<T extends SectionName>(
  prfResponseId: string,
  sectionName: T,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SectionDataTypeMap[T]) => {
      return updatePrfResponse(prfResponseId, sectionName, data);
    },
    onSuccess: (result) => {
      result.match(
        (data) => {
          toast.success(`${sectionName} section updated successfully!`);
          // Invalidate the specific section query to refetch updated data
          queryClient.invalidateQueries({
            queryKey: ["prfSection", prfResponseId, sectionName],
          });
          // Also invalidate the form metadata to update completion status
          queryClient.invalidateQueries({
            queryKey: ["prfResponseMetadata", prfResponseId],
          });
        },
        (error) => {
          toast.error(
            `Failed to update ${sectionName} section: ${error.detail}`,
          );
        },
      );
    },
    onError: (error: ApiError) => {
      toast.error(`Failed to update PRF response: ${error.detail}`);
    },
  });
}

export const useGetPRFResponseMetadata = (prfResponseId: string) => {
  return useQuery<PRF_FORM_RESPONSE_METADATA, ApiError>({
    queryKey: ["prfResponseMetadata", prfResponseId],
    queryFn: async () => {
      const result = await getPrfResponseMetadata(prfResponseId);
      return result.match(
        (data) => data,
        (error) => {
          toast.error(`Error fetching PRF response metadata: ${error.detail}`);
          throw error;
        },
      );
    },
  });
};

export const useGetPRFResponseSectionStatus = (prfResponseId: string) => {
  return useQuery<PRFormResponseStatus, ApiError>({
    queryKey: ["prfResponseSectionStatus", prfResponseId],
    queryFn: async () => {
      const result = await getPrfResponseStatus(prfResponseId);
      return result.match(
        (data) => data,
        (error) => {
          toast.error(`Error fetching PRF response status: ${error.detail}`);
          throw error;
        },
      );
    },
  });
};
