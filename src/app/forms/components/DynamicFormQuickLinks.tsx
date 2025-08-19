import React from "react";
import { FormTemplate } from "@/types/form-template";
import { fetchFormTemplateById } from "@/lib/api/dynamic-forms-api";
import { DynamicFormQuickLinksClient } from "./DynamicFormQuickLinksClient";

interface DynamicFormQuickLinksProps {
  formId?: string;
  responseId?: string;
  initialFormTemplate?: FormTemplate;
}

export default async function DynamicFormQuickLinks({ 
  formId: propFormId, 
  responseId: propResponseId, 
  initialFormTemplate 
}: DynamicFormQuickLinksProps) {
  // Extract formId and responseId from URL pathname if not provided as props
  let formId = propFormId;
  let responseId = propResponseId;
  
  if (!formId || !responseId) {
    // This is a workaround for server components that can't use usePathname
    // In practice, you should pass these as props from the parent page
    // For now, we'll require them to be passed as props
    if (!formId) {
      return (
        <nav className="w-full rounded-lg border bg-card p-4 shadow">
          <div className="flex items-center justify-center">
            <div className="text-sm text-red-500">
              Form ID is required for DynamicFormQuickLinks
            </div>
          </div>
        </nav>
      );
    }
  }
  
  // Use provided form template or fetch it server-side
  let formTemplate = initialFormTemplate;
  
  if (!formTemplate) {
    const result = await fetchFormTemplateById(formId!);
    if (result.isErr()) {
      return (
        <nav className="w-full rounded-lg border bg-card p-4 shadow">
          <div className="flex items-center justify-center">
            <div className="text-sm text-red-500">
              Failed to load form template for quick links: {result.error.detail}
            </div>
          </div>
        </nav>
      );
    }
    formTemplate = result.value;
  }

  if (!formTemplate || !formTemplate.sections) {
    return (
      <nav className="w-full rounded-lg border bg-card p-4 shadow">
        <div className="flex items-center justify-center">
          <div className="text-sm text-red-500">
            Form template not found or has no sections
          </div>
        </div>
      </nav>
    );
  }

  return (
    <DynamicFormQuickLinksClient
      formId={formId!}
      responseId={responseId}
      formTemplate={formTemplate}
    />
  );
}
