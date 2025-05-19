"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FormTemplate } from "@/types/form-template";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOffIcon,
  Menu,
  Search,
  Command as CommandIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DynamicFormQuickLinks from "../../components/DynamicFormQuickLinks";
import { fetchFormTemplateById } from "../../api";
// TODO: Adapt these components or create versions for FormTemplate
// import AssessmentToolsSummary from "@/components/assessment-tools-summary";
// import NotesDialog from "@/components/the-prf-form/notes-dialog";

export default function DynamicFormLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams();
  const formId = typeof params.formId === "string" ? params.formId : "";

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

  // Filter out empty strings

  // TODO: Adapt QuickLinks, StepperView, CommandPalette for FormTemplate
  // const [showQuickLinks, setShowQuickLinks] = useState<boolean>(true);
  // const [showCommandPalette, setShowCommandPalette] = useState(false);

  return (
    <div className="flex w-full flex-col items-center overflow-auto">
      {formTemplate && formId && (
        <DynamicFormQuickLinks formTemplate={formTemplate} formId={formId} />
      )}

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
