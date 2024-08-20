"use client";
import CardAction from "@/components/card-action";
import { Prf_Info } from "@/components/prf-info";
import PRFEditSummary from "@/components/the-prf-form/case-details-section";
import { Button } from "@/components/ui/button";
import { usePrfForms } from "@/hooks/prf/usePrfForms";
import Link from "next/link";

export default function Home() {
  const { data: prfs_, error, isLoading } = usePrfForms();

  console.log(prfs_);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!!error) {
    return <div>{JSON.stringify(error)}</div>;
  }
  if (!prfs_) {
    return <div>No PRFs found</div>;
  }
  return (
    <main className="w-full p-4 flex flex-col gap-5 overflow-y-scroll">
      <div className="flex flex-row justify-between items-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Dashboard
        </h1>
        <div>
          <PRFEditSummary buttonTitle="Create a new Patient Report Form" />
          {/* <Button></Button> */}
        </div>
      </div>
      <h3 className="scroll-m-20 text-2xl text-muted-foreground  font-semibold tracking-tight">
        Recent PRFs
      </h3>
      <div>
        {prfs_.map((prf) => (
          <div key={prf.prfFormId}>
            <Link href={`edit-prf/${prf.prfFormId}`}>View {prf.prfFormId}</Link>
          </div>
        ))}
      </div>
      <section className=" p-2 flex flex-col lg:flex-row items-center flex-wrap justify-center gap-4 w-full">
        {Array(7)
          .fill(0)
          .map((_, i) => (
            <Prf_Info key={i} />
          ))}
      </section>
    </main>
  );
}
