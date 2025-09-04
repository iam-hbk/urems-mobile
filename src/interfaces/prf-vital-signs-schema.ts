import { z } from "zod";

const AirEntrySchema = z.object({
  left: z.enum(["✓", "↓", "x"]).optional(),
  right: z.enum(["✓", "↓", "x"]).optional(),
});

const PupilReactionSchema = z.object({
  left: z.enum(["Normal", "Sluggish", "Non-reactive"]),
  right: z.enum(["Normal", "Sluggish", "Non-reactive"]),
});

const PupilSizeSchema = z.object({
  left: z.string(),
  right: z.string(),
});

const VitalSignsEntrySchema = z.object({
  // location: z.enum(["On scene", "On route", "On handover"]),
  airEntry: AirEntrySchema,
  etCO2: z.number(),
  fiO2: z.number(),
  rate: z.number(),
  rhythm: z.string().min(3),
  spO2: z.number(),
  bloodPressure: z.string().min(3),
  ecgAnalysis: z.string().min(3),
  heartRate: z.number(),
  perfusion: z.string().min(3),
  gcsAvpu: z.union([z.string(), z.enum(["A", "V", "P", "U"])]),
  glucose: z.number().nullable(),
  painScore: z.number().min(0).max(10).nullable(),
  pupilReaction: PupilReactionSchema,
  pupilSize: PupilSizeSchema,
  temperature: z.number().nullable(),
  time: z.string(),
});

const VitalSignsSchema = z.object({
  vital_signs: z.array(VitalSignsEntrySchema),
});

export type VitalSignsType = z.infer<typeof VitalSignsSchema>;
export type VitalSignsEntryType = z.infer<typeof VitalSignsEntrySchema>;
export { VitalSignsSchema, VitalSignsEntrySchema };
