"use client";
import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { FormTemplate, DetailedFormResponse } from "@/types/form-template";
import DynamicFormQuickLinks from "../../components/DynamicFormQuickLinks";
import { fetchFormTemplateById, fetchFormResponseById } from "../../api";
// TODO: Adapt these components or create versions for FormTemplate
// import AssessmentToolsSummary from "@/components/assessment-tools-summary";
// import NotesDialog from "@/components/the-prf-form/notes-dialog";

type Params = Promise<{
  formId: string;
  responseId: string;
}>;

export default function DynamicFormLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Params;
}>) {
  const { formId, responseId } = use(params);
  const {
    data: formTemplate,
    isLoading: isLoadingTemplate,
    // error: templateError, // Available if needed
  } = useQuery<FormTemplate | null, Error>({
    queryKey: ["formTemplate", formId],
    queryFn: () => fetchFormTemplateById(formId),
    enabled: !!formId,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  const {
    data: formResponse,
    isLoading: isLoadingResponse,
    // error: responseError, // Available if needed
  } = useQuery<DetailedFormResponse | null, Error>({
    queryKey: ["formResponse", responseId],
    queryFn: () => fetchFormResponseById(responseId),
    enabled: !!responseId,
    staleTime: 1000 * 60 * 5, // 5 minutes for response data
    gcTime: 1000 * 60 * 60, // 1 hour
  });


  // TODO: Adapt QuickLinks, StepperView, CommandPalette for FormTemplate
  // const [showQuickLinks, setShowQuickLinks] = useState<boolean>(true);
  // const [showCommandPalette, setShowCommandPalette] = useState(false);

  return (
    <div className="flex w-full flex-col items-center overflow-auto">
      {formTemplate && formId && (
        <DynamicFormQuickLinks formTemplate={formTemplate} formId={formId} responseId={responseId} />
      )}

      <main className="grid w-full flex-grow grid-cols-1 justify-items-center p-4">
        {children}
      </main>

      {/* {formTemplate && <AssessmentToolsSummary formTemplate={formTemplate} />} */}
      {/* <NotesDialog /> */}
    </div>
  );
}
