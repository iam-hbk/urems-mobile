"use client";

import { SectionFormBuilder } from "@/components/section-form-builder";
import { useFormResponse } from "@/hooks/dynamic-forms/use-dynamic-forms";
import { FormTemplate } from "@/types/form-template";
import { Section } from "@/types/form-template";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ClientSectionPageProps {
  section: Section;
  formTemplate: FormTemplate;
  formId: string;
  responseId: string;
}

export function ClientSectionPage({
  section,
  formTemplate,
  formId,
  responseId,
}: ClientSectionPageProps) {
  // Only fetch the form response on the client
  const { data: formResponse, isLoading, error } = useFormResponse(responseId);

  if (error) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold text-destructive mb-2">
          Error Loading Form Response
        </h3>
        <p className="text-muted-foreground mb-4">
          {error.detail || "Failed to load your form responses"}
        </p>
        <Link href={`/forms/${formId}/${responseId}`}>
          <Button variant="outline">Back to Form Overview</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="space-y-2">
          <p className="text-muted-foreground">Loading your form responses...</p>
          <div className="text-sm text-muted-foreground">
            <p>Form ID: {formId}</p>
            <p>Response ID: {responseId}</p>
            <p>Section: {section.name}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SectionFormBuilder
      section={section}
      formTemplate={formTemplate}
      formId={formId}
      responseId={responseId}
      existingResponse={formResponse}
    />
  );
}
