import { useMutation, useQueryClient } from "@tanstack/react-query";
import api, { API_BASE_URL } from "@/lib/wretch";
import { useStore } from "@/lib/store";
import { PRF_FORM } from "@/interfaces/prf-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ApiError } from "@/types/api";
import { createFormResponse } from "@/lib/api/dynamic-forms-api";
import { CreateFormResponsePayload } from "@/types/form-template";

// This is the static ID for the legacy PRF form template.
export const PRF_FORM_TEMPLATE_ID = "ad4c3228-9624-471a-9151-5dcee3bb4e2f";

export const useCreatePrf = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (prf: PRF_FORM) => {
      // Map the legacy PRF_FORM to the new CreateFormResponsePayload
      const payload: CreateFormResponsePayload = {
        formTemplateId: PRF_FORM_TEMPLATE_ID,
        employeeId: prf.EmployeeID, // This is a string
        patientId: 0, // New PRFs start without a patient
        vehicleId: prf.prfData?.case_details?.data.vehicle?.id || 0,
        crewId: prf.CrewID ? parseInt(prf.CrewID, 10) : 0,
      };
      return createFormResponse(payload);
    },
    onSuccess: (result) => {
      result.match(
        (newResponse) => {
          toast.success("New PRF created successfully!");
          // Invalidate queries to refresh the list of forms
          queryClient.invalidateQueries({ queryKey: ["prfForms"] });
          queryClient.invalidateQueries({ queryKey: ["formTemplateWithResponses", PRF_FORM_TEMPLATE_ID] });
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
};
