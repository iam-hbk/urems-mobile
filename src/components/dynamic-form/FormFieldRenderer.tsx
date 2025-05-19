import { FieldDefinition } from "@/types/form-template";
import React from "react";

interface FormFieldRendererProps {
  field: FieldDefinition;
  // We'll likely need a way to handle input changes and form state later
  // onChange: (fieldName: string, value: any) => void;
  // value: any;
}

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({ field }) => {
  const { label, type, name, isRequired, pattern, errorMessage, fieldOptions } =
    field;

  // Basic rendering for now, will be expanded
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {isRequired && <span className="text-red-500">*</span>}
      </label>
      <p className="text-xs text-gray-500">Field Type: {type}</p>
      {/* 
        Here we will add a switch or conditional rendering based on `type` 
        to render the correct input element.
        e.g.,
        switch (type) {
          case "Text":
            return <input type="text" name={name} required={isRequired} pattern={pattern} />;
          case "Select":
            return (
              <select name={name} required={isRequired}>
                {fieldOptions?.map(opt => <option key={opt.id} value={opt.value}>{opt.label}</option>)}
              </select>
            );
          // ... other cases
        }
      */}
      {/* Placeholder for actual input */}
      <div className="mt-1 p-2 border border-dashed border-gray-300 rounded-md">
        [Input for {name} of type {type} will go here]
      </div>
      {errorMessage && pattern && (
        <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default FormFieldRenderer; 