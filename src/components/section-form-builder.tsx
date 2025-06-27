"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import type {
  Section,
  FormTemplate,
  DetailedFormResponse,
  FieldResponse,
  FieldDefinition,
  SubSection,
  FormResponseUpdateDto,
  FieldResponseUpdateDto,
  SectionStatusUpdateDto,
} from "@/types/form-template";
import { FormSubSection } from "./form-subsection";
import { Button } from "@/components/ui/button";
import { Save, Send, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import Link from "next/link";
import { FormFieldBuilder } from "@/components/form-field";
import { useUpdateFormResponse } from "@/hooks/dynamic-forms/use-dynamic-forms";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SectionFormBuilderProps {
  section: Section;
  formTemplate: FormTemplate;
  formId: string;
  responseId: string;
  existingResponse?: DetailedFormResponse;
}

export function SectionFormBuilder({
  section,
  formTemplate,
  formId,
  responseId,
  existingResponse,
}: SectionFormBuilderProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [showUntouchedDialog, setShowUntouchedDialog] = useState(false);
  const [untouchedFieldsBySubSection, setUntouchedFieldsBySubSection] = useState<Record<string, string[]>>({});

  const updateFormResponseMutation = useUpdateFormResponse();

  // Create default values from existing response for this section
  const getDefaultValues = () => {
    const defaults: Record<string, any> = {};

    if (existingResponse?.fieldResponses) {
      // Get all field definitions for this section
      const directFieldDefs = section.directFields || [];
      const subSectionFieldDefs = (section.groupedSubSections || []).flatMap(
        (ss: SubSection) => ss.fieldDefinitions,
      );
      const allFieldDefsInSection = [
        ...directFieldDefs,
        ...subSectionFieldDefs,
      ];
      const sectionFieldIds = allFieldDefsInSection.map(
        (fd: FieldDefinition) => fd.id,
      );

      existingResponse.fieldResponses
        .filter((response) =>
          sectionFieldIds.includes(response.fieldDefinitionId),
        )
        .forEach((response: FieldResponse) => {
          // Find the field definition to determine the field name
          const fieldDef = allFieldDefsInSection.find(
            (fd: FieldDefinition) => fd.id === response.fieldDefinitionId,
          );

          if (fieldDef) {
            const key = `${fieldDef.name}_${response.entrySequenceNumber || 0}`;

            // Parse value based on field type
            switch (fieldDef.type) {
              case "Boolean":
                defaults[key] = response.value === "true";
                break;
              case "Number":
                defaults[key] = response.value
                  ? Number(response.value)
                  : undefined;
                break;
              case "CheckboxGroup":
                try {
                  defaults[key] = JSON.parse(response.value);
                } catch {
                  defaults[key] = [];
                }
                break;
              default:
                defaults[key] = response.value;
            }
          }
        });
    }

    return defaults;
  };

  const form = useForm({
    defaultValues: getDefaultValues(),
  });

  // Initialize section completion status
  useEffect(() => {
    if (existingResponse?.sectionStatuses) {
      const sectionStatus = existingResponse.sectionStatuses.find(
        (status) => status.sectionId === section.id,
      );
      setIsCompleted(sectionStatus?.isCompleted || false);
    }
  }, [existingResponse, section.id]);

  const onSubmit = async (hookFormData: any) => {
    console.log("Section submission data from react-hook-form:", hookFormData);
    
    // Check for untouched required fields before submitting
    const directFieldDefs = section.directFields || [];
    const subSectionFieldDefs = (section.groupedSubSections || []).flatMap(
      (ss: SubSection) => ss.fieldDefinitions,
    );
    const allFieldDefsInSection = [
      ...directFieldDefs,
      ...subSectionFieldDefs,
    ];

    const untouchedRequiredFields: string[] = [];
    
    allFieldDefsInSection.forEach(fieldDef => {
      if (fieldDef.isRequired) {
        const fieldName = `${fieldDef.id}_1`; // Assuming entryIndex 1 for now
        const isTouched = form.formState.touchedFields[fieldName];
        if (!isTouched) {
          untouchedRequiredFields.push(fieldDef.label);
        }
      }
    });

    // If there are untouched required fields, show dialog instead of submitting
    if (untouchedRequiredFields.length > 0) {
      // Group fields by subsection
      const groupedFields: Record<string, string[]> = {};
      
      // Check direct fields (main section)
      const directUntouchedFields: string[] = [];
      (section.directFields || []).forEach(fieldDef => {
        if (fieldDef.isRequired) {
          const fieldName = `${fieldDef.id}_1`;
          const isTouched = form.formState.touchedFields[fieldName];
          if (!isTouched) {
            directUntouchedFields.push(fieldDef.label);
          }
        }
      });
      
      if (directUntouchedFields.length > 0) {
        groupedFields[section.name] = directUntouchedFields;
      }

      // Check subsection fields
      (section.groupedSubSections || []).forEach(subSection => {
        const subSectionUntouchedFields: string[] = [];
        subSection.fieldDefinitions.forEach(fieldDef => {
          if (fieldDef.isRequired) {
            const fieldName = `${fieldDef.id}_1`;
            const isTouched = form.formState.touchedFields[fieldName];
            if (!isTouched) {
              subSectionUntouchedFields.push(fieldDef.label);
            }
          }
        });
        
        if (subSectionUntouchedFields.length > 0) {
          groupedFields[subSection.name] = subSectionUntouchedFields;
        }
      });

      setUntouchedFieldsBySubSection(groupedFields);
      setShowUntouchedDialog(true);
      return;
    }

    // Proceed with normal submission
    setIsCompleted(true); // Set section as completed locally
    submitFormData(hookFormData);
  };

  const submitFormData = (hookFormData: any) => {
    const directFieldDefs = section.directFields || [];
    const subSectionFieldDefs = (section.groupedSubSections || []).flatMap(
      (ss: SubSection) => ss.fieldDefinitions,
    );
    const allFieldDefsInSection = [
      ...directFieldDefs,
      ...subSectionFieldDefs,
    ];

    const sectionDataToProcess: Record<string, any> = {};
    const allValidFieldKeysPrefixes = allFieldDefsInSection.map(fd => fd.name);

    for (const key in hookFormData) {
      const fieldNamePrefix = key.split("_")[0];
      if (allValidFieldKeysPrefixes.includes(fieldNamePrefix)) {
        sectionDataToProcess[key] = hookFormData[key];
      }
    }
    console.log("Filtered section submission data:", sectionDataToProcess);

    const fieldResponsesPayload: FieldResponseUpdateDto[] = [];
    for (const key in sectionDataToProcess) {
      const fieldNamePrefix = key.split("_")[0];
      // Assuming entrySequenceNumber is part of the key if it's greater than 0 for repeatable fields/subsections
      // For direct fields or single entry fields, it might be 0 or not present in the key.
      // This logic might need adjustment based on how repeatable fields are keyed.
      const entrySequenceParts = key.split("_");
      const entrySequenceNumber = entrySequenceParts.length > 1 && !isNaN(parseInt(entrySequenceParts[entrySequenceParts.length -1])) ? parseInt(entrySequenceParts[entrySequenceParts.length -1]) : 0;

      const fieldDef = allFieldDefsInSection.find(fd => fd.name === fieldNamePrefix);
      if (fieldDef) {
        let valueToSave = sectionDataToProcess[key];

        // Check if the field is an Address and the value is an object
        if (fieldDef.type === "Address" && typeof valueToSave === "object" && valueToSave !== null && "fullAddress" in valueToSave) {
          valueToSave = String(valueToSave.fullAddress || ""); // Use fullAddress or empty string if undefined
        } else if (fieldDef.type === "CheckboxGroup" && Array.isArray(valueToSave)) {
          valueToSave = JSON.stringify(valueToSave);
        } else {
          valueToSave = String(valueToSave);
        }

        fieldResponsesPayload.push({
          fieldDefinitionId: fieldDef.id,
          value: valueToSave,
          entrySequenceNumber: entrySequenceNumber, // Make sure DTO supports this or adjust
        });
      }
    }

    const sectionStatusPayload: SectionStatusUpdateDto[] = [{
      sectionId: section.id,
      isCompleted: true, // Section is considered completed on submission
    }];

    const updatePayload: FormResponseUpdateDto = {
      fieldResponses: fieldResponsesPayload,
      sectionStatuses: sectionStatusPayload,
    };

    console.log("Payload to send to API via mutation:");
    console.dir(updatePayload, { depth: null });

    updateFormResponseMutation.mutate({ responseId, payload: updatePayload });
  };

  // Handle forced submission (ignore untouched fields)
  const handleForcedSubmit = async () => {
    setShowUntouchedDialog(false);
    const hookFormData = form.getValues();
    
    // Proceed with submission without checking touched fields
    setIsCompleted(true);
    submitFormData(hookFormData);
  };

  // Get navigation info
  const currentIndex = formTemplate.sections.findIndex(
    (s) => s.id === section.id,
  );
  const previousSection =
    currentIndex > 0 ? formTemplate.sections[currentIndex - 1] : null;
  const nextSection =
    currentIndex < formTemplate.sections.length - 1
      ? formTemplate.sections[currentIndex + 1]
      : null;

  // Check if any field in this section has been touched
  const getSectionFieldNames = () => {
    const directFieldDefs = section.directFields || [];
    const subSectionFieldDefs = (section.groupedSubSections || []).flatMap(
      (ss: SubSection) => ss.fieldDefinitions,
    );
    const allFieldDefsInSection = [
      ...directFieldDefs,
      ...subSectionFieldDefs,
    ];
    
    // Generate field names as they appear in the form (fieldId_entryIndex)
    return allFieldDefsInSection.map(fd => `${fd.id}_1`); // Assuming entryIndex 1 for now
  };

  const sectionFieldNames = getSectionFieldNames();
  const hasAnyFieldBeenTouched = sectionFieldNames.some(
    fieldName => form.formState.touchedFields[fieldName]
  );

  const isSubmitDisabled = updateFormResponseMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Section Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Render direct fields using FormFieldBuilder */}
          {(section.directFields || []).map((fieldDef: FieldDefinition) => (
            <FormFieldBuilder
              key={fieldDef.id}
              fieldDefinition={fieldDef}
              form={form}
              entryIndex={1}
              existingResponse={existingResponse}
            />
          ))}

          {/* Render grouped subsections */}
          {(section.groupedSubSections || []).map((subSection: SubSection) => (
            <FormSubSection
              key={subSection.id}
              subSection={subSection}
              form={form}
              responseId={responseId}
              existingResponse={existingResponse}
            />
          ))}

          {/* Form Actions */}
          <div className="flex items-center justify-between border-t pt-6">
            <div className="flex space-x-2">
              {previousSection && (
                <Link
                  href={`/forms/${formId}/${responseId}/${previousSection.id}`}
                >
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous: {previousSection.name}
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.handleSubmit(onSubmit)()}
                disabled={isSubmitDisabled}
              >
                {updateFormResponseMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Section
              </Button>

              {nextSection ? (
                <Link href={`/forms/${formId}/${responseId}/${nextSection.id}`}>
                  <Button type="submit" disabled={isSubmitDisabled}>
                    {updateFormResponseMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save & Continue
                    {!updateFormResponseMutation.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </Link>
              ) : (
                <Link href={`/forms/${formId}/${responseId}`}>
                  <Button type="submit" disabled={isSubmitDisabled}>
                    {updateFormResponseMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save & Return to Overview
                    {!updateFormResponseMutation.isPending && <Send className="ml-2 h-4 w-4" />}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </form>
      </Form>

      {/* Untouched Required Fields Dialog */}
      <AlertDialog open={showUntouchedDialog} onOpenChange={setShowUntouchedDialog}>
        <AlertDialogContent className="max-w-2xl max-h-[80vh]">
          <AlertDialogHeader>
            <AlertDialogTitle>Incomplete Required Fields</AlertDialogTitle>
            <AlertDialogDescription>
              The following required fields haven't been touched yet. You can submit anyway with their default values, or go back to complete them:
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4 max-h-96 overflow-y-auto">
            {Object.entries(untouchedFieldsBySubSection).map(([sectionName, fieldLabels]) => (
              <div key={sectionName} className="mb-6 last:mb-0">
                <h4 className="font-semibold text-sm text-foreground mb-2 border-b pb-1">
                  {sectionName}
                </h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  {fieldLabels.map((fieldLabel, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {fieldLabel}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowUntouchedDialog(false)}>
              Go Back to Complete
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleForcedSubmit}>
              Submit Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
