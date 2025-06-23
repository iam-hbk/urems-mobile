import api from "@/lib/wretch";
import type { ApiError } from "@/types/api";
import { ok, err, type Result } from "neverthrow";
import {
  FormTemplate,
  FormTemplateSummary,
  FormTemplateWithResponses,
  DetailedFormResponse,
  CreateFormResponsePayload,
  FormResponseUpdateDto,
} from "@/types/form-template";

/**
 * Fetches a list of all form template summaries.
 */
export const fetchFormTemplates = async (): Promise<
  Result<FormTemplateSummary[], ApiError>
> => {
  const result = await api.get<FormTemplateSummary[]>("/FormTemplates");
  console.log(result);
  if (result.isErr()) {
    console.error("Failed to fetch form templates:", result.error);
    return err(result.error);
  }

  return ok(result.value || []);
};

/**
 * Fetches a single form template by its ID.
 * @param formId The ID of the form template to fetch.
 */
export const fetchFormTemplateById = async (
  formId: string,
): Promise<Result<FormTemplate | null, ApiError>> => {
  if (!formId) {
    // this should never happen
    console.warn("fetchFormTemplateById called without formId");
    return ok(null);
  }

  const result = await api.get<FormTemplate>(`/FormTemplates/${formId}`);

  if (result.isErr()) {
    console.error(
      `Failed to fetch form template with ID ${formId}:`,
      result.error,
    );
    return err(result.error);
  }

  return ok(result.value);
};

/**
 * Fetches a single form template by its ID, including its associated form responses.
 * @param templateId The ID of the form template to fetch.
 */
export const fetchFormTemplateWithResponses = async (
  templateId: string,
): Promise<Result<FormTemplateWithResponses | null, ApiError>> => {
  if (!templateId) {
    // this should never happen
    console.warn("fetchFormTemplateWithResponses called without templateId");
    return ok(null);
  }

  const result = await api.get<FormTemplateWithResponses>(
    `/formtemplates/${templateId}/with-responses`,
  );

  if (result.isErr()) {
    console.error(
      `Failed to fetch form template ${templateId} with responses:`,
      result.error,
    );
    return err(result.error);
  }

  return ok(result.value);
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

  const result = await api.post<DetailedFormResponse>(
    "/FormResponses",
    requestBody,
  );

  if (result.isErr()) {
    console.error("Failed to create form response:", result.error);
    return err(result.error);
  }

  return ok(result.value);
};

/**
 * Fetches a single form response by its ID.
 * @param responseId The ID of the form response to fetch.
 */
export const fetchFormResponseById = async (
  responseId: string,
): Promise<Result<DetailedFormResponse | null, ApiError>> => {
  if (!responseId) {
    // this should never happen
    console.warn("fetchFormResponseById called without responseId");
    return ok(null);
  }

  const result = await api.get<DetailedFormResponse>(
    `/FormResponses/${responseId}`,
  );

  if (result.isErr()) {
    console.error(
      `Failed to fetch form response with ID ${responseId}:`,
      result.error,
    );
    return err(result.error);
  }

  return ok(result.value);
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
  const result = await api.put<{ status: number }>(
    `/api/FormResponses/${responseId}`,
    payload,
  );

  if (result.isErr()) {
    console.error(
      `Failed to update form response with ID ${responseId}:`,
      result.error,
    );
    return err(result.error);
  }

  return ok({ status: 200 });
};
