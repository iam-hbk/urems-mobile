"use client";

import React from "react";
import { SectionsTable } from "@/components/response-meta-table/sections-table";
import { ProgressRing } from "@/components/response-meta-table/section-progress-ring";
import { ResponseMetaCard } from "@/components/response-meta-table/response-meta-card";
import { useFormResponse } from "@/hooks/dynamic-forms/use-dynamic-forms";
import { FormTemplate } from "@/types/form-template";

interface ClientFormResponsePageProps {
  formTemplate: FormTemplate;
  formId: string;
  responseId: string;
}

export function ClientFormResponsePage({
  formTemplate,
  formId,
  responseId,
}: ClientFormResponsePageProps) {
  const {
    data: formResponse,
    isLoading,
    error,
  } = useFormResponse(responseId);

  if (error) {
    return (
      <div className="w-full p-8 text-center text-red-500">
        Error loading form response: {error.detail}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full p-8 text-center">Loading form response...</div>
    );
  }

  if (!formResponse) {
    return <div className="w-full p-8 text-center">Form response not found.</div>;
  }

  const completionProgress =
    formResponse.sectionStatuses.length > 0
      ? (formResponse.sectionStatuses.reduce(
          (acc, curr) => acc + (curr.isCompleted ? 1 : 0),
          0,
        ) /
          formResponse.sectionStatuses.length) *
        100
      : 0;

  return (
    <>
      {/* Update the ResponseMetaCard with actual response data */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ResponseMetaCard response={formResponse} template={formTemplate} />
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="flex h-full w-full flex-col items-center justify-center space-y-6 rounded-lg p-4">
            <h2 className="text-xl font-semibold">Form Completion Progress</h2>
            <ProgressRing
              progress={completionProgress}
              className="scale-110 transform"
            />
          </div>
        </div>
      </div>

      {/* Render the sections table with actual response data */}
      <SectionsTable
        formTemplate={formTemplate}
        formResponse={formResponse}
        formId={formId}
      />
    </>
  );
}
