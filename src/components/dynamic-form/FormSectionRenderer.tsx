import { Section } from "@/types/form-template";
import React from "react";
import FormSubSectionRenderer from "./FormSubSectionRenderer";

interface FormSectionRendererProps {
  section: Section;
}

const FormSectionRenderer: React.FC<FormSectionRendererProps> = ({ section }) => {
  return (
    <div className="mb-8 p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
        {section.name}
        {section.isRequired && <span className="text-red-500 ml-2">* (Section)</span>}
      </h2>
      {section.subSections.map((subSection) => (
        <FormSubSectionRenderer key={subSection.id} subSection={subSection} />
      ))}
    </div>
  );
};

export default FormSectionRenderer; 