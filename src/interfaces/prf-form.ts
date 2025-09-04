import { z } from "zod";
import {
  PRFFormSchema,
  TransportationSchema,
  PRFFormDataSchema,
  SecondarySurveySchema,
  CaseDetailsSchema,
} from "./prf-schema";
import { PrimarySurveySchema } from "./prf-primary-survey-schema";

export type PRF_FORM = z.infer<typeof PRFFormSchema>;

export type PRF_FORM_DATA = z.infer<typeof PRFFormDataSchema>;

export type PRF_FORM_TRANSPORTATION = z.infer<typeof TransportationSchema>;
export type PRF_FORM_CASE_DETAILS = z.infer<typeof CaseDetailsSchema>;
export type PRF_FORM_PRIMARY_SURVEY = z.infer<typeof PrimarySurveySchema>;
export type PRF_FORM_SECONDARY_SURVEY = z.infer<typeof SecondarySurveySchema>;
export type PRF_FORM_RESPONSE_METADATA = Omit<PRF_FORM, "prfData">;
// Create a mapping of the PRF_FORM_DATA keys to their respective Display Names
export const sectionDescriptions = [
  "Case Details",
  "Patient Details",
  "Transportation",
  "Incident Information",
  "Primary Survey",
  "Secondary Survey",
  "Vital Signs",
  // "History Taking",
  // "Physical Exam",
  // "Interventions",
  "Medication Administration",
  "Patient Handover",
  "Notes",
  "Intravenous Therapy",
  "Diagnosis",
  "Mechanism of Injury",
  "Procedures",
  "Respiratory Distress Assessment",
  "Injuries",
  "Assessments",
  "Past Medical History",
  "Inventory",
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
  // history_taking: "History Taking",
  // physical_exam: "Physical Exam",
  // interventions: "Interventions",
  medication_administration: "Medication Administration",
  patient_handover: "Patient Handover",
  notes: "Notes",
  intravenous_therapy: "Intravenous Therapy",
  diagnosis: "Diagnosis",
  mechanism_of_injury: "Mechanism of Injury",
  procedures: "Procedures",
  respiratory_distress: "Respiratory Distress Assessment",
  injuries: "Injuries",
  assessments: "Assessments",
  past_medical_history: "Past Medical History",
  inventory: "Inventory",
};

// ------------------------------------------------------------
// ------------------------------------------------------------
// Form Response Status
// ------------------------------------------------------------

// Define the allowed section names as constants
export const SectionNames = {
  patient_details: "patient_details",
  diagnosis: "diagnosis",
  primary_survey: "primary_survey",
  patient_handover: "patient_handover",
  past_medical_history: "past_medical_history",
  case_details: "case_details",
  injuries: "injuries",
  notes: "notes",
  respiratory_distress: "respiratory_distress",
  intravenous_therapy: "intravenous_therapy",
  transportation: "transportation",
  assessments: "assessments",
  procedures: "procedures",
  mechanism_of_injury: "mechanism_of_injury",
  inventory: "inventory",
  incident_information: "incident_information",
  secondary_survey: "secondary_survey",
  medication_administration: "medication_administration",
  vital_signs: "vital_signs",
} as const;

// Union type of all possible section names
export type SectionName = (typeof SectionNames)[keyof typeof SectionNames];

// Section type
export interface FormResponseSectionStatus {
  sectionId: string;
  sectionName: SectionName;
  isCompleted: boolean;
  updatedAt: string; // could be Date if you parse it
  isRequired: boolean;
}

// Main form response type
export interface PRFormResponseStatus {
  formResponseId: string;
  sections: FormResponseSectionStatus[];
  totalSections: number;
  completedSections: number;
}
