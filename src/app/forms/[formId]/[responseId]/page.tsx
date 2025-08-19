import React from "react";
import { SectionsTable } from "@/components/response-meta-table/sections-table";
import { ProgressRing } from "@/components/response-meta-table/section-progress-ring";
import { ResponseMetaCard } from "@/components/response-meta-table/response-meta-card";
import { fetchFormTemplateById } from "@/lib/api/dynamic-forms-api";
import { notFound } from "next/navigation";
import { ClientFormResponsePage } from "./client-form-response-page";

type Props = Promise<{
  formId: string;
  responseId: string;
}>;

export default async function RootFormResponseSectionPage({ params }: { params: Props }) {
  const { responseId, formId } = await params;

  // Fetch form template server-side (no loading state needed)
  const formTemplateResult = await fetchFormTemplateById(formId);
  
  if (formTemplateResult.isErr()) {
    console.error("❌ Failed to fetch form template:", formTemplateResult.error);
    notFound();
  }
  
  const formTemplate = formTemplateResult.value;

  return (
    <div className="container mx-auto space-y-8 px-2 py-4 md:px-0">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ResponseMetaCard response={undefined} template={formTemplate} />
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="flex h-full w-full flex-col items-center justify-center space-y-6 rounded-lg p-4">
            <h2 className="text-xl font-semibold">Form Completion Progress</h2>
            <ProgressRing
              progress={0}
              className="scale-110 transform"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Form Sections</h2>
        {/* Client component that fetches the response */}
        <ClientFormResponsePage
          formTemplate={formTemplate}
          formId={formId}
          responseId={responseId}
        />
      </div>
    </div>
  );
}
