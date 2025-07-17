import { z } from "zod";
import { CaseDetailsSchema } from "@/interfaces/prf-schema";
import {
  DetailedFormResponse,
  FormResponseUpdateDto,
  FieldResponseUpdateDto,
  SectionStatusUpdateDto,
} from "@/types/form-template";
import { PRF_FORM } from "@/interfaces/prf-form";

/**
 * Finds the value of a specific field from a form response.
 * @param fieldResponses The array of field responses.
 * @param fieldDefinitionId The ID of the field definition to find.
 * @returns The value of the field, or undefined if not found.
 */
const findFieldValue = (
  fieldResponses: DetailedFormResponse["fieldResponses"],
  fieldDefinitionId: string,
): string | undefined => {
  const field = fieldResponses.find(
    (r) => r.fieldDefinitionId === fieldDefinitionId,
  );
  return field?.value;
};

/**
 * Translates the 'case_details' section from a dynamic form response
 * into the legacy PRF CaseDetails schema format.
 * @param response The detailed form response from the new system.
 * @returns A Zod-inferred object matching the CaseDetailsSchema.
 */
export const translateCaseDetailsFromResponse = (
  response: DetailedFormResponse,
): z.infer<typeof CaseDetailsSchema> => {
  const data = {
    regionDistrict:
      findFieldValue(
        response.fieldResponses,
        "fb769988-ea1e-4d4d-b995-6417abb89734", // regionDistrict
      ) || "",
    base:
      findFieldValue(
        response.fieldResponses,
        "538f44c5-4140-4795-99e3-9d8e8255892f", // base
      ) || "",
    province:
      findFieldValue(
        response.fieldResponses,
        "7285441d-d1f0-4d33-91cf-2bb6f123cd1f", // province
      ) || "",
    dateOfCase: new Date(
      findFieldValue(
        response.fieldResponses,
        "735326bb-eccd-4d58-8fa0-2bbff51db99e", // dateOfCase
      ) || new Date(),
    ),
    vehicle: {
      id: parseInt(
        findFieldValue(
          response.fieldResponses,
          "0902aca4-ce3f-422b-a5f0-9c57c7dbdb26", // vehicle.id
        ) || "0",
        10,
      ),
      name:
        findFieldValue(
          response.fieldResponses,
          "85f06b71-61a3-4fa5-a9ff-0bf3a49f2504", // vehicle.name
        ) || "",
      license:
        findFieldValue(
          response.fieldResponses,
          "2dc4be13-c80b-4157-aadf-8cf67772148d", // vehicle.license
        ) || "",
      registrationNumber:
        findFieldValue(
          response.fieldResponses,
          "d820ac80-2167-492b-8c68-c78ed9ae543e", // vehicle.registrationNumber
        ) || "",
    },
  };

  return data;
};

/**
 * Translates a legacy PRF object into a DTO suitable for updating
 * a dynamic form response. This implementation currently only handles
 * the 'case_details' section.
 *
 * @param prf The legacy PRF_FORM object.
 * @returns A FormResponseUpdateDto payload for the API.
 */
export const translateLegacyPrfToUpdateDto = (
  prf: PRF_FORM,
): FormResponseUpdateDto => {
  const caseDetails = prf.prfData.case_details;
  const fieldResponses: FieldResponseUpdateDto[] = [];

  if (caseDetails?.data) {
    const { data } = caseDetails;
    // Map direct fields
    fieldResponses.push({
      fieldDefinitionId: "fb769988-ea1e-4d4d-b995-6417abb89734", // regionDistrict
      value: String(data.regionDistrict || ""),
    });
    fieldResponses.push({
      fieldDefinitionId: "538f44c5-4140-4795-99e3-9d8e8255892f", // base
      value: String(data.base || ""),
    });
    fieldResponses.push({
      fieldDefinitionId: "7285441d-d1f0-4d33-91cf-2bb6f123cd1f", // province
      value: String(data.province || ""),
    });
    fieldResponses.push({
      fieldDefinitionId: "735326bb-eccd-4d58-8fa0-2bbff51db99e", // dateOfCase
      value: data.dateOfCase ? new Date(data.dateOfCase).toISOString() : "",
    });

    // Map fields from the vehicle subsection
    if (data.vehicle) {
      fieldResponses.push({
        fieldDefinitionId: "0902aca4-ce3f-422b-a5f0-9c57c7dbdb26", // vehicle.id
        value: String(data.vehicle.id || "0"),
      });
      fieldResponses.push({
        fieldDefinitionId: "85f06b71-61a3-4fa5-a9ff-0bf3a49f2504", // vehicle.name
        value: String(data.vehicle.name || ""),
      });
      fieldResponses.push({
        fieldDefinitionId: "2dc4be13-c80b-4157-aadf-8cf67772148d", // vehicle.license
        value: String(data.vehicle.license || ""),
      });
      fieldResponses.push({
        fieldDefinitionId: "d820ac80-2167-492b-8c68-c78ed9ae543e", // vehicle.registrationNumber
        value: String(data.vehicle.registrationNumber || ""),
      });
    }
  }

  const sectionStatuses: SectionStatusUpdateDto[] = [
    {
      sectionId: "67b3e91c-a96a-48d9-ac51-b5bd2a2a24eb", // Case Details Section ID
      isCompleted: caseDetails?.isCompleted || false,
    },
  ];

  return {
    fieldResponses,
    sectionStatuses,
  };
};

/**
 * Translates a new DetailedFormResponse into the legacy PRF_FORM structure.
 * This is the bridge from the new system to the old UI.
 * NOTE: This currently only populates the 'case_details' section.
 * Other sections will need to be translated as the migration progresses.
 *
 * @param response The DetailedFormResponse from the dynamic forms API.
 * @returns A PRF_FORM object.
 */
export const translateResponseToPrf = (
  response: DetailedFormResponse,
): PRF_FORM => {
  const translatedCaseDetailsData = translateCaseDetailsFromResponse(response);
  const caseDetailsStatus = response.sectionStatuses.find(
    (s) => s.sectionId === "67b3e91c-a96a-48d9-ac51-b5bd2a2a24eb", // Case Details Section ID
  );

  const prf: PRF_FORM = {
    prfFormId: response.id,
    EmployeeID: response.employeeId,
    CrewID: String(response.crewId || ""),
    prfData: {
      case_details: {
        data: translatedCaseDetailsData,
        isCompleted: caseDetailsStatus?.isCompleted || false,
        isOptional: false,
      },
    },
  };

  return prf;
};
