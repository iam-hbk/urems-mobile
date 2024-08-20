import { sectionDescriptions } from "@/interfaces/prf-form";
import { z } from "zod";

export const prfDataSchema = z.object({
  sectionDescription: z.enum(sectionDescriptions),
  priority: z.enum(["required", "optional"]),
  status: z.enum(["completed", "incomplete"]),
  route: z.string(),
});

export type PRF_TABLE_SECTION_DATA = z.infer<typeof prfDataSchema>;
