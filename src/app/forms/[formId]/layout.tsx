"use client";
import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { FormTemplate } from "@/types/form-template";
import { fetchFormTemplateById } from "@/lib/api/dynamic-forms-api";

// TODO: Adapt these components or create versions for FormTemplate
// import AssessmentToolsSummary from "@/components/assessment-tools-summary";
// import NotesDialog from "@/components/the-prf-form/notes-dialog";

type Params = Promise<{
  formId: string;
}>;

export default function FormLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Params;
}>) {
  const { formId } = use(params);

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

  return (
    <div className="flex w-full flex-col items-center overflow-auto">
      <main className="grid w-full flex-grow grid-cols-1 justify-items-center p-4">
        {isLoadingTemplate && !formTemplate ? (
          <div className="p-8 text-center">
            <p>Loading form details...</p>
          </div>
        ) : ( 
          children
        )}
      </main>

      {/* {formTemplate && <AssessmentToolsSummary formTemplate={formTemplate} />} */}
      {/* <NotesDialog /> */}
    </div>
  );
}
