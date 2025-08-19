import React from "react";
import DynamicFormQuickLinks from "../../components/DynamicFormQuickLinks";
// TODO: Adapt these components or create versions for FormTemplate
// import AssessmentToolsSummary from "@/components/assessment-tools-summary";
// import NotesDialog from "@/components/the-prf-form/notes-dialog";

interface DynamicFormLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    formId: string;
    responseId: string;
  }>;
}

export default async function DynamicFormLayout({
  children,
  params,
}: DynamicFormLayoutProps) {
  const { formId, responseId } = await params;

  return (
    <div className="flex w-full flex-col items-center overflow-auto relative">
      <DynamicFormQuickLinks 
        formId={formId}
        responseId={responseId}
      />

      <main className="grid w-full flex-grow grid-cols-1 justify-items-center p-4">
        {children}
      </main>

      {/* {formTemplate && <AssessmentToolsSummary formTemplate={formTemplate} />} */}
      {/* <NotesDialog /> */}
    </div>
  );
}
