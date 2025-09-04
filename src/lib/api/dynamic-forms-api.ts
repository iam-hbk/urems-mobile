import api from "@/lib/wretch";
import type { ApiError } from "@/types/api";
import {
  FormTemplate,
  FormTemplateSummary,
  FormTemplateWithResponses,
  DetailedFormResponse,
  CreateFormResponsePayload,
  FormResponseUpdateDto,
  CreatePRFResponsePayload,
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
 * Fetches a The PRF template, including its associated form responses.
 */
export const fetchPRFTemplateWithResponses = async (): Promise<
  Result<FormTemplateWithResponses, ApiError>
> => {
  return api.get<FormTemplateWithResponses>(
    `/formtemplates/get-prf-with-responses`,
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
    patientId: payload.patientId,
    vehicleId: payload.vehicleId,
    crewId: payload.crewId,
    employeeId: payload.employeeId,
    formTemplateId: payload.formTemplateId,
  };

  return api.post<DetailedFormResponse>("/FormResponses", requestBody);
};

/**
 * Creates a new PRF response.
 * @param payload The data needed to create the form response.
 */
export const createPRFResponse = async (
  payload: CreatePRFResponsePayload,
): Promise<Result<DetailedFormResponse, ApiError>> => {
  const requestBody = {
    patientId: payload.patientId,
    vehicleId: payload.vehicleId,
    crewId: payload.crewId,
    employeeId: payload.employeeId,
    formTemplateId: payload.formTemplateId,
    caseDetails: payload.caseDetails,
  };

  return api.post<DetailedFormResponse>("/FormResponses", requestBody);
};

export const getPRFTemplate = async (): Promise<
  Result<FormTemplate, ApiError>
> => {
  return api.get<FormTemplate>("/formtemplates/get-prf");
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
  return api.put<{ status: number }>(`/FormResponses/${responseId}`, payload);
};
