"use client";

import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DetailedFormResponse,
  FormTemplate,
  Section,
} from "@/types/form-template";
import FormSectionRenderer from "@/components/dynamic-form/FormSectionRenderer";
import Link from "next/link";
import { fetchFormResponseById, fetchFormTemplateById } from "../../../api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Params = Promise<{
  formId: string;
  responseId: string;
  sectionId: string;
}>;

export default function DynamicFormSectionPage(props: { params: Params }) {
  const { formId, responseId, sectionId } = use(props.params);

  const {
    data: formTemplate,
    isLoading,
    error,
  } = useQuery<FormTemplate | null, Error>({
    queryKey: ["formTemplate", formId],
    queryFn: () => fetchFormTemplateById(formId),
    enabled: !!formId,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (use gcTime for TanStack Query v5+)
  });

  const {
    data: formResponse,
    isLoading: isLoadingResponse,
    error: responseError,
  } = useQuery<DetailedFormResponse | null, Error>({
    queryKey: ["formResponse", responseId],
    queryFn: () => fetchFormResponseById(responseId),
    enabled: !!responseId,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (use gcTime for TanStack Query v5+)
  });

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading section...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        <h1>Error Loading Form Section</h1>
        <p>Could not load form template ID: {formId}.</p>
        <p>Details: {error.message}</p>
        <Link
          href={`/forms/${formId}`}
          className="mt-4 block text-blue-500 hover:underline"
        >
          Back to full form
        </Link>
      </div>
    );
  }

  if (!formTemplate) {
    return (
      <div className="container mx-auto p-4">
        <h1>Form Template Not Found</h1>
        <p>
          Could not find form template with ID: {formId} to render section{" "}
          {sectionId}.
        </p>
        <Link
          href={`/forms`}
          className="mt-4 block text-blue-500 hover:underline"
        >
          Back to forms list
        </Link>
      </div>
    );
  }

  const currentSection = formTemplate.sections.find(
    (sec) => sec.id === sectionId,
  );

  if (!currentSection) {
    return (
      <div className="container mx-auto p-4">
        <h1>Section Not Found</h1>
        <p>
          Section with ID: {sectionId} not found in form {formTemplate.title}.
        </p>
        <Link
          href={`/forms/${formId}`}
          className="mt-4 block text-blue-500 hover:underline"
        >
          Back to full form
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex space-x-4">
        <Button variant="link" asChild>
          <Link
            href={`/forms/${formId}/${responseId}`}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to response overview
          </Link>
        </Button>
      </div>
      <FormSectionRenderer section={currentSection} />
      {/* TODO: Add navigation to next/previous section if applicable */}
      {/* TODO: Consider how form state/submission works for a single section */}
    </div>
  );
}
