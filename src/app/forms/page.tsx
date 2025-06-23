"use client";

import { FormTemplateSummary } from "@/types/form-template";
import Link from "next/link";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFormTemplates } from "@/lib/api/dynamic-forms-api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FormsListPage() {
  const {
    data: formTemplates,
    isLoading: isLoadingTemplates,
    error: templatesError,
  } = useQuery({
    queryKey: ["formTemplates"],
    queryFn: fetchFormTemplates,
  });

  if (formTemplates && formTemplates.isErr()) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        Error loading forms: {formTemplates.error.detail}
      </div>
    );
  }
  if (isLoadingTemplates) {
    return (
      <div className="container mx-auto p-4">Loading available forms...</div>
    );
  }

  if (templatesError) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        Error loading forms: {templatesError.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Available Forms</CardTitle>
        </CardHeader>
        <CardContent>
          {!formTemplates || formTemplates.value.length === 0 ? (
            <p>No form templates found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Form Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formTemplates.value.map((template) => (
                  <TableRow key={template.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">
                      {template.title}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {template.description}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(template.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/forms/${template.id}`}
                        className="font-medium text-indigo-600 hover:text-indigo-900"
                      >
                        Open Form Details
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
