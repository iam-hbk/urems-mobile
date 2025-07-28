"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import type {
  FormTemplate,
  DetailedFormResponse,
  FieldResponse,
} from "@/types/form-template";
import { FormSection } from "./form-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Save, Send } from "lucide-react";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";

interface FormBuilderProps {
  formTemplate: FormTemplate;
  formId: string;
  responseId?: string;
  sectionId?: string;
  existingResponse?: DetailedFormResponse;
}

export function FormBuilder({
  formTemplate,
  formId,
  responseId,
  sectionId,
  existingResponse,
}: FormBuilderProps) {
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set(),
  );

  // Create default values from existing response
  const getDefaultValues = () => {
    const defaults: Record<string, any> = {};

    if (existingResponse?.fieldResponses) {
      existingResponse.fieldResponses.forEach((response: FieldResponse) => {
        // Find the field definition to determine the field name
        const fieldDef = formTemplate.sections
          .flatMap((s) => s.groupedSubSections)
          .flatMap((ss) => ss?.fieldDefinitions)
          .find((fd) => fd?.id === response.fieldDefinitionId);

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

  // Initialize completed sections from existing response
  useEffect(() => {
    if (existingResponse?.sectionStatuses) {
      const completed = new Set(
        existingResponse.sectionStatuses
          .filter((status) => status.isCompleted)
          .map((status) => status.sectionId),
      );
      setCompletedSections(completed);
    }
  }, [existingResponse]);

  const onSubmit = async (data: any) => {
    try {
      console.log("Form submission data:", data);

      // Here you would typically send the data to your API
      // const response = await updateFormResponse(responseId, data)

      toast.success("Form saved successfully");
    } catch (error) {
      toast.error("Error saving form");
    }
  };

  const handleSectionComplete = (sectionId: string, isCompleted: boolean) => {
    setCompletedSections((prev) => {
      const newSet = new Set(prev);
      if (isCompleted) {
        newSet.add(sectionId);
      } else {
        newSet.delete(sectionId);
      }
      return newSet;
    });
  };

  // Filter sections if we're viewing a specific section
  const sectionsToRender = sectionId
    ? formTemplate.sections.filter((section) => section.id === sectionId)
    : formTemplate.sections;

  const totalSections = formTemplate.sections.length;
  const completedCount = completedSections.size;
  const progressPercentage =
    totalSections > 0 ? (completedCount / totalSections) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      {!sectionId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Form Progress</span>
              <Badge
                variant={
                  completedCount === totalSections ? "default" : "secondary"
                }
              >
                {completedCount}/{totalSections} sections completed
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
              {formTemplate.sections.map((section) => (
                <div
                  key={section.id}
                  className="flex items-center space-x-2 text-sm"
                >
                  {completedSections.has(section.id) ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span
                    className={
                      completedSections.has(section.id) ? "text-green-600" : ""
                    }
                  >
                    {section.name}
                  </span>
                  {section.isRequired && (
                    <Badge variant="outline" className="text-xs">
                      Required
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {sectionsToRender.map((section) => (
            <FormSection
              key={section.id}
              section={section}
              form={form}
              isCompleted={completedSections.has(section.id)}
              onSectionComplete={(isCompleted) =>
                handleSectionComplete(section.id, isCompleted)
              }
              responseId={responseId}
              existingResponse={existingResponse}
            />
          ))}

          {/* Form Actions */}
          <div className="flex items-center justify-between border-t pt-6">
            <div className="text-sm text-muted-foreground">
              {responseId
                ? "Editing existing response"
                : "Creating new response"}
            </div>
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.handleSubmit(onSubmit)()}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button type="submit">
                <Send className="mr-2 h-4 w-4" />
                Submit Form
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
