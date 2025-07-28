"use client";

import { FormTemplateSummary } from "@/types/form-template";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFormTemplates } from "@/lib/api/dynamic-forms-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LegacyPrfPage from "@/components/legacy-prf-page";
import { Separator } from "@/components/ui/separator";
import { FormsDataTable } from "@/components/forms-table/forms-data-table";
import { formsColumns } from "@/components/forms-table/columns";

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
      <div className="space-y-6 p-4">
        <h2 className="text-2xl font-bold">Available Forms</h2>

        {formTemplates && !formTemplates.isErr() ? (
          <FormsDataTable columns={formsColumns} data={formTemplates.value} />
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No form templates found.</p>
          </div>
        )}

        <Separator />

        <div>
          <h2 className="mb-4 text-2xl font-bold">Legacy PRF Forms</h2>
          <LegacyPrfPage />
        </div>
      </div>
    </div>
  );
}

