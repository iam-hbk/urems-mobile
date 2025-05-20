export interface FieldOption {
  id: string;
  value: string;
  label: string;
  isDefault: boolean;
}

export type FormFieldType =
  | "Text"
  | "TextArea"
  | "Number"
  | "Date"
  | "Boolean" // Typically a single checkbox for true/false
  | "Select" // Dropdown list
  | "RadioGroup"
  | "CheckboxGroup" // For multiple selections
  | "File"
  | "Image"
  | "Password"
  | "Email"
  | "Url"
  | "Phone"
  | "Time"
  | "DateTime";

export interface FieldDefinition {
  id: string;
  name: string;
  label: string;
  type: FormFieldType;
  isRequired: boolean;
  pattern?: string; // Regex pattern for validation
  errorMessage?: string; // Custom error message for pattern validation
  typeValidationErrorMessage?: string; // Custom error message for type validation
  fieldOptions?: FieldOption[]; // For fields like 'select', 'radio', 'checkbox'
}

export interface SubSection {
  id: string;
  name: string;
  parentSubSectionId?: string | null; // Optional, for nested subsections
  fieldDefinitions: FieldDefinition[];
}

export interface Section {
  id: string;
  name: string;
  isRequired: boolean;
  description?: string | null;
  subSections: SubSection[];
}

export interface FormTemplate {
  id: string;
  title: string;
  description: string;
  createdAt: string; // Or Date
  updatedAt: string; // Or Date
  sections: Section[];
}

export interface FormTemplateSummary {
  id: string;
  title: string;
  description: string;
  createdAt: string; // Or Date
  updatedAt: string; // Or Date
}

export interface FieldResponse {
  id: string;
  formResponseId: string;
  fieldDefinitionId: string;
  // The type of 'value' directly corresponds to the 'type' property of the associated FieldDefinition (see FormFieldType).
  // For example, if FieldDefinition.type is "Number", value should be a number (or string parsable to a number).
  // If FieldDefinition.type is "Boolean", value should be a boolean.
  // If FieldDefinition.type is "CheckboxGroup", value might be string[] or an array of selected option values.
  value: string;
  entrySequenceNumber?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SectionStatus {
  id: string;
  formResponseId: string;
  sectionId: string;
  isCompleted: boolean;
  createdAt: string; // Or Date
  updatedAt: string; // Or Date
}

// For the items in GET /api/FormResponses and within FormTemplateWithResponses.formResponses
export interface FormResponseSummary {
  id: string;
  patientId?: number | null;
  vehicleId?: number | null;
  crewId?: number | null;
  employeeId: number; // Assuming this is always present for user filtering
  formTemplateId: string;
  isCompleted: boolean;
  createdAt: string; // Or Date
  updatedAt: string; // Or Date
}

// For GET /api/FormResponses/{id}
export interface DetailedFormResponse extends FormResponseSummary {
  formTemplate: FormTemplateSummary; // The summary of the template
  fieldResponses: FieldResponse[];
  sectionStatuses: SectionStatus[];
}

// For GET /api/formtemplates/{id}/with-responses
// This extends the existing FormTemplate to include its responses
export interface FormTemplateWithResponses extends FormTemplate {
  formResponses: FormResponseSummary[];
}

export interface CreateFormResponsePayload {
  formTemplateId: string;
  employeeId: number;
  patientId?: number | null;
  vehicleId?: number | null;
  crewId?: number | null;
  // Any other fields required by POST /api/FormResponses, defaulting to 0 or null if optional
} 