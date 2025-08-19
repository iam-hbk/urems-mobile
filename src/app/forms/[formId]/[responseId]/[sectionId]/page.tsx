import { SectionFormBuilder } from "@/components/section-form-builder";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchFormTemplateById } from "@/lib/api/dynamic-forms-api";
import { notFound } from "next/navigation";
import { ClientSectionPage } from "./client-section-page";

interface SectionPageProps {
  params: Promise<{
    formId: string;
    responseId: string;
    sectionId: string;
  }>;
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { formId, responseId, sectionId } = await params;
  
  // Fetch form template server-side (no loading state needed)
  const formTemplateResult = await fetchFormTemplateById(formId);
  
  if (formTemplateResult.isErr()) {
    console.error("❌ Failed to fetch form template:", formTemplateResult.error);
    notFound();
  }
  
  const formTemplate = formTemplateResult.value;
  
  // Validate that the section exists
  const currentSection = formTemplate.sections.find((s) => s.id === sectionId);
  
  if (!currentSection) {
    console.error("❌ Section not found:", { sectionId, availableSections: formTemplate.sections.map(s => s.id) });
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={`/forms/${formId}/${responseId}`}>
          <Button variant="outline" className="mb-4">
            ← Back to Form Overview
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{formTemplate.title}</h1>
            <h2 className="mt-1 text-xl font-semibold text-muted-foreground">
              {currentSection.name}
            </h2>
            {currentSection.description && (
              <p className="mt-2 text-muted-foreground">
                {currentSection.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Client component that only fetches the response */}
      <ClientSectionPage
        section={currentSection}
        formTemplate={formTemplate}
        formId={formId}
        responseId={responseId}
      />
    </div>
  );
}
