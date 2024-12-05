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
  total: z.string()
    .refine((val) => {
      // If verbal is 'T', total should be in format 'nT' where n is sum of motor and eyes
      if (val.endsWith('T')) {
        const numPart = parseInt(val.slice(0, -1));
        return !isNaN(numPart) && numPart >= 2 && numPart <= 10;
      }
      // Otherwise total should be sum of all three values
      const num = parseInt(val);
      return !isNaN(num) && num >= 3 && num <= 15;
    }, "Total must be between 3-15, or nT where n is 2-10"),
  
  motor: z.string()
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 1 && num <= 6;
    }, "Motor score must be between 1 and 6"),
  
  verbal: z.string()
    .refine((val) => {
      if (val === 'T') return true;
      const num = parseInt(val);
      return !isNaN(num) && num >= 1 && num <= 5;
    }, "Verbal score must be between 1 and 5, or 'T'"),
  
  eyes: z.string()
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 1 && num <= 4;
    }, "Eye score must be between 1 and 4"),
});

const AVPUSchema = z.object({
  // TODO: can only be A, V, P or U and should be radio button
  A: z.boolean(),
  V: z.boolean(),
  P: z.boolean(),
  U: z.boolean(),
});

const SpinalSensationSchema = z.object({
  intact: z.boolean(),
  pinsAndNeedles: z.boolean(),
  numbness: z.boolean(),
  none: z.boolean(),
  fromNeck: z.boolean(), //TODO: this is a location and should become an attribute
  nippleLine: z.boolean(), //TODO: this is a location and should become an attribute
  abd: z.boolean(), //TODO: this is a location and should become an attribute
});

const SpinalSchema = z.object({
  motorFunction: z.object({
    normal: z.boolean(),
    guarding: z.boolean(),
    loss: z.boolean(),
    //TODO: add this to the form
    deformity: z.object({
      present: z.boolean(),
      explanation: z.string().optional(),
    }),
  }),
  sensation: SpinalSensationSchema,
});

const DisabilitySchema = z.object({
  initialGCS: InitialGCSSchema,
  AVPU: AVPUSchema,
  combative: z.boolean(), //TODO: show in the form as a different section. not under AVPU.
  spinal: SpinalSchema,
});

const PrimarySurveySchema = z.object({
  airway: AirwaySchema,
  breathing: BreathingSchema,
  circulation: CirculationSchema,
  disability: DisabilitySchema,
});

export { PrimarySurveySchema };
