"use client";
import PRF_Summary from "@/components/prf-info";
import { StoreInitializer } from "@/components/store-initializer";
import PRFEditSummary from "@/components/the-prf-form/case-details-section";
import { usePrfForms } from "@/hooks/prf/usePrfForms";
import { EmployeeData } from "./profile/page";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "@/components/loading";
import { apiGetCrewEmployeeID } from "@/lib/api/crew-apis";
import { TypeCrew } from "@/interfaces/crew";
import { useZuStandCrewStore } from "@/lib/zuStand/crew";
import { DataTable } from "@/components/prf-table/data-table";
import { columns } from "@/components/prf-table/columns";
import { ViewToggle } from "@/components/prf-table/view-toggle";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/client";
import { useZuStandEmployeeStore } from "@/lib/zuStand/employee";
import { useEffect, useState } from "react";

export default function Home() {
  const [view, setView] = useState<"table" | "summary">("table");
  const { data: prfs_, error, isLoading } = usePrfForms();
  const { zsSetEmployee } = useZuStandEmployeeStore();
  const { zsSetCrewID } = useZuStandCrewStore();
  const { data: session, loading: authLoading } = authClient.useSession();

  // Use React Query for crew information
  const { data: crewData, error: crewError } = useQuery<TypeCrew | null, Error>(
    {
      queryKey: ["crew", session?.user.employeeNumber],
      queryFn: async () => {
        if (!session?.user.employeeNumber) return null;
        const res = await apiGetCrewEmployeeID(
          session.user.employeeNumber.toString(),
        );
        if (res?.data) {
          const todaysCrew = res.data.filter(
            (i: TypeCrew) =>
              new Date(i.date).toLocaleDateString() ===
              new Date().toLocaleDateString(),
          );
          return todaysCrew[0] || null;
        }
        return null;
      },
      enabled: !!session?.user.employeeNumber,
    },
  );

  // Handle crew data changes
  useEffect(() => {
    if (crewData) {
      zsSetCrewID(crewData.vehicleId);
    } else if (crewData === null && session) {
      toast.info("No crew assigned for today");
    }
  }, [crewData, session]);

  // Handle crew error
  useEffect(() => {
    if (crewError) {
      toast.error(`Error getting crew information: ${crewError.message}`);
    }
  }, [crewError]);

  // Set employee data in store
  useEffect(() => {
    if (session?.user) {
      zsSetEmployee(session.user as EmployeeData);
    }
  }, [session, zsSetEmployee]);

  // Show loading state
  if (authLoading) {
    return <LoadingComponent message="Checking authentication..." />;
  }

  // Check authentication
  if (!session?.user) {
    return null; // Let middleware handle the redirect
  }

  // Show loading state for PRF data
  if (isLoading) {
    return <LoadingComponent message="Loading PRF data..." />;
  }

  if (!prfs_) {
    return <div>No PRFs found</div>;
  }

  return (
    <main className="flex w-full flex-col gap-5 p-4">
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
    </main>
  );
}
