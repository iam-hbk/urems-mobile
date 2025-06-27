"use client";
import React, { use } from "react";
import { SectionsTable } from "@/components/response-meta-table/sections-table";
import { ProgressRing } from "@/components/response-meta-table/section-progress-ring";
import { ResponseMetaCard } from "@/components/response-meta-table/response-meta-card";
import {
  useFormTemplate,
  useFormResponse,
} from "@/hooks/dynamic-forms/use-dynamic-forms";

type Props = Promise<{
  formId: string;
  responseId: string;
}>;

const RootFormResponseSectionPage = (props: { params: Props }) => {
  const { responseId, formId } = use(props.params);

  const {
    data: formTemplate,
    isLoading: isLoadingFormTemplate,
    error: formTemplateError,
  } = useFormTemplate(formId);

  const {
    data: formResponse,
    isLoading: isLoadingFormResponse,
    error: formResponseError,
  } = useFormResponse(responseId);

  if (isLoadingFormTemplate || isLoadingFormResponse) {
    return (
      <div className="w-full p-8 text-center">Loading form details...</div>
    );
  }

  if (formTemplateError || formResponseError) {
    return (
      <div className="w-full p-8 text-center text-red-500">
        Error loading form data:{" "}
        {(formTemplateError || formResponseError)?.detail}
      </div>
    );
  }

  if (!formTemplate || !formResponse) {
    return <div className="w-full p-8 text-center">Form data not found.</div>;
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
    <div className="container mx-auto space-y-8 px-2 py-4 md:px-0">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ResponseMetaCard data={formResponse} />
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

      <div>
        <h2 className="mb-4 text-xl font-semibold">Form Sections</h2>
        <SectionsTable
          formTemplate={formTemplate}
          formResponse={formResponse}
          formId={formId}
        />
      </div>
    </div>
  );
};

export default RootFormResponseSectionPage;
