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
type Props = Promise<{
  params: {
    prfID: string;
  };
}>;

export default async function Page(props: { params: Props }) {
  // const { prfID } = (await props.params).params; // server
  const prfID = use(props.params).params.prfID


  const { data, isLoading, error } = usePrfForms();
  const [isSaving, setIsSaving] = useState(false);


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
    (<main className="w-full p-4 flex flex-col flex-grow gap-5">
      {/* Header */}
      <section className="flex flex-row  justify-between">
        <h2 className="scroll-m-20  pb-2 lg:text-3xl text-2xl font-semibold tracking-tight first:mt-0">
          {`Patient Report Form #${prfID}`}
        </h2>
        <div className="flex flex-row gap-2 items-center">
          <Button disabled={isSaving} onClick={() => { }}>
            {isSaving ? (
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
      <section className="p-2 gap-2 flex flex-col">
        <div className="flex justify-between items-center">
          <h3 className="scroll-m-20 text-2xl text-muted-foreground  font-semibold tracking-tight">
            Case Details
          </h3>
          <PRFEditSummary
            initialData={prf}
            action="edit"
            buttonTitle="Edit Case Details"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Card className="w-full capitalize text-sm lg:text-base shadow-none flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-x-6 lg:space-y-0 p-2">
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-between">
                <div className=" font-medium">Region/District </div>
                <div className=" text-muted-foreground">
                  {prf.prfData.case_details?.data.regionDistrict}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className=" font-medium">Base </div>
                <div className=" text-muted-foreground">
                  {prf.prfData.case_details?.data.base}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className=" font-medium">Province </div>
                <div className=" text-muted-foreground">
                  {prf.prfData.case_details?.data.province}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className=" font-medium">Rescue Unit </div>
                <div className=" text-muted-foreground">
                  {prf.prfData.case_details?.data.rescueUnit}
                </div>
              </div>
            </div>
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-between">
                <div className=" font-medium">RV </div>
                <div className=" text-muted-foreground">
                  {prf.prfData.case_details?.data.rv}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className=" font-medium">Date of Case</div>
                <div className=" text-muted-foreground">
                  {prf.prfData.case_details?.data.dateOfCase
                    ? new Date(
                      prf.prfData.case_details?.data.dateOfCase
                    ).toDateString()
                    : prf.createdAt
                      ? new Date(prf.createdAt).toDateString()
                      : "Unknown"}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className=" font-medium">DOD Number</div>
                <div className=" text-muted-foreground">
                  {prf.prfData.case_details?.data.dodNumber}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className=" font-medium">Ambulance </div>
                <div className=" text-muted-foreground">
                  {prf.prfData.case_details?.data.ambulance}
                </div>
              </div>
            </div>
            <FormFillProgress
              max={Object.keys(PRFFormDataSchema.shape).length}
              progress={
                Object.keys(prf.prfData).filter(
                  (key) =>
                    prf.prfData[key as keyof typeof prf.prfData]?.isCompleted
                ).length
              }
              className="order-first lg:order-last"
            />
          </Card>
        </div>
      </section>
      {/* Task Details Table */}{" "}
      <section className="p-2 gap-2 flex flex-col">
        <div>
          <h3 className="scroll-m-20 text-2xl text-muted-foreground font-semibold tracking-tight">
            Task Details
          </h3>
        </div>
        <div className="lg:px-16 flex flex-col items-center">
          <PRF_DATA_TASKS data={prf} />
        </div>
      </section>
    </main>)
  );
};