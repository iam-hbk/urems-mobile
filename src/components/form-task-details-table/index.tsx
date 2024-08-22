import { PRF_FORM, PRF_FORM_DATA } from "@/interfaces/prf-form";
import { PRFFormDataSchema } from "@/interfaces/prf-schema";
import { PRF_FORM_DATA_DISPLAY_NAMES } from "@/interfaces/prf-form";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { PRF_TABLE_SECTION_DATA } from "./schema";
import { z } from "zod";

type PRF_DATA_TASKS_COMPONENT_PROPS = {
  data: PRF_FORM;
};

export default function PRF_DATA_TASKS({
  data,
}: PRF_DATA_TASKS_COMPONENT_PROPS) {
  const prf_data: PRF_TABLE_SECTION_DATA[] = Object.entries(
    PRFFormDataSchema.shape
  ).map(([sectionKey]) => {
    const sectionSchema =
      PRFFormDataSchema.shape[sectionKey as keyof PRF_FORM_DATA];

    // Unwrap the ZodOptional to get the inner ZodObject
    const innerSchema =
      sectionSchema instanceof z.ZodOptional
        ? sectionSchema._def.innerType
        : sectionSchema;

    // Check if `isOptional` has a default value set
    const isOptional = innerSchema.shape.isOptional instanceof z.ZodDefault;

    const sectionData = data.prfData[sectionKey as keyof PRF_FORM_DATA];

    // Determine if the section is optional
    const priority = sectionData
      ? sectionData.isOptional
        ? "optional"
        : "required"
      : isOptional
      ? "required"
      : "optional";
    const route =
      sectionKey === "case_details"
        ? "#"
        : `${data.prfFormId}/${sectionKey.replace("_", "-")}`;

    return {
      sectionDescription:
        PRF_FORM_DATA_DISPLAY_NAMES[sectionKey as keyof PRF_FORM_DATA],
      priority,
      status: sectionData?.isCompleted ? "completed" : "incomplete",
      route,
    };
  });

  return <DataTable data={prf_data} columns={columns} />;
}
