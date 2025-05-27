import { SubSection, FieldDefinition } from "@/types/form-template";
import React from "react";
import FormFieldRenderer from "./FormFieldRenderer";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormSubSectionRendererProps {
  subSection: SubSection;
  allSubSectionsInSection: SubSection[];
  control: Control<any>;
  pathPrefix: string;
  className?: string;
}

const FormSubSectionRenderer: React.FC<FormSubSectionRendererProps> = ({
  subSection,
  allSubSectionsInSection,
  control,
  pathPrefix,
  className,
}) => {
  const { getValues } = useFormContext(); // Useful for default values with useFieldArray

  // Construct the name for useFieldArray if this subsection is repeatable
  // Ensure pathPrefix is just the name/ID of the subsection itself, not a long path yet for the array itself.
  const fieldArrayName = pathPrefix;

  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldArrayName,
    // keyName: "customId", // Optional: use a different key than 'id' for React keys
  });

  const childSubSections = allSubSectionsInSection.filter(
    (child) => child.parentSubSectionId === subSection.id,
  );

  const shouldRenderTitle = subSection.name !== "_RootFieldsHolder";

  if (subSection.isRepeatable) {
    return (
      <div className={`mb-6 rounded-md border bg-slate-50 p-4 shadow-sm`}>
        {shouldRenderTitle && subSection.name && (
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">
              {subSection.name} [Repeatable]
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                // Determine default values for a new item in the array
                // This might involve creating an empty structure based on fieldDefinitions
                // or childSubSections of this repeatable subSection.
                const defaultItem: Record<string, any> = {};
                subSection.fieldDefinitions.forEach(
                  (fd) => (defaultItem[fd.name] = ""),
                ); // Simplistic default
                // TODO: Handle default values for child subsections if they exist
                append(defaultItem);
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add{" "}
              {subSection.name || "Entry"}
            </Button>
          </div>
        )}
        {fields.map((fieldArrayItem, index) => (
          <div
            key={fieldArrayItem.id}
            className="mb-4 rounded-md border border-dashed border-gray-400 bg-white p-3"
          >
            <div className="mb-2 flex items-center justify-end">
              {fields.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Render fields of the current repeatable item */}
            {subSection.fieldDefinitions.map((fd) => (
              <FormFieldRenderer
                key={`${fieldArrayItem.id}-${fd.id}`}
                field={fd}
                control={control}
                fieldName={`${fieldArrayName}.${index}.${fd.name}`}
              />
            ))}

            {/* Render child subsections recursively for this repeatable item */}
            {childSubSections.map((child) => (
              <FormSubSectionRenderer
                key={`${fieldArrayItem.id}-${child.id}`}
                subSection={child}
                allSubSectionsInSection={allSubSectionsInSection} // Pass all for grand-child lookup
                control={control}
                pathPrefix={`${fieldArrayName}.${index}.${child.name || child.id}`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  } else {
    // Not repeatable: Render as a single group
    return (
      <div
        className={cn({
          "m-4 mb-6 grid grid-cols-2 gap-2 rounded-md": true,
          "border bg-gray-50 p-4": shouldRenderTitle,
          [className || ""]: !!className,
        })}
      >
        {shouldRenderTitle && subSection.name && (
          <h3 className="col-span-2 mb-3 text-lg font-semibold text-gray-700">
            {subSection.name}
          </h3>
        )}

        {/* Render fields of the current subsection */}
        {subSection.fieldDefinitions.map((fd) => (
          <FormFieldRenderer
            key={fd.id}
            field={fd}
            control={control}
            fieldName={`${pathPrefix}.${fd.name}`}
          />
        ))}

        {/* Render child subsections recursively */}
        {childSubSections.map((child) => (
          <FormSubSectionRenderer
            key={child.id}
            subSection={child}
            allSubSectionsInSection={allSubSectionsInSection}
            control={control}
            pathPrefix={`${pathPrefix}.${child.name || child.id}`}
            className={"col-span-2"}
          />
        ))}
      </div>
    );
  }
};

export default FormSubSectionRenderer;
