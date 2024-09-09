"use client"
import PRF_Summary from "@/components/prf-info";
import { StoreInitializer } from "@/components/store-initializer";
import PRFEditSummary from "@/components/the-prf-form/case-details-section";
import TimePicker from "@/components/time-picker";
import { Button } from "@/components/ui/button";
import { usePrfForms } from "@/hooks/prf/usePrfForms";
import Link from "next/link";

export default function Home() {
  const { data: prfs_, error, isLoading } = usePrfForms();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!!error) {
    return <div>{JSON.stringify(error)}</div>;
  }
  if (!prfs_) {
    return <div>No PRFs found</div>;
  }
  console.log(prfs_);
  return (
    <main className="flex w-full flex-col gap-5 overflow-y-scroll p-4">
      <StoreInitializer prfForms={prfs_} />
      <div className="flex flex-row items-center justify-between">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Dashboard
        </h1>
        <div>
          <PRFEditSummary buttonTitle="Create a new Patient Report Form" />
          {/* <Button></Button> */}
        </div>
      </div>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-muted-foreground">
        Recent PRFs
      </h3>
      {/* <div>
        <TimePicker />
        <canvas className="border" id="cd_sign_admin_canvas" width="600" height="300"></canvas>
      </div> */}
      <section className="flex w-full flex-col flex-wrap items-center justify-center gap-4 p-2 lg:flex-row">
        {prfs_.map((prf) => (
          <PRF_Summary patientRecord={prf} key={prf.prfFormId} />
        ))}
      </section>
    </main>
  );
}
