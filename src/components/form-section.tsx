"use client"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import type { Section, DetailedFormResponse } from "@/types/form-template"
import { FormSubSection } from "./form-subsection"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronRight, CheckCircle, Circle } from "lucide-react"

interface FormSectionProps {
  section: Section
  form: UseFormReturn<any>
  isCompleted: boolean
  onSectionComplete: (isCompleted: boolean) => void
  responseId?: string
  existingResponse?: DetailedFormResponse
}

export function FormSection({
  section,
  form,
  isCompleted,
  onSectionComplete,
  responseId,
  existingResponse,
}: FormSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const handleCompletionToggle = (checked: boolean) => {
    onSectionComplete(checked)
  }

  return (
    <Card className={`transition-all duration-200 ${isCompleted ? "border-green-200 bg-green-50/50" : ""}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="p-1">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
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
          </div>

          <div className="flex items-center space-x-2">
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
            {isCompleted ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-6">
            {section.groupedSubSections?.map((subSection) => (
              <FormSubSection
                key={subSection.id}
                subSection={subSection}
                form={form}
                responseId={responseId}
                existingResponse={existingResponse}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
