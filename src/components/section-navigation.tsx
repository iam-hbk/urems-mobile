"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type {
  FormTemplate,
  DetailedFormResponse,
  Section,
  SubSection,
} from "@/types/form-template";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Circle,
  ArrowRight,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface SectionNavigationProps {
  formTemplate: FormTemplate;
  formId: string;
  responseId?: string;
  existingResponse?: DetailedFormResponse;
}

export function SectionNavigation({
  formTemplate,
  formId,
  responseId,
  existingResponse,
}: SectionNavigationProps) {
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set(),
  );

  // Initialize completed sections from existing response
  useEffect(() => {
    if (existingResponse?.sectionStatuses) {
      const completed = new Set(
        existingResponse.sectionStatuses
          .filter((status) => status.isCompleted)
          .map((status) => status.sectionId),
      );
      setCompletedSections(completed);
    }
  }, [existingResponse]);

  const totalSections = formTemplate.sections.length;
  const completedCount = completedSections.size;
  const progressPercentage =
    totalSections > 0 ? (completedCount / totalSections) * 100 : 0;

  const getSectionFieldCount = useCallback(
    (sectionId: string) => {
      const section = formTemplate.sections.find((s) => s.id === sectionId);
      if (!section) return 0;

      let count = 0;
      if (section.directFields) {
        count += section.directFields.length;
      }

      const countFieldsInSubSections = (
        subSections: SubSection[] | null,
      ): number => {
        if (!subSections) return 0;
        return subSections.reduce((total, subSection) => {
          let subTotal = subSection.fieldDefinitions.length;
          if (subSection.childSubSections) {
            subTotal += countFieldsInSubSections(subSection.childSubSections);
          }
          return total + subTotal;
        }, 0);
      };

      if (section.groupedSubSections) {
        count += countFieldsInSubSections(section.groupedSubSections);
      }

      return count;
    },
    [formTemplate.sections],
  );

  const getSectionUrl = (sectionId: string) => {
    if (responseId) {
      return `/forms/${formId}/${responseId}/${sectionId}`;
    }
    return "#"; // Return a default or placeholder URL
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Form Progress</span>
            <Badge
              variant={
                completedCount === totalSections ? "default" : "secondary"
              }
            >
              {completedCount}/{totalSections} sections completed
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex justify-between text-sm text-muted-foreground">
                <span>Overall completion</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {responseId && (
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    Last updated:{" "}
                    {existingResponse
                      ? new Date(existingResponse.updatedAt).toLocaleString()
                      : "Never"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section List */}
      <div className="grid gap-4">
        {formTemplate.sections.map((section, index) => {
          const isCompleted = completedSections.has(section.id);
          const fieldCount = getSectionFieldCount(section.id);

          return (
            <Card
              key={section.id}
              className={`transition-all duration-200 hover:shadow-md ${isCompleted ? "border-green-200 bg-green-50/50" : ""}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{section.name}</span>
                        {section.isRequired && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </CardTitle>
                      {section.description && (
                        <CardDescription className="mt-1">
                          {section.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right text-sm text-muted-foreground">
                      <div>{fieldCount} fields</div>
                      <div>
                        {section.groupedSubSections?.length} subsections
                      </div>
                    </div>
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : section.isRequired ? (
                      <AlertCircle className="h-6 w-6 text-orange-500" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {section.groupedSubSections?.map(
                      (subSection: SubSection) => (
                        <Badge
                          key={subSection.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {subSection.name}
                          {subSection.isRepeatable && " (Repeatable)"}
                        </Badge>
                      ),
                    )}
                  </div>

                  <Link href={getSectionUrl(section.id)}>
                    <Button className="ml-4">
                      {isCompleted ? "Review" : "Start"} Section
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Form Actions */}
      {responseId && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {completedCount === totalSections
                  ? "All sections completed! You can now submit the form."
                  : `${totalSections - completedCount} sections remaining`}
              </div>
              <div className="space-x-2">
                <Button variant="outline">Save Draft</Button>
                <Button disabled={completedCount !== totalSections}>
                  Submit Form
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
