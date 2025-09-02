"use client";
import React, { use } from "react";
import FormFillProgress from "@/components/progress-ring";
import PRFEditSummary from "@/components/the-prf-form/case-details-section";
import { Card } from "@/components/ui/card";
import {
  useGetPRFResponseMetadata,
  useGetPRFResponseSectionByName,
} from "@/hooks/prf/usePrfForms";
import PRF_DATA_TASKS from "@/components/form-task-details-table";
import { SubmitPrfButton } from "@/components/submit-prf-button";

type Params = Promise<{ prfID: string }>;

export default function Page(props: { params: Params }) {
  const params = use(props.params);
  const prfID = params.prfID;

  const {
    data: prfResponseMetadata,
    isLoading,
    error,
  } = useGetPRFResponseMetadata(prfID);
  const { data: case_details } = useGetPRFResponseSectionByName(
    prfID,
    "case_details",
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!!error) {
    return <pre className="max-w-sm">{JSON.stringify(error, null, 2)}</pre>;
  }
  if (!prfResponseMetadata) {
    return <div>No PRFs found</div>;
  }
  if (prfResponseMetadata === undefined) {
    return <div>No PRF found</div>;
  }

  return (
    <main className="flex w-full flex-grow flex-col gap-5 p-4">
      {/* Header */}
      <section className="flex flex-row justify-between">
        <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0 lg:text-3xl">
          {`Patient Report Form #${prfID.split("-")[0]}`}
        </h2>
        <div className="flex flex-row items-center gap-2">
          <SubmitPrfButton
            responseStatus={
              prfResponseMetadata.isCompleted ? "completed" : "draft"
            }
          />
        </div>
      </section>
      {/* Case Details */}
      <section className="flex flex-col gap-2 p-2">
        <div className="flex items-center justify-between">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-muted-foreground">
            Case Details
          </h3>
          <PRFEditSummary
            action="edit"
            buttonTitle="Edit Case Details"
            prfResponseId={prfResponseMetadata.responseId}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Card className="flex w-full flex-col items-center justify-between space-y-4 p-2 text-sm capitalize shadow-none lg:flex-row lg:space-x-6 lg:space-y-0 lg:text-base">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Region/District </div>
                <div className="text-muted-foreground">
                  {case_details?.data.regionDistrict}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium">Base </div>
                <div className="text-muted-foreground">
                  {case_details?.data.base}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium">Province </div>
                <div className="text-muted-foreground">
                  {case_details?.data.province}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium">Date of Case</div>
                <div className="text-muted-foreground">
                  {case_details?.data.dateOfCase
                    ? new Date(case_details.data.dateOfCase).toDateString()
                    : prfResponseMetadata.createdAt
                      ? new Date(prfResponseMetadata.createdAt).toDateString()
                      : "Unknown"}
                </div>
              </div>
            </div>
            <FormFillProgress className="order-first lg:order-last" />
          </Card>
        </div>
      </section>
      {/* Task Details Table */}{" "}
      <section className="flex flex-col gap-2 p-2">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-muted-foreground">
            Task Details
          </h3>
        </div>
        <div className="flex flex-col items-center lg:px-16">
          <PRF_DATA_TASKS />
        </div>
      </section>
    </main>
  );
}
