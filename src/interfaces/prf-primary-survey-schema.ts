import { z } from "zod";

const AirwaySchema = z.object({
  clear: z.boolean(),
  maintained: z.boolean(),
  lateral: z.boolean(),
  intubated: z.boolean(),
  surgical: z.boolean(),
  blood: z.boolean(),
  vomit: z.boolean(),
  saliva: z.boolean(),
  FBAO: z.boolean(),
});

const TracheaSchema = z.object({
  midline: z.boolean(),
  deviated: z.boolean(),
});

const AirEntrySchema = z.object({
  clear: z.boolean(),
  diminished: z.boolean(),
  absent: z.boolean(),
});

const ExtraSoundsSchema = z.object({
  none: z.boolean(),
  soft: z.boolean(),
  loud: z.boolean(),
  wheezes: z.boolean(),
  crackles: z.boolean(),
  stridor: z.boolean(),
  frictionRub: z.boolean(),
});

const MechanicsSchema = z.object({
  accessoryMuscleUse: z.boolean(),
  apnea: z.boolean(),
  asymmetrical: z.boolean(),
  fatigue: z.boolean(),
  guarding: z.boolean(),
  normal: z.boolean(),
  hypoventilation: z.boolean(),
  ventilated: z.boolean(),
});

const NeckVeinsSchema = z.object({
  normal: z.boolean(),
  distended: z.boolean(),
});

const BreathingSchema = z.object({
  trachea: TracheaSchema,
  airEntry: AirEntrySchema,
  extraSounds: ExtraSoundsSchema,
  mechanics: MechanicsSchema,
  neckVeins: NeckVeinsSchema,
});

const HaemorrhageSchema = z.object({
  none: z.boolean(),
  arterial: z.boolean(),
  venous: z.boolean(),
  capillary: z.boolean(),
  mild: z.boolean(),
  moderate: z.boolean(),
  severe: z.boolean(),
  internal: z.boolean(),
});

const AssessmentOfPulsesSchema = z.object({
  palpableCentral: z.boolean(),
  palpablePeripherals: z.boolean(),
  weak: z.boolean(),
  absent: z.boolean(),
  strong: z.boolean(),
});

const PerfusionSchema = z.object({
  good: z.boolean(),
  poor: z.boolean(),
  none: z.boolean(),
});

const CirculationSchema = z.object({
  haemorrhage: HaemorrhageSchema,
  assessmentOfPulses: AssessmentOfPulsesSchema,
  perfusion: PerfusionSchema,
  mucosa: z.object({
    pink: z.boolean(),
    pale: z.boolean(),
    cyanosed: z.boolean(),
  }),
  CRT: z.object({
    lessThan2Sec: z.boolean(),
    moreThan2Sec: z.boolean(),
  }),
});

const InitialGCSSchema = z.object({
  total: z.string(),
  motor: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 1 && num <= 6;
  }, "Motor score must be between 1 and 6"),
  verbal: z.string().refine((val) => {
    if (val === "T") return true;
    const num = parseInt(val);
    return !isNaN(num) && num >= 1 && num <= 5;
  }, "Verbal score must be between 1 and 5, or 'T'"),
  eyes: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 1 && num <= 4;
  }, "Eye score must be between 1 and 4"),
});

const AVPUSchema = z.object({
  value: z.enum(["A", "V", "P", "U"]),
});

const SpinalSensationSchema = z.object({
  intact: z.boolean(),
  pinsAndNeedles: z.boolean(),
  numbness: z.boolean(),
  none: z.boolean(),
});

const SpinalSchema = z.object({
  motorFunction: z.object({
    normal: z.boolean(),
    guarding: z.boolean(),
    loss: z.boolean(),
    deformity: z.object({
      present: z.boolean(),
      explanation: z.string().optional(),
    }),
  }),
  sensation: SpinalSensationSchema,
});

const LocationSchema = z.object({
  fromNeck: z.boolean(),
  nippleLine: z.boolean(),
  abdomen: z.boolean(),
});

const GCSDisabilitySchema = z.object({
  assessmentType: z.literal('GCS'),
  initialGCS: InitialGCSSchema,
  AVPU: z.null(),
  combative: z.boolean(),
  spinal: SpinalSchema,
  location: LocationSchema,
});

const AVPUDisabilitySchema = z.object({
  assessmentType: z.literal('AVPU'),
  initialGCS: z.null(),
  AVPU: AVPUSchema,
  combative: z.boolean(),
  spinal: SpinalSchema,
  location: LocationSchema,
});

const DisabilitySchema = z.discriminatedUnion('assessmentType', [
  GCSDisabilitySchema,
  AVPUDisabilitySchema,
]);

const PrimarySurveySchema = z.object({
  airway: AirwaySchema,
  breathing: BreathingSchema,
  circulation: CirculationSchema,
  disability: DisabilitySchema,
});

export type { 
  SpinalSchema as SpinalSchemaType,
  LocationSchema as LocationSchemaType,
};

export { 
  PrimarySurveySchema,
  SpinalSchema,
  LocationSchema,
  InitialGCSSchema,
};
