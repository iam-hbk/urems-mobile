import CardAction from "@/components/card-action";
import { Prf_Info } from "@/components/prf-info";

export default function Home() {
  return (
    <main className="w-full p-4 flex flex-col gap-5 overflow-y-scroll">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Dashboard
      </h1>
      <section className=" p-2 flex flex-row items-center justify-center gap-4 w-full">
        <CardAction
          action="Create"
          description="Create a new Patient Report Form from Scratch"
          route="/create-prf"
        />
        <CardAction
          action="Edit"
          description="Edit an existing Patient Report Form that has not been submitted yet"
          route="/edit"
        />
      </section>
      <h3 className="scroll-m-20 text-2xl text-muted-foreground  font-semibold tracking-tight">
        Recent PRFs
      </h3>
      <section className=" p-2 flex flex-row items-center flex-wrap justify-center gap-4 w-full">
        {Array(7)
          .fill(0)
          .map((_, i) => (
            <Prf_Info key={i} />
          ))}
      </section>
    </main>
  );
}
