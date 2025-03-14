"use client";
import React, { useState, use } from "react";
import FormFillProgress from "@/components/progress-ring";
import PRFEditSummary from "@/components/the-prf-form/case-details-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, UploadCloudIcon } from "lucide-react";
import { usePrfForms } from "@/hooks/prf/usePrfForms";
import PRF_DATA_TASKS from "@/components/form-task-details-table";
import { PRFFormDataSchema } from "@/interfaces/prf-schema";

// from +15 props are promise
// https://nextjs.org/docs/app/building-your-application/upgrading/version-15#asynchronous-page
type Params = Promise<{ prfID: string }>;

export default function Page(props: { params: Params }) {
  const params = use(props.params);
  console.log(params);
  const prfID = params.prfID;

  const { data, isLoading, error } = usePrfForms();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!!error) {
    return <div>{JSON.stringify(error)}</div>;
  }
  if (!data) {
    return <div>No PRFs found</div>;
  }
  const prf = data.find((prf) => prf.prfFormId == prfID);
  if (!prf) {
    return <div>No PRF found</div>;
  }

  return (
    <main className="flex w-full flex-grow flex-col gap-5 p-4">
      {/* Header */}
      <section className="flex flex-row justify-between">
        <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0 lg:text-3xl">
          {`Patient Report Form #${prfID}`}
        </h2>
        <div className="flex flex-row items-center gap-2">
          <Button disabled={true} onClick={() => {}}>
            {false ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting the PRF
              </>
            ) : (
              <>
                <UploadCloudIcon className="mr-2 h-4 w-4" />
                Submit PRF
              </>
            )}
          </Button>
        </div>
      </section>
      {/* Case Details */}
      <section className="flex flex-col gap-2 p-2">
        <div className="flex items-center justify-between">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-muted-foreground">
            Case Details
          </h3>
          <PRFEditSummary
            initialData={prf}
            action="edit"
            buttonTitle="Edit Case Details"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Card className="flex w-full flex-col items-center justify-between space-y-4 p-2 text-sm capitalize shadow-none lg:flex-row lg:space-x-6 lg:space-y-0 lg:text-base">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Region/District </div>
                <div className="text-muted-foreground">
                  {prf.prfData.case_details?.data.regionDistrict}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium">Base </div>
                <div className="text-muted-foreground">
                  {prf.prfData.case_details?.data.base}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium">Province </div>
                <div className="text-muted-foreground">
                  {prf.prfData.case_details?.data.province}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium">Rescue Unit </div>
                <div className="text-muted-foreground">
                  {prf.prfData.case_details?.data.rescueUnit}
                </div>
              </div>
            </div>
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">RV </div>
                <div className="text-muted-foreground">
                  {prf.prfData.case_details?.data.rv}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium">Date of Case</div>
                <div className="text-muted-foreground">
                  {prf.prfData.case_details?.data.dateOfCase
                    ? new Date(
                        prf.prfData.case_details?.data.dateOfCase,
                      ).toDateString()
                    : prf.createdAt
                      ? new Date(prf.createdAt).toDateString()
                      : "Unknown"}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium">DOD Number</div>
                <div className="text-muted-foreground">
                  {prf.prfData.case_details?.data.dodNumber}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium">Ambulance </div>
                <div className="text-muted-foreground">
                  {prf.prfData.case_details?.data.ambulance}
                </div>
              </div>
            </div>
            <FormFillProgress
              max={Object.keys(PRFFormDataSchema.shape).length}
              progress={
                Object.keys(prf.prfData).filter(
                  (key) =>
                    prf.prfData[key as keyof typeof prf.prfData]?.isCompleted,
                ).length
              }
              className="order-first lg:order-last"
            />
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
          <PRF_DATA_TASKS data={prf} />
        </div>
      </section>
    </main>
  );
}
