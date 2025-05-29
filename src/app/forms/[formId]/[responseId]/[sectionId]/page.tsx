"use client"; // Make this a client component

import { SectionFormBuilder } from "@/components/section-form-builder"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { fetchFormResponseById, fetchFormTemplateById } from "@/app/forms/api"
import { useQuery } from "@tanstack/react-query"
import { DetailedFormResponse, FormTemplate } from "@/types/form-template"
import { use } from "react";

interface SectionPageProps {
  params: Promise<{
    formId: string
    responseId: string
    sectionId: string
  }>
}

export default function SectionPage({ params }: SectionPageProps) {
  const { formId, responseId, sectionId } = use(params)

  const {
    data: formResponse,
    isLoading: isLoadingResponse,
    isError: isErrorResponse,
  } = useQuery<DetailedFormResponse | null>({
    queryKey: ["formResponse", responseId],
    queryFn: () => fetchFormResponseById(responseId),
    enabled: !!responseId,
  })

  const {
    data: formTemplate,
    isLoading: isLoadingTemplate,
    isError: isErrorTemplate,
  } = useQuery<FormTemplate | null>({
    queryKey: ["formTemplate", formId],
    queryFn: () => fetchFormTemplateById(formId),
    enabled: !!formId,
  })

  if (isLoadingResponse || isLoadingTemplate) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Loading form data...</p>
      </div>
    )
  }

  if (isErrorResponse || isErrorTemplate) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Error Loading Data</h1>
          <p className="text-muted-foreground mt-2">
            There was an error fetching the form data. Please try again later.
          </p>
          <Link href={`/forms`}>
            <Button className="mt-4">Back to Forms List</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!formResponse || !formTemplate) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Form Data Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The requested form data or template could not be found.
          </p>
          <Link href={`/forms`}>
            <Button className="mt-4">Back to Forms List</Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentSection = formTemplate.sections.find((s) => s.id === sectionId)

  if (!currentSection) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Section Not Found</h1>
          <p className="text-muted-foreground mt-2">The requested section could not be found.</p>
          <Link href={`/forms/${formId}/${responseId}`}>
            <Button className="mt-4">Back to Form Overview</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href={`/forms/${formId}/${responseId}`}>
          <Button variant="outline" className="mb-4">
            ← Back to Form Overview
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{formTemplate.title}</h1>
            <h2 className="text-xl font-semibold text-muted-foreground mt-1">{currentSection.name}</h2>
            {currentSection.description && <p className="text-muted-foreground mt-2">{currentSection.description}</p>}
          </div>
        </div>
      </div>

      <SectionFormBuilder
        section={currentSection}
        formTemplate={formTemplate}
        formId={formId}
        responseId={responseId}
        existingResponse={formResponse}
      />
    </div>
  )
}
