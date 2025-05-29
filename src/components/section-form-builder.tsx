"use client"

import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import type { Section, FormTemplate, DetailedFormResponse, FieldResponse, FieldDefinition, SubSection } from "@/types/form-template"
import { FormSubSection } from "./form-subsection"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Save, Send, ArrowLeft, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { Form } from "@/components/ui/form"
import Link from "next/link"
import { FormFieldBuilder } from "@/components/form-field"

interface SectionFormBuilderProps {
  section: Section
  formTemplate: FormTemplate
  formId: string
  responseId: string
  existingResponse?: DetailedFormResponse
}

export function SectionFormBuilder({
  section,
  formTemplate,
  formId,
  responseId,
  existingResponse,
}: SectionFormBuilderProps) {

  const [isCompleted, setIsCompleted] = useState(false)

  // Create default values from existing response for this section
  const getDefaultValues = () => {
    const defaults: Record<string, any> = {}

    if (existingResponse?.fieldResponses) {
      // Get all field definitions for this section
      const directFieldDefs = section.directFields || []
      const subSectionFieldDefs = (section.groupedSubSections || []).flatMap((ss: SubSection) => ss.fieldDefinitions)
      const allFieldDefsInSection = [...directFieldDefs, ...subSectionFieldDefs]
      const sectionFieldIds = allFieldDefsInSection.map((fd: FieldDefinition) => fd.id)

      existingResponse.fieldResponses
        .filter((response) => sectionFieldIds.includes(response.fieldDefinitionId))
        .forEach((response: FieldResponse) => {
          // Find the field definition to determine the field name
          const fieldDef = allFieldDefsInSection.find((fd: FieldDefinition) => fd.id === response.fieldDefinitionId)

          if (fieldDef) {
            const key = `${fieldDef.name}_${response.entrySequenceNumber || 0}`

            // Parse value based on field type
            switch (fieldDef.type) {
              case "Boolean":
                defaults[key] = response.value === "true"
                break
              case "Number":
                defaults[key] = response.value ? Number(response.value) : undefined
                break
              case "CheckboxGroup":
                try {
                  defaults[key] = JSON.parse(response.value)
                } catch {
                  defaults[key] = []
                }
                break
              default:
                defaults[key] = response.value
            }
          }
        })
    }

    return defaults
  }

  const form = useForm({
    defaultValues: getDefaultValues(),
  })

  // Initialize section completion status
  useEffect(() => {
    if (existingResponse?.sectionStatuses) {
      const sectionStatus = existingResponse.sectionStatuses.find((status) => status.sectionId === section.id)
      setIsCompleted(sectionStatus?.isCompleted || false)
    }
  }, [existingResponse, section.id])

  const onSubmit = async (data: any) => {
    try {
      console.log("Section submission data:", data)

      // Filter out data that doesn't belong to any field in this section
      const directFieldNames = (section.directFields || []).map(fd => fd.name);
      const subSectionFieldNames = (section.groupedSubSections || [])
        .flatMap((ss: SubSection) => ss.fieldDefinitions)
        .map(fd => fd.name);
      const allValidFieldKeysPrefixes = [...directFieldNames, ...subSectionFieldNames];
      
      const sectionData: Record<string, any> = {};
      for (const key in data) {
        // Assuming key format is fieldName_entrySequenceNumber or just fieldName
        const fieldNamePrefix = key.split('_')[0];
        if (allValidFieldKeysPrefixes.includes(fieldNamePrefix)) {
          sectionData[key] = data[key];
        }
      }
      console.log("Filtered section submission data:", sectionData);


      // Here you would typically send the data to your API
      // const response = await updateSectionResponse(responseId, section.id, sectionData)

      toast.success(`${section.name} has been saved.`)
    } catch (error) {
      toast.error("There was an error saving your section data.")
    }
  }

  const handleCompletionToggle = (checked: boolean) => {
    setIsCompleted(checked)
    // Here you would update the section status in your API
  }

  // Get navigation info
  const currentIndex = formTemplate.sections.findIndex((s) => s.id === section.id)
  const previousSection = currentIndex > 0 ? formTemplate.sections[currentIndex - 1] : null
  const nextSection = currentIndex < formTemplate.sections.length - 1 ? formTemplate.sections[currentIndex + 1] : null

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <Card className={`transition-all duration-200 ${isCompleted ? "border-green-200 bg-green-50/50" : ""}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>{section.name}</span>
                {section.isRequired && (
                  <Badge variant="destructive" className="text-xs">
                    Required
                  </Badge>
                )}
              </CardTitle>
              {section.description && <p className="text-sm text-muted-foreground mt-1">{section.description}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`section-complete-${section.id}`}
                checked={isCompleted}
                onCheckedChange={handleCompletionToggle}
              />
              <label htmlFor={`section-complete-${section.id}`} className="text-sm font-medium cursor-pointer">
                Mark as complete
              </label>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Section Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Render direct fields using FormFieldBuilder */}
          {(section.directFields || []).map((fieldDef: FieldDefinition) => (
            <FormFieldBuilder
              key={fieldDef.id}
              fieldDefinition={fieldDef}
              form={form}
              entryIndex={1}
              existingResponse={existingResponse}
            />
          ))}

          {/* Render grouped subsections */}
          {(section.groupedSubSections || []).map((subSection: SubSection) => (
            <FormSubSection
              key={subSection.id}
              subSection={subSection}
              form={form}
              responseId={responseId}
              existingResponse={existingResponse}
            />
          ))}

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex space-x-2">
              {previousSection && (
                <Link href={`/forms/${formId}/${responseId}/${previousSection.id}`}>
                  <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous: {previousSection.name}
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => form.handleSubmit(onSubmit)()}>
                <Save className="h-4 w-4 mr-2" />
                Save Section
              </Button>

              {nextSection ? (
                <Link href={`/forms/${formId}/${responseId}/${nextSection.id}`}>
                  <Button type="submit">
                    Save & Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link href={`/forms/${formId}/${responseId}`}>
                  <Button type="submit">
                    <Send className="h-4 w-4 mr-2" />
                    Save & Return to Overview
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
