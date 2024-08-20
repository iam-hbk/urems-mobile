"use client";
import React, { useState } from "react";
import { FormTaskDetailsTable } from "@/components/form-task-details-table";
import FormFillProgress from "@/components/progress-ring";
import PRFEditSummary from "@/components/the-prf-form/case-details-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { usePrfForms } from "@/hooks/prf/usePrfForms";

type Props = {
  params: {
    prfID: string;
  };
};

const PRF = (props: Props) => {
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
  const prf = data.find((prf) => prf.prfFormId == props.params.prfID);
  if (!prf) {
    return <div>No PRF found</div>;
  }

  return (
    <main className="w-full p-4 flex flex-col flex-grow gap-5">
      {/* Header */}
      <section className="flex flex-row  justify-between">
        <h2 className="scroll-m-20  pb-2 lg:text-3xl text-2xl font-semibold tracking-tight first:mt-0">
          {`Patient Report Form #${props.params.prfID}`}
        </h2>
        <div className="flex flex-row gap-2 items-center">
          <Button disabled={isSaving} onClick={() => {}}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Progress
              </>
            ) : (
              "Save Progress"
            )}
          </Button>
        </div>
      </section>
      {/* Form Summary */}
      <section className="p-2 gap-2 flex flex-col">
        <div className="flex justify-between items-center">
          <h3 className="scroll-m-20 text-2xl text-muted-foreground  font-semibold tracking-tight">
            Form Summary
          </h3>
          <PRFEditSummary
            initialData={prf}
            action="edit"
            buttonTitle="Edit Form Summary"

            // collectData={(data: any) => console.log("Summary Data", data)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Card className="w-full text-sm lg:text-base shadow-none flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-x-6 lg:space-y-0 p-2">
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
              max={21}
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
          <FormTaskDetailsTable prfID={props.params.prfID} />
        </div>
      </section>
      {/* Form */}
      {/* <section className="p-2 gap-2 flex flex-col">
        <h3 className="scroll-m-20 text-2xl text-muted-foreground font-semibold tracking-tight">
          Patient Report Form
        </h3>
        <div>
          <ThePrfForm formData={null} collectData={collectData} />
        </div>
      </section> */}
    </main>
  );
};

export default PRF;
