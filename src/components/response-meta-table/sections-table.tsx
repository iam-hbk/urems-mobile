"use client";

import { FormTemplate, DetailedFormResponse } from "@/types/form-template";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface SectionsTableProps {
  formTemplate: FormTemplate;
  formResponse: DetailedFormResponse;
  formId: string;
}

export function SectionsTable({
  formTemplate,
  formResponse,
  formId,
}: SectionsTableProps) {
  // Calculate section completion status
  const getSectionStatus = (sectionId: string) => {
    const status = formResponse.sectionStatuses?.find(
      (status) => status.sectionId === sectionId
    );
    return status?.isCompleted ?? false;
  };

  // Get total sections and completed sections count
  const totalSections = formTemplate.sections?.length ?? 0;
  const completedSections =
    formResponse.sectionStatuses?.filter((status) => status.isCompleted)
      ?.length ?? 0;

  return (
    <div className="w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Section Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[150px]">Status</TableHead>
            <TableHead className="w-[100px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formTemplate.sections?.length ? (
            formTemplate.sections.map((section) => {
              const isCompleted = getSectionStatus(section.id);
              return (
                <TableRow key={section.id}>
                  <TableCell className="font-medium">{section.name}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {section.description || "No description"}
                  </TableCell>
                  <TableCell>
                    {isCompleted ? (
                      <Badge
                        variant="default"
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" /> Completed
                      </Badge>
                    ) : section.isRequired ? (
                      <Badge
                        variant="destructive"
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <AlertCircle className="mr-1 h-3 w-3" /> Required
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-500 hover:bg-yellow-600"
                      >
                        <XCircle className="mr-1 h-3 w-3" /> Incomplete
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/forms/${formId}/${formResponse.id}/${section.id}`}
                      className="text-primary hover:underline"
                    >
                      View/Edit
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No sections found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
} 