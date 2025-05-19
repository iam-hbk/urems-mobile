import { SubSection } from "@/types/form-template";
import React from "react";
import FormFieldRenderer from "./FormFieldRenderer";

interface FormSubSectionRendererProps {
  subSection: SubSection;
}

const FormSubSectionRenderer: React.FC<FormSubSectionRendererProps> = ({
  subSection,
}) => {
  return (
    <div className="p-4 border border-gray-200 rounded-md mb-6 bg-gray-50">
      {subSection.name && (
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          {subSection.name}
        </h3>
      )}
      {subSection.fieldDefinitions.map((field) => (
        <FormFieldRenderer key={field.id} field={field} />
      ))}
    </div>
  );
};

export default FormSubSectionRenderer; 