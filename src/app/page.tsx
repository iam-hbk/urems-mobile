"use client";
import PRF_Summary from "@/components/prf-info";
import { StoreInitializer } from "@/components/store-initializer";
import PRFEditSummary from "@/components/the-prf-form/case-details-section";
import { usePrfForms } from "@/hooks/prf/usePrfForms";
import { EmployeeData } from "./profile/page";
import { useQuery } from "@tanstack/react-query";
import { UREM__ERP_API_BASE } from "@/lib/wretch";
import { useEffect, useState } from "react";
import { useZuStandEmployeeStore } from "@/lib/zuStand/employee";
import LoadingComponent from "@/components/loading";
import { apiGetCrewEmployeeID } from "@/lib/api/crew-apis";
import { TypeCrew } from "@/interfaces/crew";
import { useZuStandCrewStore } from "@/lib/zuStand/crew";
import { DataTable } from "@/components/prf-table/data-table";
import { columns } from "@/components/prf-table/columns";
import { ViewToggle } from "@/components/prf-table/view-toggle";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

//
export default function Home() {
  const [loading_, setLoading_] = useState({
    message: "Loading",
    status: false,
  });
  const [view, setView] = useState<"table" | "summary">("table");
  const { data: prfs_, error, isLoading } = usePrfForms();
  const { zsSetEmployee, zsEmployee } = useZuStandEmployeeStore();
  const { zsSetCrewID } = useZuStandCrewStore();
  const router = useRouter();

  // loading employee profile information - here to avoid loading in the profile page
  // have to change employee number when auth is enabled
  const {
    data: employeeData,
    isLoading: loading,
    error: error_,
  } = useQuery<EmployeeData>({
    queryKey: ["employeeData", "2"],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${UREM__ERP_API_BASE}/api/Employee/EmployeeWithDetails/2`,
        );
        
        if (response.status === 404) {
          // If we already have employee data in Zustand, use that instead
          if (zsEmployee) {
            toast.info("Using cached employee data");
            return zsEmployee;
          }
          // Otherwise redirect to login
          toast.error("Please login to continue");
          router.push("/login");
          throw new Error("Please login to continue");
        }

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response.json();
      } catch (error) {
        // If we have employee data in Zustand, use that instead
        if (zsEmployee) {
          toast.info("Using cached employee data");
          return zsEmployee;
        }
        throw error;
      }
    },
    retry: false, // Don't retry on failure
  });

  // called like this to avoid errors
  async function getCrew(id: string) {
    setLoading_({
      ...loading_,
      message: "Getting Crew Information",
      status: true,
    });
    try {
      // for loading crew information
      const res = await apiGetCrewEmployeeID(id);
      // if there is dates for employee
      if (res && res.data) {
        // Find all dates that matches today's date.
        // Use this id when creating a new pr form
        const filter_: TypeCrew[] = res.data.filter(
          (i: TypeCrew) =>
            new Date(i.date).toLocaleDateString() ===
            new Date().toLocaleDateString(),
        );
        // store crewID in ZS-State Management
        // if there is no crew, the crew id, should be undefined
        if (filter_.length > 0) {
          zsSetCrewID(filter_[0].vehicleId);
        } else {
          toast.info("No crew assigned for today");
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error getting crew information: ${error.message}`);
      } else {
        toast.error("Unknown error getting crew information");
      }
    } finally {
      setLoading_({ ...loading_, status: false });
    }
  }

  useEffect(() => {
    if (employeeData) {
      zsSetEmployee(employeeData);
      getCrew(employeeData.employeeNumber.toString());
    }
  }, [employeeData, zsSetEmployee]);

  if (isLoading || loading) {
    return <LoadingComponent />;
  }

  if (!!error || !!error_) {
    if (zsEmployee) {
      // If we have employee data in Zustand, continue with the app
      toast.info("Using cached data");
    } else {
      // Otherwise redirect to login
      router.push("/login");
      return null;
    }
  }

  if (!prfs_) {
    return <div>No PRFs found</div>;
  }

  return (
    <main className="flex w-full flex-col gap-5 overflow-y-scroll p-4">
      <StoreInitializer prfForms={prfs_} />
      <div className="flex flex-row items-center justify-between">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Dashboard
        </h1>
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
    </main>
  );
}
