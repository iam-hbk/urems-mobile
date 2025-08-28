import {
  PRF_FORM_CASE_DETAILS,
  PRF_FORM_RESPONSE_METADATA,
  PRFormResponseStatus,
  SectionName,
  PRF_FORM_PRIMARY_SURVEY,
  PRF_FORM_SECONDARY_SURVEY,
  PRF_FORM_TRANSPORTATION,
} from "@/interfaces/prf-form";
import {
  PatientDetailsSchema,
  IncidentInformationSchema,
  IntravenousTherapySchema,
  MedicationAdministeredType,
  DiagnosisType,
  MechanismOfInjuryType,
  ProceduresType,
  RespiratoryDistressType,
  InjuryType,
  AssessmentsType,
  PatientHandoverType,
  NotesType,
  PastMedicalHistoryType,
  InventoryType,
} from "@/interfaces/prf-schema";
import { VitalSignsSchema } from "@/interfaces/prf-vital-signs-schema";
import api, { ApiResult } from "../wretch";
import { z } from "zod";

// Generic wrapper type for all sections
export type SectionWrapper<T> = {
  data: T;
  isCompleted: boolean;
  isOptional?: boolean | null;
};

// Create type mapping for each section
export type SectionDataTypeMap = {
  case_details: SectionWrapper<PRF_FORM_CASE_DETAILS>;
  patient_details: SectionWrapper<z.infer<typeof PatientDetailsSchema>>;
  transportation: SectionWrapper<PRF_FORM_TRANSPORTATION>;
  incident_information: SectionWrapper<
    z.infer<typeof IncidentInformationSchema>
  >;
  primary_survey: SectionWrapper<PRF_FORM_PRIMARY_SURVEY>;
  secondary_survey: SectionWrapper<PRF_FORM_SECONDARY_SURVEY>;
  vital_signs: SectionWrapper<z.infer<typeof VitalSignsSchema>>;
  medication_administration: SectionWrapper<MedicationAdministeredType>;
  patient_handover: SectionWrapper<PatientHandoverType>;
  notes: SectionWrapper<NotesType>;
  intravenous_therapy: SectionWrapper<z.infer<typeof IntravenousTherapySchema>>;
  diagnosis: SectionWrapper<DiagnosisType>;
  mechanism_of_injury: SectionWrapper<MechanismOfInjuryType>;
  procedures: SectionWrapper<ProceduresType>;
  respiratory_distress: SectionWrapper<RespiratoryDistressType>;
  injuries: SectionWrapper<InjuryType>;
  assessments: SectionWrapper<AssessmentsType>;
  past_medical_history: SectionWrapper<PastMedicalHistoryType>;
  inventory: SectionWrapper<InventoryType>;
};

// Helper type to extract just the data type from a section wrapper
export type SectionData<T extends SectionName> = SectionDataTypeMap[T]["data"];

// Utility types for working with section wrappers
export type SectionStatus = Pick<
  SectionWrapper<any>,
  "isCompleted" | "isOptional"
>;

// Type for creating new section data (without the wrapper)
export type CreateSectionData<T extends SectionName> = SectionData<T>;

// Type for updating section data (with partial wrapper fields)
export type UpdateSectionData<T extends SectionName> = {
  data: Partial<SectionData<T>>;
  isCompleted?: boolean;
  isOptional?: boolean;
};

// Type-safe function using function overloads
export function getPrfResponseSectionByName<T extends SectionName>(
  prfResponseId: string,
  sectionName: T,
): ApiResult<SectionDataTypeMap[T]>;

export function getPrfResponseSectionByName<T extends SectionName>(
  prfResponseId: string,
  sectionName: T,
): ApiResult<SectionDataTypeMap[T]> {
  return api.get<SectionDataTypeMap[T]>(
    `/FormResponses/${prfResponseId}/prf/sections/${sectionName}`,
  );
}

export const getPrfResponseMetadata = (
  prfResponseId: string,
): ApiResult<PRF_FORM_RESPONSE_METADATA> => {
  return api.get<PRF_FORM_RESPONSE_METADATA>(
    `/FormResponses/${prfResponseId}/prf-meta`,
  );
};

export const getPrfResponseStatus = (
  prfResponseId: string,
): ApiResult<PRFormResponseStatus> => {
  return api.get<PRFormResponseStatus>(
    `/FormResponses/${prfResponseId}/prf/section-statuses`,
  );
};

// Type-safe update function using function overloads
export function updatePrfResponse<T extends SectionName>(
  prfResponseId: string,
  sectionName: T,
  data: SectionDataTypeMap[T],
): ApiResult<SectionDataTypeMap[T]>;

export function updatePrfResponse<T extends SectionName>(
  prfResponseId: string,
  sectionName: T,
  data: SectionDataTypeMap[T],
): ApiResult<SectionDataTypeMap[T]> {
  return api.post<SectionDataTypeMap[T]>(
    `/FormResponses/${prfResponseId}/prf-sections/${sectionName}`,
    data,
  );
}
