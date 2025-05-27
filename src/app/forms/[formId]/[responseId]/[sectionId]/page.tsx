"use client";

import React, { use, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import {
  DetailedFormResponse,
  FormTemplate,
  Section,
  FieldResponse,
  FormResponseUpdateDto,
  FieldResponseUpdateDto,
  SectionStatusUpdateDto,
  SubSection as GlobalSubSection,
  FieldDefinition as GlobalFieldDefinition,
} from "@/types/form-template";
import FormSectionRenderer from "@/components/dynamic-form/FormSectionRenderer";
import Link from "next/link";
import {
  fetchFormResponseById,
  fetchFormTemplateById,
  apiUpdateFormResponse,
} from "@/app/forms/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// Helper to parse value with try-catch for JSON
const parseFieldValue = (value: string) => {
  if (value === "true") return true;
  if (value === "false") return false;
  try {
    return JSON.parse(value);
  } catch (e) {
    return value; // Return as string if not JSON parsable
  }
};

const getSectionDefaultValues = (
  formResponse: DetailedFormResponse | null,
  section: Section | undefined,
  // pathPrefix: string = "" // Initial path for top-level fields/subsections within the section
): { [key: string]: any } => {
  if (!formResponse || !section || !formResponse.fieldResponses) return {};
  const defaults: { [key: string]: any } = {};

  const processSubSection = (subSection: GlobalSubSection, currentPathPrefix: string) => {
    if (subSection.isRepeatable) {
      const fieldArrayName = `${currentPathPrefix}${subSection.name || subSection.id}`;
      const repetitions: { [key: number]: { [key: string]: any } } = {};

      // Find all field definitions within this repeatable subsection (and its children, if any - simplified for now)
      const fieldDefsInRepeatableSubSection = subSection.fieldDefinitions;
      // TODO: Extend to include fieldDefs from child subsections of this repeatable one if they should be part of the same array item.

      fieldDefsInRepeatableSubSection.forEach((fieldDef) => {
        formResponse.fieldResponses
          .filter((r) => r.fieldDefinitionId === fieldDef.id && r.entrySequenceNumber)
          .forEach((matchedResponse) => {
            const seqNum = matchedResponse.entrySequenceNumber!;
            if (!repetitions[seqNum]) {
              repetitions[seqNum] = {};
            }
            repetitions[seqNum][fieldDef.name] = parseFieldValue(matchedResponse.value);
          });
      });
      
      // Convert repetitions map to an array sorted by sequence number
      defaults[fieldArrayName] = Object.entries(repetitions)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([, value]) => value);

      // Recursively process child subsections of this repeatable one, 
      // but they will be part of the parent's field array structure, so their field names will be indexed.
      // This part is tricky because their default values are part of the array items above.
      // For now, we assume fields directly under `isRepeatable` are the primary target.
      // Deeper nesting within a useFieldArray item needs careful path management in FormSubSectionRenderer.

    } else {
      // Not repeatable: fields are prefixed by the subsection path
      subSection.fieldDefinitions.forEach((fieldDef) => {
        const fieldName = `${currentPathPrefix}${subSection.name || subSection.id}.${fieldDef.name}`;
        const matchedResponse = formResponse.fieldResponses.find(
          (r: FieldResponse) => r.fieldDefinitionId === fieldDef.id && 
                                (r.entrySequenceNumber === 1 || !r.entrySequenceNumber) // For non-repeatable, take first entry
        );
        if (matchedResponse) {
          defaults[fieldName] = parseFieldValue(matchedResponse.value);
        }
      });
    }

    // Process child subsections (non-_RootFieldsHolder)
    // Their pathPrefix will extend the current one.
    section.subSections
      .filter(child => child.parentSubSectionId === subSection.id && child.name !== "_RootFieldsHolder")
      .forEach(childSub => processSubSection(childSub, `${currentPathPrefix}${subSection.name || subSection.id}.`));
  };

  // Process top-level subsections (parentSubSectionId is null)
  section.subSections
    .filter((sub) => sub.parentSubSectionId === null)
    .forEach((topSub) => {
      // For _RootFieldsHolder, its fields are effectively at the section's root (empty prefix for them)
      const prefix = topSub.name === "_RootFieldsHolder" ? "" : `${topSub.name || topSub.id}.`;
      if (topSub.name === "_RootFieldsHolder") {
         // Fields directly under _RootFieldsHolder (non-repeatable by convention assumed here)
         topSub.fieldDefinitions.forEach((fieldDef) => {
            const matchedResponse = formResponse.fieldResponses.find(
              (r: FieldResponse) => r.fieldDefinitionId === fieldDef.id && 
                                    (r.entrySequenceNumber === 1 || !r.entrySequenceNumber)
            );
            if (matchedResponse) {
              defaults[fieldDef.name] = parseFieldValue(matchedResponse.value);
            } // No prefix for root fields
          });
          // Now process children of _RootFieldsHolder which are actual top-level displayable subsections
          section.subSections
            .filter(child => child.parentSubSectionId === topSub.id)
            .forEach(actualTopSub => processSubSection(actualTopSub, "")); // Start with empty prefix for actual top-level displayable subsections
      } else {
        processSubSection(topSub, ""); // Start with empty prefix for actual top-level displayable subsections
      }
    });

  return defaults;
};

type Params = Promise<{
  formId: string;
  responseId: string;
  sectionId: string;
}>;

export default function DynamicFormSectionPage(props: { params: Params }) {
  const { formId, responseId, sectionId } = use(props.params);
  const queryClient = useQueryClient();

  const {
    data: formTemplate,
    isLoading: isLoadingTemplate,
    error: templateError,
  } = useQuery<FormTemplate | null, Error>({
    queryKey: ["formTemplate", formId],
    queryFn: () => fetchFormTemplateById(formId),
    enabled: !!formId,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const {
    data: formResponse,
    isLoading: isLoadingResponse,
    error: responseError,
  } = useQuery<DetailedFormResponse | null, Error>({
    queryKey: ["formResponse", responseId],
    queryFn: () => fetchFormResponseById(responseId),
    enabled: !!responseId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const currentSection = formTemplate?.sections.find(
    (sec) => sec.id === sectionId,
  );

  const methods = useForm<Record<string, any>>({
    defaultValues: useMemo(
      () => getSectionDefaultValues(formResponse ?? null, currentSection),
      [formResponse, currentSection],
    ),
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (formResponse && currentSection) {
      const defaultValues = getSectionDefaultValues(
        formResponse,
        currentSection,
      );
      reset(defaultValues);
    }
  }, [formResponse, currentSection, reset]);

  const onSubmit = async (formData: Record<string, any>) => {
    if (!currentSection || !formResponse) {
      toast.error(
        "Cannot save: Critical data missing (section or form response).",
      );
      return;
    }

    const updatedFieldResponsesForCurrentSection: FieldResponseUpdateDto[] = [];

    const processSubSectionForSubmit = (subSection: GlobalSubSection, dataObject: Record<string, any>, pathPrefixForDataLookup: string) => {
      if (subSection.isRepeatable) {
        const fieldArrayName = `${pathPrefixForDataLookup}${subSection.name || subSection.id}`;
        const fieldArrayData = dataObject[fieldArrayName] as Array<Record<string, any>> | undefined;

        if (Array.isArray(fieldArrayData)) {
          fieldArrayData.forEach((repetitionData, index) => {
            const entrySeqNum = index + 1; // API expects 1-based sequence
            // Process direct field definitions of the repeatable subsection for this repetition
            subSection.fieldDefinitions.forEach((fieldDef) => {
              if (Object.prototype.hasOwnProperty.call(repetitionData, fieldDef.name)) {
                const fieldValue = repetitionData[fieldDef.name];
                let valueAsString: string;
                if (fieldValue === null || fieldValue === undefined) {
                  valueAsString = "";
                } else if (typeof fieldValue === "object" || Array.isArray(fieldValue)) {
                  valueAsString = JSON.stringify(fieldValue);
                } else {
                  valueAsString = String(fieldValue);
                }
                updatedFieldResponsesForCurrentSection.push({
                  fieldDefinitionId: fieldDef.id,
                  value: valueAsString,
                  entrySequenceNumber: entrySeqNum,
                });
              }
            });
            // TODO: Recursively process child subsections *within* this repetition if they exist.
            // This would require passing down `repetitionData` and adjusting the pathPrefixForDataLookup
            // for fields nested inside a repeatable item's own child subsections.
          });
        }
      } else {
        // Not repeatable
        subSection.fieldDefinitions.forEach((fieldDef) => {
          // For non-repeatable, fieldDef.name is the direct key in dataObject (potentially prefixed if it's a nested non-repeatable subsection)
          const fieldLookupKey = `${pathPrefixForDataLookup}${subSection.name || subSection.id}.${fieldDef.name}`;
          // However, if pathPrefixForDataLookup is already the subsection itself (e.g. for _RootFieldsHolder children),
          // then fieldDef.name might be the direct key.
          // The formData structure from RHF will be flat for dot-notation names.

          if (Object.prototype.hasOwnProperty.call(dataObject, fieldLookupKey)) {
            const fieldValue = dataObject[fieldLookupKey];
            let valueAsString: string;
            if (fieldValue === null || fieldValue === undefined) {
              valueAsString = "";
            } else {
              switch (fieldDef.type) {
                case "CheckboxGroup":
                case "Address": 
                  valueAsString = JSON.stringify(fieldValue);
                  break;
                default:
                  valueAsString = String(fieldValue);
              }
            }

            const existingFieldResponse = formResponse.fieldResponses.find(
              (fr) =>
                fr.fieldDefinitionId === fieldDef.id &&
                (fr.entrySequenceNumber === 1 || !fr.entrySequenceNumber),
            );

            updatedFieldResponsesForCurrentSection.push({
              fieldDefinitionId: fieldDef.id,
              value: valueAsString,
              entrySequenceNumber: existingFieldResponse?.entrySequenceNumber ?? 1,
            });
          }
        });
      }
      
      // Recursively call for actual child subsections (not _RootFieldsHolder itself)
      currentSection.subSections
        .filter(child => child.parentSubSectionId === subSection.id && child.name !== "_RootFieldsHolder")
        .forEach(childSub => processSubSectionForSubmit(childSub, dataObject, `${pathPrefixForDataLookup}${subSection.name || subSection.id}.`));
    };
    
    // Initiate processing for the current section
    // Handle _RootFieldsHolder fields first (no prefix in formData keys)
    const rootFieldsHolder = currentSection.subSections.find(ss => ss.name === "_RootFieldsHolder");
    if (rootFieldsHolder) {
        rootFieldsHolder.fieldDefinitions.forEach(fieldDef => {
            if (Object.prototype.hasOwnProperty.call(formData, fieldDef.name)) {
                const fieldValue = formData[fieldDef.name];
                let valueAsString: string;
                if (fieldValue === null || fieldValue === undefined) {
                    valueAsString = "";
                } else if (typeof fieldValue === "object" || Array.isArray(fieldValue)) {
                    valueAsString = JSON.stringify(fieldValue);
                } else {
                    valueAsString = String(fieldValue);
                }
                const existingFieldResponse = formResponse.fieldResponses.find(
                    (fr) => fr.fieldDefinitionId === fieldDef.id && (fr.entrySequenceNumber === 1 || !fr.entrySequenceNumber)
                );
                updatedFieldResponsesForCurrentSection.push({
                    fieldDefinitionId: fieldDef.id,
                    value: valueAsString,
                    entrySequenceNumber: existingFieldResponse?.entrySequenceNumber ?? 1,
                });
            }
        });
        // Process children of _RootFieldsHolder (actual top-level displayable subsections)
        currentSection.subSections
            .filter(sub => sub.parentSubSectionId === rootFieldsHolder.id)
            .forEach(actualTopSub => processSubSectionForSubmit(actualTopSub, formData, ""));
    } else {
        // If no _RootFieldsHolder, process all top-level subsections directly
        currentSection.subSections
            .filter(sub => sub.parentSubSectionId === null)
            .forEach(topSub => processSubSectionForSubmit(topSub, formData, ""));
    }

    const otherFieldResponses = formResponse.fieldResponses
      .filter((fr) => {
        // Exclude any field response that *could* have been part of the current section's processing
        return !currentSection.subSections.some((ss) =>
          ss.fieldDefinitions.some((fd) => fd.id === fr.fieldDefinitionId)
        );
      })
      .map((fr) => ({
        fieldDefinitionId: fr.fieldDefinitionId,
        value: fr.value,
        entrySequenceNumber: fr.entrySequenceNumber || 1, 
      }));

    const allFieldResponses = [
      ...otherFieldResponses,
      ...updatedFieldResponsesForCurrentSection, // These are the newly processed ones
    ];

    const currentSectionStatus: SectionStatusUpdateDto = {
      sectionId: currentSection.id,
      isCompleted: true, // Or determine this based on form validation state
    };

    const otherSectionStatuses = formResponse.sectionStatuses
      .filter((ss) => ss.sectionId !== currentSection.id)
      .map((ss) => ({ sectionId: ss.sectionId, isCompleted: ss.isCompleted }));

    const allSectionStatuses = [...otherSectionStatuses, currentSectionStatus];

    const payload: FormResponseUpdateDto = {
      patientId: formResponse.patientId,
      vehicleId: formResponse.vehicleId,
      crewId: formResponse.crewId,
      isCompleted: formResponse.isCompleted, // This might need re-evaluation based on current section's completion
      fieldResponses: allFieldResponses,
      sectionStatuses: allSectionStatuses,
    };

    console.log("Prepared payload for submit:", payload);

    try {
      await apiUpdateFormResponse(responseId, payload);
      toast.success(`Section '${currentSection.name}' saved successfully!`);
      queryClient.invalidateQueries({ queryKey: ["formResponse", responseId] });
      // Optionally, navigate or provide other feedback
    } catch (error) { 
      console.error("Failed to save section:", error);
      toast.error(`Failed to save section: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  if (isLoadingTemplate || isLoadingResponse) {
    return <div className="container mx-auto p-4">Loading section data...</div>;
  }

  if (templateError) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        <h1>Error Loading Form Template</h1>
        <p>Could not load form template ID: {formId}.</p>
        <p>Details: {templateError.message}</p>
        <Link
          href={`/forms/${formId}`}
          className="mt-4 block text-blue-500 hover:underline"
        >
          Back to full form
        </Link>
      </div>
    );
  }

  if (responseError) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        <h1>Error Loading Form Response</h1>
        <p>Could not load form response ID: {responseId}.</p>
        <p>Details: {responseError.message}</p>
        <Link
          href={`/forms/${formId}`}
          className="mt-4 block text-blue-500 hover:underline"
        >
          Back to full form
        </Link>
      </div>
    );
  }

  if (!formTemplate) {
    return (
      <div className="container mx-auto p-4">
        <h1>Form Template Not Found</h1>
        <p>
          Could not find form template with ID: {formId} to render section{" "}
          {sectionId}.
        </p>
        <Link
          href={`/forms`}
          className="mt-4 block text-blue-500 hover:underline"
        >
          Back to forms list
        </Link>
      </div>
    );
  }

  if (!currentSection) {
    return (
      <div className="container mx-auto p-4">
        <h1>Section Not Found</h1>
        <p>
          Section with ID: {sectionId} not found in form {formTemplate.title}.
        </p>
        <Link
          href={`/forms/${formId}`}
          className="mt-4 block text-blue-500 hover:underline"
        >
          Back to full form
        </Link>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container mx-auto space-y-6 p-4"
      >
        <div className="mb-4 flex items-center justify-between">
          <Button variant="link" asChild className="p-0">
            <Link
              href={`/forms/${formId}/${responseId}`}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to response overview
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{currentSection.name}</h1>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Section"}
          </Button>
        </div>
        <FormSectionRenderer section={currentSection} control={control} />
      </form>
    </FormProvider>
  );
}
