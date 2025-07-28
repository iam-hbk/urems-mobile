import api from "@/lib/wretch";
import type { ApiError } from "@/types/api";
import {
  FormTemplate,
  FormTemplateSummary,
  FormTemplateWithResponses,
  DetailedFormResponse,
  CreateFormResponsePayload,
  FormResponseUpdateDto,
} from "@/types/form-template";
import { Result } from "neverthrow";

/**
 * Fetches a list of all form template summaries.
 */
export const fetchFormTemplates = async (): Promise<
  Result<FormTemplateSummary[], ApiError>
> => {
  return api.get<FormTemplateSummary[]>("/FormTemplates");
};

/**
 * Fetches a single form template by its ID.
 * @param formId The ID of the form template to fetch.
 */
export const fetchFormTemplateById = async (
  formId: string,
): Promise<Result<FormTemplate, ApiError>> => {
  return api.get<FormTemplate>(`/FormTemplates/${formId}`);
};

/**
 * Fetches a single form template by its ID, including its associated form responses.
 * @param templateId The ID of the form template to fetch.
 */
export const fetchFormTemplateWithResponses = async (
  templateId: string,
): Promise<Result<FormTemplateWithResponses, ApiError>> => {
  return api.get<FormTemplateWithResponses>(
    `/formtemplates/${templateId}/with-responses`,
  );
};

/**
 * Creates a new form response.
 * @param payload The data needed to create the form response.
 */
export const createFormResponse = async (
  payload: CreateFormResponsePayload,
): Promise<Result<DetailedFormResponse, ApiError>> => {
  const requestBody = {
    patientId: payload.patientId || 0,
    vehicleId: payload.vehicleId || 0,
    crewId: payload.crewId || 0,
    employeeId: payload.employeeId,
    formTemplateId: payload.formTemplateId,
  };

  return api.post<DetailedFormResponse>("/FormResponses", requestBody);
};

/**
 * Fetches a single form response by its ID.
 * @param responseId The ID of the form response to fetch.
 */
export const fetchFormResponseById = async (
  responseId: string,
): Promise<Result<DetailedFormResponse, ApiError>> => {
  const result = await api.get<DetailedFormResponse>(
    `/FormResponses/${responseId}`,
  );
  return result;
};

/**
 * Updates a form response.
 * @param responseId The ID of the form response to update.
 * @param payload The data needed to update the form response.
 */
export const apiUpdateFormResponse = async (
  responseId: string,
  payload: FormResponseUpdateDto,
): Promise<Result<{ status: number }, ApiError>> => {
  return api.put<{ status: number }>(
    `/FormResponses/${responseId}`,
    payload,
  );
};
