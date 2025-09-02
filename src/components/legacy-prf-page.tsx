"use client";
import { StoreInitializer } from "@/components/store-initializer";
import PRFEditSummary from "@/components/the-prf-form/case-details-section";
import { useGetPrfForms } from "@/hooks/prf/usePrfForms";
import LoadingComponent from "@/components/loading";
import { DataTable } from "@/components/prf-table/data-table";
import { columns } from "@/components/prf-table/columns";

export default function LegacyPrfPage() {
  const { data: PRFtemplateWithResponses, isLoading } = useGetPrfForms();

  // Show loading state for PRF data
  if (isLoading) {
    return <LoadingComponent message="Loading PRF data..." />;
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-row items-center justify-start">
        <div className="flex items-center gap-4">
          <PRFEditSummary buttonTitle="Create a new Patient Report Form" />
        </div>
      </div>
      {PRFtemplateWithResponses ? (
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-muted-foreground">
          Recent PRFs
        </h3>
      ) : (
        <h3 className="scroll-m-20 text-center text-2xl font-semibold tracking-tight text-muted-foreground">
          No PRFs found, please create a new PRF
        </h3>
      )}
      {PRFtemplateWithResponses && (
        <StoreInitializer prfForms={PRFtemplateWithResponses.formResponses} />
      )}

      {PRFtemplateWithResponses && (
        <DataTable
          columns={columns}
          data={PRFtemplateWithResponses.formResponses}
        />
      )}
    </div>
  );
}
