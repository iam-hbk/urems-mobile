import { PRF_FORM_DATA } from "@/interfaces/prf-form";
import { PRF_FORM_DATA_DISPLAY_NAMES } from "@/interfaces/prf-form";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { PRF_TABLE_SECTION_DATA } from "./schema";
import { useGetPRFResponseSectionStatus } from "@/hooks/prf/usePrfForms";
import { usePathname } from "next/navigation";

export default function PRF_DATA_TASKS() {
  const prfID = usePathname().split("/")[2];
  const {
    data: PRFormSectionStatus,
    isLoading,
    error,
  } = useGetPRFResponseSectionStatus(prfID);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!!error) {
    return <div>Error: {error.detail}</div>;
  }
  if (!PRFormSectionStatus) {
    return <div>No PRF sections found</div>;
  }

  const prf_data: PRF_TABLE_SECTION_DATA[] = PRFormSectionStatus.sections.map(
    (section) => {
      return {
        sectionDescription:
          PRF_FORM_DATA_DISPLAY_NAMES[
            section.sectionName as keyof PRF_FORM_DATA
          ],
        priority: section.isRequired ? "required" : "optional",
        status: section.isCompleted ? "completed" : "incomplete",
        route:
          section.sectionName === "case_details"
            ? "#"
            : `${prfID}/${section.sectionName.replace(/_/g, "-")}`,
      };
    },
  );

  return <DataTable data={prf_data} columns={columns} />;
}
