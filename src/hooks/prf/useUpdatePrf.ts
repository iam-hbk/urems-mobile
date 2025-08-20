import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PRF_FORM } from "@/interfaces/prf-form";
import { toast } from "sonner";
import { ApiError } from "@/types/api";
import { Result, Err } from "neverthrow";
import { apiUpdateFormResponse } from "@/lib/api/dynamic-forms-api";
import { useRouter } from "next/navigation";
import { FormResponseUpdateDto } from "@/types/form-template";

/**
 * Updates just the Case Details section of a PRF.
 * @param prf The complete PRF_FORM object.
 */
export const updateCaseDetails = async (
  prf: PRF_FORM,
): Promise<Result<{ status: number }, ApiError>> => {
  if (!prf.prfFormId) {
    return new Err({
      type: "Validation Error",
      status: 400,
      title: "Missing PRF ID",
      detail: "Cannot update a PRF without a valid prfFormId.",
    });
  }

  const caseDetails = prf.prfData.case_details;

  if (!caseDetails?.data) {
    return new Err({
      type: "Validation Error",
      status: 400,
      title: "Missing Case Details Data",
      detail: "Cannot update case details without data.",
    });
  }

  const { data } = caseDetails;

  const payload: FormResponseUpdateDto = {
    fieldResponses: [
      {
        fieldDefinitionId: "fb769988-ea1e-4d4d-b995-6417abb89734",
        value: String(data.regionDistrict || ""),
      },
      {
        fieldDefinitionId: "538f44c5-4140-4795-99e3-9d8e8255892f",
        value: String(data.base || ""),
      },
      {
        fieldDefinitionId: "7285441d-d1f0-4d33-91cf-2bb6f123cd1f",
        value: String(data.province || ""),
      },
      {
        fieldDefinitionId: "735326bb-eccd-4d58-8fa0-2bbff51db99e",
        value: data.dateOfCase ? new Date(data.dateOfCase).toISOString() : "",
      },
      {
        fieldDefinitionId: "0902aca4-ce3f-422b-a5f0-9c57c7dbdb26",
        value: String(data.vehicle.id || "0"),
      },
      {
        fieldDefinitionId: "85f06b71-61a3-4fa5-a9ff-0bf3a49f2504",
        value: String(data.vehicle.name || ""),
      },
      {
        fieldDefinitionId: "2dc4be13-c80b-4157-aadf-8cf67772148d",
        value: String(data.vehicle.license || ""),
      },
      {
        fieldDefinitionId: "d820ac80-2167-492b-8c68-c78ed9ae543e",
        value: String(data.vehicle.registrationNumber || ""),
      },
    ],
    sectionStatuses: [
      {
        sectionId: "67b3e91c-a96a-48d9-ac51-b5bd2a2a24eb", // Case Details Section ID
        isCompleted: caseDetails.isCompleted || false,
      },
    ],
  };

  return apiUpdateFormResponse(prf.prfFormId, payload);
};

export const useUpdatePrf = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: updateCaseDetails,
    onSuccess: (result, prf) => {
      if (result.isOk()) {
        toast.success("Case Details updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["prfForms"] });
        queryClient.invalidateQueries({ queryKey: ["prfById", prf.prfFormId] });
        router.push(`/edit-prf/${prf.prfFormId}`);
      } else {
        toast.error(`Failed to update Case Details: ${result.error.detail}`);
      }
    },
    onError: (error: ApiError) => {
      toast.error(`An unexpected error occurred: ${error.detail}`);
    },
  });
};
