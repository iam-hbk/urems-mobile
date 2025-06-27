"use client";
import React, { use } from "react";
import DynamicFormQuickLinks from "../../components/DynamicFormQuickLinks";
import {
  useFormTemplate,
  useFormResponse,
} from "@/hooks/dynamic-forms/use-dynamic-forms";
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
  } = useFormTemplate(formId);

  const {
    data: formResponse,
    isLoading: isLoadingResponse,
    // error: responseError, // Available if needed
  } = useFormResponse(responseId);

  // TODO: Adapt QuickLinks, StepperView, CommandPalette for FormTemplate
  // const [showQuickLinks, setShowQuickLinks] = useState<boolean>(true);
  // const [showCommandPalette, setShowCommandPalette] = useState(false);

  return (
    <div className="flex w-full flex-col items-center overflow-auto relative">
      {formTemplate && formId && (
        <DynamicFormQuickLinks
          formTemplate={formTemplate}
          formId={formId}
          responseId={responseId}
        />
      )}

      <main className="grid w-full flex-grow grid-cols-1 justify-items-center p-4">
        {children}
      </main>

      {/* {formTemplate && <AssessmentToolsSummary formTemplate={formTemplate} />} */}
      {/* <NotesDialog /> */}
    </div>
  );
}
