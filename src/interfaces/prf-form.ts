import { z } from "zod";
import {
  PRFFormSchema,
  TransportationSchema,
  IncidentInformationSchema,
  PRFFormDataSchema,
  PrimarySurveySchema,
  SecondarySurveySchema,
  VitalSignsSchema,
  CaseDetailsSchema,
  PatientDetailsSchema,
} from "./prf-schema";

export type PRF_FORM = z.infer<typeof PRFFormSchema>;

export type PRF_FORM_DATA = z.infer<typeof PRFFormDataSchema>;

export type PRF_FORM_TRANSPORTATION = z.infer<typeof TransportationSchema>;
export type PRF_FORM_CASE_DETAILS = z.infer<typeof CaseDetailsSchema>;
export type PRF_FORM_PRIMARY_SURVEY = z.infer<typeof PrimarySurveySchema>;
export type PRF_FORM_SECONDARY_SURVEY = z.infer<typeof SecondarySurveySchema>;

// Create a mapping of the PRF_FORM_DATA keys to their respective Display Names
export const sectionDescriptions = [
  "Case Details",
  "Patient Details",
  "Transportation",
  "Incident Information",
  "Primary Survey",
  "Secondary Survey",
  "Vital Signs",
  "History Taking",
  "Physical Exam",
  "Interventions",
  "Medication Administration",
  "Patient Handover",
  "Notes",
] as const;
export const PRF_FORM_DATA_DISPLAY_NAMES: Record<
  keyof PRF_FORM_DATA,
  (typeof sectionDescriptions)[number]
> = {
  case_details: "Case Details",
  patient_details: "Patient Details",
  transportation: "Transportation",
  incident_information: "Incident Information",
  primary_survey: "Primary Survey",
  secondary_survey: "Secondary Survey",
  vital_signs: "Vital Signs",
  history_taking: "History Taking",
  physical_exam: "Physical Exam",
  interventions: "Interventions",
  medication_administration: "Medication Administration",
  patient_handover: "Patient Handover",
  notes: "Notes",
};
