"use client";
import PRF_Summary from "@/components/prf-info";
import { StoreInitializer } from "@/components/store-initializer";
import PRFEditSummary from "@/components/the-prf-form/case-details-section";
import { usePrfForms } from "@/hooks/prf/usePrfForms";
import LoadingComponent from "@/components/loading";
import { DataTable } from "@/components/prf-table/data-table";
import { columns } from "@/components/prf-table/columns";
import { ViewToggle } from "@/components/prf-table/view-toggle";
import { useState } from "react";

export default function LegacyPrfPage() {
  const [view, setView] = useState<"table" | "summary">("table");
  const { data: prfs_, error, isLoading } = usePrfForms();

  // Show loading state for PRF data
  if (isLoading) {
    return <LoadingComponent message="Loading PRF data..." />;
  }

  if (!prfs_) {
    return <div>No PRFs found</div>;
  }

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      <StoreInitializer prfForms={prfs_} />
      <div className="flex flex-row items-center justify-end">
        {/* <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:block lg:text-5xl">
          Dashboard
        </h1> */}
        <div className="flex items-center gap-4">
          <ViewToggle view={view} onViewChange={setView} />
          <PRFEditSummary buttonTitle="Create a new Patient Report Form" />
        </div>
      </div>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-muted-foreground">
        Recent PRFs
      </h3>
      {view === "table" ? (
        <DataTable columns={columns} data={prfs_} />
      ) : (
        <section className="flex w-full flex-col flex-wrap items-center justify-center gap-4 p-2 lg:flex-row">
          {prfs_.map((prf) => (
            <PRF_Summary patientRecord={prf} key={prf.prfFormId} />
          ))}
        </section>
      )}
      {/* <div className="flex flex-col bg-green-600 w-full gap-4">
        {[...new Array(100)].map((_, index) => (
          <div key={index} className="h-10 w-10 bg-red-500">
            {index}
          </div>
        ))}
      </div> */}
    </div>
  );
}
