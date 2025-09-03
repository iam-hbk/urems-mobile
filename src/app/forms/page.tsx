"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFormTemplates } from "@/lib/api/dynamic-forms-api";
import LegacyPrfPage from "@/components/legacy-prf-page";
import { Separator } from "@/components/ui/separator";
import { FormsDataTable } from "@/components/forms-table/forms-data-table";

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
        <div>
          <h2 className="mb-4 text-2xl font-bold">Patient Report Forms</h2>
          <LegacyPrfPage />
        </div>
        <Separator />
        <h2 className="text-2xl font-bold">Other Forms</h2>

        {formTemplates && !formTemplates.isErr() ? (
          <FormsDataTable data={formTemplates.value} />
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No form templates found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
