import {
  PRF_FORM_RESPONSE_METADATA,
  SectionName,
  PRF_FORM_DATA,
  PRFormResponseStatus,
} from "@/interfaces/prf-form";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
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
    queryKey: ["PRF_TEMPLATE_WITH_RESPONSES"],
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
        patientId: null,
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

// Reusable query key
export const prfSectionKey = <T extends SectionName>(id: string, name: T) =>
  ["prfSection", id, name] as const;

// Reusable query options (works with useQuery *and* ensureQueryData)
export function prfSectionQueryOptions<T extends SectionName>(
  id: string,
  name: T,
) {
  return {
    queryKey: prfSectionKey(id, name),
    // Note the explicit Promise type to preserve T mapping
    queryFn: async (): Promise<SectionDataTypeMap[T]> => {
      const result = await getPrfResponseSectionByName(id, name);
      return result.match(
        (data) => data,
        (error: ApiError) => {
          toast.error(`Error fetching ${name} section: ${error.detail}`);
          throw error;
        },
      );
    },
    staleTime: 0, // Always refetch when invalidated
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  };
}

export function useGetPRFResponseSectionByName<T extends SectionName>(
  PRFResponseId: string,
  sectionName: T,
): ReturnType<typeof useQuery<SectionDataTypeMap[T], ApiError>>;

export function useGetPRFResponseSectionByName<T extends SectionName>(
  PRFResponseId: string,
  sectionName: T,
) {
  return useQuery<SectionDataTypeMap[T], ApiError>(
    prfSectionQueryOptions(PRFResponseId, sectionName),
  );
}
export function ensurePRFResponseSectionByName<T extends SectionName>(
  qc: QueryClient,
  PRFResponseId: string,
  sectionName: T,
) {
  return qc.ensureQueryData(prfSectionQueryOptions(PRFResponseId, sectionName));
}

export function useUpdatePrfResponse<T extends SectionName>(
  prfResponseId: string,
  sectionName: T,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SectionDataTypeMap[T]) => {
      console.log(`DATA[${sectionName}] -> `, data);
      return updatePrfResponse(prfResponseId, sectionName, data);
    },
    onSuccess: (result) => {
      result.match(
        () => {
          // Invalidate and immediately refetch the specific section query
          queryClient.invalidateQueries({
            queryKey: prfSectionKey(prfResponseId, sectionName),
          });

          // Force a refetch to ensure immediate data update
          queryClient.refetchQueries({
            queryKey: prfSectionKey(prfResponseId, sectionName),
          });

          // Also invalidate the form section status to update completion status
          queryClient.invalidateQueries({
            queryKey: ["prfResponseSectionStatus", prfResponseId],
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
