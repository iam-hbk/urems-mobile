"use client";

import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { SubSection, DetailedFormResponse } from "@/types/form-template";
import { FormFieldBuilder } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FormSubSectionProps {
  subSection: SubSection;
  form: UseFormReturn<any>;
  responseId?: string;
  existingResponse?: DetailedFormResponse;
  className?: string;
}

export function FormSubSection({
  subSection,
  form,
  responseId,
  existingResponse,
}: FormSubSectionProps) {
  const [repeatCount, setRepeatCount] = useState(1);

  // Get existing entries for this subsection
  const getExistingEntries = () => {
    if (!existingResponse?.fieldResponses) return 1;

    const entries = existingResponse.fieldResponses
      .filter((response) =>
        subSection.fieldDefinitions.some(
          (fd) => fd.id === response.fieldDefinitionId,
        ),
      )
      .map((response) => response.entrySequenceNumber || 0);

    return entries.length > 0 ? Math.max(...entries) + 1 : 1;
  };

  const maxEntries = subSection.isRepeatable ? getExistingEntries() : 1;

  const addRepeatableEntry = () => {
    if (subSection.isRepeatable) {
      setRepeatCount((prev) => prev + 1);
    }
  };

  const removeRepeatableEntry = (entryIndex: number) => {
    if (subSection.isRepeatable && repeatCount > 1) {
      setRepeatCount((prev) => prev - 1);

      // Clear form values for this entry
      subSection.fieldDefinitions.forEach((field) => {
        const fieldName = `${field.name}_${entryIndex}`;
        form.unregister(fieldName);
      });
    }
  };

  const duplicateEntry = (entryIndex: number) => {
    if (subSection.isRepeatable) {
      const newEntryIndex = repeatCount;

      // Copy values from the source entry to the new entry
      subSection.fieldDefinitions.forEach((field) => {
        const sourceFieldName = `${field.name}_${entryIndex}`;
        const targetFieldName = `${field.name}_${newEntryIndex}`;
        const sourceValue = form.getValues(sourceFieldName);

        if (sourceValue !== undefined) {
          form.setValue(targetFieldName, sourceValue);
        }
      });

      setRepeatCount((prev) => prev + 1);
    }
  };

  // If there's only one field and no child subsections, render the field directly
  if (
    subSection.fieldDefinitions.length === 1 &&
    !subSection.childSubSections?.length
  ) {
    const fieldDefinition = subSection.fieldDefinitions[0];

    if (!subSection.isRepeatable) {
      return (
        <FormFieldBuilder
          key={fieldDefinition.id}
          fieldDefinition={fieldDefinition}
          form={form}
          entryIndex={0}
          existingResponse={existingResponse}
        />
      );
    }

    // Handle repeatable single field
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{subSection.name}</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRepeatableEntry}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        </div>

        {Array.from(
          { length: Math.max(repeatCount, maxEntries) },
          (_, entryIndex) => (
            <div key={entryIndex} className="flex items-start space-x-4">
              <div className="flex-grow">
                <FormFieldBuilder
                  key={`${fieldDefinition.id}_${entryIndex}`}
                  fieldDefinition={fieldDefinition}
                  form={form}
                  entryIndex={entryIndex}
                  existingResponse={existingResponse}
                />
              </div>
              <div className="flex space-x-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => duplicateEntry(entryIndex)}
                  title="Duplicate this entry"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {repeatCount > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRepeatableEntry(entryIndex)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ),
        )}
      </div>
    );
  }

  // Original rendering logic for multiple fields or subsections with child subsections
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{subSection.name}</h3>
        {subSection.isRepeatable && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRepeatableEntry}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        )}
      </div>

      {subSection.isRepeatable ? (
        <Accordion type="single" collapsible className="w-full">
          {Array.from({ length: Math.max(repeatCount, maxEntries) }, (_, entryIndex) => (
            <AccordionItem className="border-none" key={entryIndex} value={`entry-${entryIndex}`}>
              <Card className="border-dashed my-3">
                <CardHeader className="p-2 px-4">
                  <div className="flex items-center justify-between">
                    <AccordionTrigger className="hover:no-underline">
                      <CardTitle className="text-base">
                        {subSection.name} #{entryIndex + 1}
                      </CardTitle>
                    </AccordionTrigger>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateEntry(entryIndex)}
                        title="Duplicate this entry"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {repeatCount > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRepeatableEntry(entryIndex)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <AccordionContent>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {subSection.fieldDefinitions.map((fieldDefinition) => (
                        <FormFieldBuilder
                          key={`${fieldDefinition.id}_${entryIndex}`}
                          fieldDefinition={fieldDefinition}
                          form={form}
                          entryIndex={entryIndex}
                          existingResponse={existingResponse}
                        />
                      ))}
                    </div>

                    {/* Render child subsections with full width */}
                    {subSection.childSubSections &&
                      subSection.childSubSections.length > 0 && (
                        <div className="mt-6 space-y-4">
                          {subSection.childSubSections.map((childSubSection) => (
                            <div
                              key={`${childSubSection.id}_${entryIndex}`}
                              className="w-full"
                            >
                              <FormSubSection
                                subSection={childSubSection}
                                form={form}
                                responseId={responseId}
                                existingResponse={existingResponse}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {subSection.fieldDefinitions.map((fieldDefinition) => (
                <FormFieldBuilder
                  key={`${fieldDefinition.id}_0`}
                  fieldDefinition={fieldDefinition}
                  form={form}
                  entryIndex={0}
                  existingResponse={existingResponse}
                />
              ))}
            </div>

            {/* Render child subsections with full width */}
            {subSection.childSubSections &&
              subSection.childSubSections.length > 0 && (
                <div className="mt-6 space-y-4">
                  {subSection.childSubSections.map((childSubSection) => (
                    <div
                      key={`${childSubSection.id}_0`}
                      className="w-full"
                    >
                      <FormSubSection
                        subSection={childSubSection}
                        form={form}
                        responseId={responseId}
                        existingResponse={existingResponse}
                      />
                    </div>
                  ))}
                </div>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
