"use client";
import React, { use } from "react";
import DynamicFormQuickLinks from "../../components/DynamicFormQuickLinks";
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
  // We still need to destructure params to avoid Next.js errors, 
  // but the DynamicFormQuickLinks component now gets the data from the URL itself
  // Prefix with underscore to indicate intentionally unused
  const { formId: _formId, responseId: _responseId } = use(params);

  // TODO: Adapt QuickLinks, StepperView, CommandPalette for FormTemplate
  // const [showQuickLinks, setShowQuickLinks] = useState<boolean>(true);
  // const [showCommandPalette, setShowCommandPalette] = useState(false);

  return (
    <div className="flex w-full flex-col items-center overflow-auto relative">
      <DynamicFormQuickLinks />

      <main className="grid w-full flex-grow grid-cols-1 justify-items-center p-4">
        {children}
      </main>

      {/* {formTemplate && <AssessmentToolsSummary formTemplate={formTemplate} />} */}
      {/* <NotesDialog /> */}
    </div>
  );
}
