import api from "@/lib/wretch";
import {
  FormTemplate,
  FormTemplateSummary,
  FormTemplateWithResponses,
  DetailedFormResponse,
  CreateFormResponsePayload,
} from "@/types/form-template";

/**
 * Fetches a list of all form template summaries.
 */
export const fetchFormTemplates = async (): Promise<FormTemplateSummary[]> => {
  try {
    const templates = (await api.get(
      "/FormTemplates",
    )) as FormTemplateSummary[];
    return templates || [];
  } catch (error) {
    console.error("Failed to fetch form templates:", error);
    // Re-throw to allow react-query to handle the error state
    throw error;
  }
};

/**
 * Fetches a single form template by its ID.
 * @param formId The ID of the form template to fetch.
 */
export const fetchFormTemplateById = async (
  formId: string,
): Promise<FormTemplate | null> => {
  if (!formId) {
    // Or throw an error, depending on how react-query `enabled` flag is used elsewhere
    console.warn("fetchFormTemplateById called without formId");
    return null;
  }
  try {
    const template = (await api.get(
      `/FormTemplates/${formId}`,
    )) as FormTemplate;
    return template;
  } catch (error) {
    console.error(`Failed to fetch form template with ID ${formId}:`, error);
    // Re-throw to allow react-query to handle the error state
    throw error;
  }
};

/**
 * Fetches a single form template by its ID, including its associated form responses.
 * @param templateId The ID of the form template to fetch.
 */
export const fetchFormTemplateWithResponses = async (
  templateId: string,
): Promise<FormTemplateWithResponses | null> => {
  if (!templateId) {
    console.warn("fetchFormTemplateWithResponses called without templateId");
    return null;
  }
  try {
    const templateWithResponses = (await api.get(
      `/formtemplates/${templateId}/with-responses`,
    )) as FormTemplateWithResponses;
    return templateWithResponses;
  } catch (error) {
    console.error(
      `Failed to fetch form template ${templateId} with responses:`,
      error,
    );
    throw error;
  }
};

/**
 * Creates a new form response.
 * @param payload The data needed to create the form response.
 */
export const createFormResponse = async (payload: CreateFormResponsePayload): Promise<DetailedFormResponse> => {
  try {
    // Ensure default values for optional IDs if not provided, as per example (0)
    const requestBody = {
      patientId: payload.patientId || 0,
      vehicleId: payload.vehicleId || 0,
      crewId: payload.crewId || 0,
      employeeId: payload.employeeId,
      formTemplateId: payload.formTemplateId,
    };
    const newResponse = (await api.post(requestBody, "/FormResponses")) as DetailedFormResponse;
    return newResponse;
  } catch (error) {
    console.error("Failed to create form response:", error);
    // Re-throw to allow react-query mutation to handle the error state
    throw error;
  }
};
