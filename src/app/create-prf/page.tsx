import FormFillProgress from "@/components/progress-ring";
import { Stepper } from "@/components/stepper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React from "react";

type Props = {};

const PRF = (props: Props) => {
  return (
    <main className="w-full p-4 flex flex-col gap-5 overflow-y-scroll">
      {/* Header */}
      <section className="flex flex-row border justify-between">
        <h2 className="scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Create a new Patient Report Form
        </h2>
        <div className="flex flex-row gap-2 items-center">
          <Button variant={"outline"}>View Progress</Button>
          <Button>Save Progress</Button>
        </div>
      </section>
      {/* Form Summary */}
      <section className="p-2">
        <div className="flex justify-between items-center">
          <h3 className="scroll-m-20 text-2xl text-muted-foreground  font-semibold tracking-tight">
            Form Summary
          </h3>
          <Button variant={"outline"}>Edit </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Card className="w-full shadow-none flex flex-row justify-between gap-8 p-2">
            <div className="grid w-full">
              <div className="flex items-center justify-between">
                <div className=" font-medium">Region/District </div>
                <div className=" text-muted-foreground">Joburg Central</div>
              </div>
              <div className="flex items-center justify-between">
                <div className=" font-medium">Base </div>
                <div className=" text-muted-foreground">Parkstation</div>
              </div>
              <div className="flex items-center justify-between">
                <div className=" font-medium">Province </div>
                <div className=" text-muted-foreground">Gauteng</div>
              </div>
              <div className="flex items-center justify-between">
                <div className=" font-medium">Rescue Unit </div>
                <div className=" text-muted-foreground">Rescue 1</div>
              </div>
            </div>
            <div className="grid w-full">
              <div className="flex items-center justify-between">
                <div className=" font-medium">RV </div>
                <div className=" text-muted-foreground">RV-001</div>
              </div>
              <div className="flex items-center justify-between">
                <div className=" font-medium">Date of Case</div>
                <div className=" text-muted-foreground">2024-08-06</div>
              </div>
              <div className="flex items-center justify-between">
                <div className=" font-medium">DOD Number</div>
                <div className=" text-muted-foreground">123456789</div>
              </div>
              <div className="flex items-center justify-between">
                <div className=" font-medium">Ambulance </div>
                <div className=" text-muted-foreground">
                  Braamfontein Ambulance
                </div>
              </div>
            </div>
            <FormFillProgress max={21} progress={6} />
          </Card>
        </div>
      </section>
      {/* Form */}

      {/* <Stepper /> */}
    </main>
  );
};

export default PRF;
