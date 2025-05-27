import { Section } from "@/types/form-template";
import React from "react";
import FormSubSectionRenderer from "./FormSubSectionRenderer";
import { Control } from "react-hook-form";

interface FormSectionRendererProps {
  section: Section;
  control: Control<any>;
}

const FormSectionRenderer: React.FC<FormSectionRendererProps> = ({ section, control }) => {
  // Get top-level subsections (direct children of the section or _RootFieldsHolder)
  const topLevelSubSections = section.subSections.filter(
    (sub) => sub.parentSubSectionId === null
  );

  return (
    <div className="mb-8 p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
        {section.name}
        {section.isRequired && <span className="text-red-500 ml-2">* (Section)</span>}
      </h2>
      {topLevelSubSections.map((subSection) => (
        <FormSubSectionRenderer 
          key={subSection.id} 
          subSection={subSection} 
          allSubSectionsInSection={section.subSections} // Pass all for child lookup
          control={control} 
          pathPrefix={subSection.name || subSection.id} // Initial pathPrefix based on subsection name/ID
        />
      ))}
    </div>
  );
};

export default FormSectionRenderer; 