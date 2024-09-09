import { z } from "zod";
import { PrimarySurveySchema } from "./prf-primary-survey-schema";
import { VitalSignsSchema } from "./prf-vital-signs-schema";
export const PatientDetailsSchema = z.object({
  patientName: z.string().min(2).max(50),
  patientSurname: z.string().min(2).max(50),
  age: z.number().int().positive().min(1).max(200),
  gender: z.enum(["male", "female"], {
    required_error: "You need to select a gender.",
  }),
  id: z.string().min(1).max(50),
  passport: z.string().optional(),
  nextOfKin: z.object({
    name: z.string().min(2).max(50),
    relationToPatient: z.string().min(2).max(50),
    email: z.string().email(),
    physicalAddress: z.string().min(2).max(100),
    phoneNo: z.string().min(2).max(15),
    alternatePhoneNo: z.string().optional(),
    otherNOKPhoneNo: z.string().optional(),
  }),
  medicalAid: z.object({
    name: z.string().min(2).max(50),
    number: z.string().min(1).max(50),
    principalMember: z.string().min(2).max(50),
    authNo: z.string().optional(),
  }),
  employer: z.object({
    name: z.string().min(2).max(50),
    workPhoneNo: z.string().min(2).max(15),
    workAddress: z.string().min(2).max(100),
  }),
});
export const CaseDetailsSchema = z.object({
  regionDistrict: z.string().min(2, "Region/District is required").max(50),
  base: z.string().min(2, "Base is required").max(50),
  province: z.string().min(2, "Province is required").max(50),
  rescueUnit: z.string().min(2, "Rescue Unit is required").max(50),
  rv: z.string().min(2, "RV is required").max(50),
  dateOfCase: z.date({
    required_error: "A date of birth is required.",
  }),
  dodNumber: z.string().optional(),
  ambulance: z.string().min(2, "Ambulance is required").max(50),
});

export const TransportationSchema = z.object({
  fromSuburbTown: z.string().min(1, "From Suburb/Town is required"),
  by: z.string().min(2, "By (Transport Mode) is required"),
  to: z.string().min(2, "To (Destination) is required"),
  crewDetails: z
    .array(
      z.object({
        initialAndSurname: z.string().min(2, "Initial and Surname is required"),
        HPCSANo: z.string().min(2, "This is required"),
      }),
    )
    .nonempty("At least one crew member is required"),
});
export const IncidentInformationSchema = z.object({
  sceneAddress: z.string().min(5),
  dispatchInfo: z.string().min(5),
  onArrival: z.string().min(5),
  chiefComplaint: z.string(),
  pastHistory: z.object({
    allergies: z.string(),
    medication: z.string(),
    medicalHx: z.string(),
    lastMeal: z.string(),
    cva: z.boolean(),
    epilepsy: z.boolean(),
    cardiac: z.boolean(),
    byPass: z.boolean(),
    dmOneOrTwo: z.boolean(),
    HPT: z.boolean(),
    asthma: z.boolean(),
    copd: z.boolean(),
  }),
});
export const SecondarySurveySchema = z.object({
  scalp: z.object({
    abrasion: z.boolean(),
    avulsion: z.boolean(),
    bruising: z.boolean(),
    burns: z.boolean(),
    deepWound: z.boolean(),
    GSW: z.boolean(),
    oedema: z.boolean(),
    laceration: z.boolean(),
    largeWound: z.boolean(),
    normal: z.boolean(),
  }),
  cranium: z.object({
    BOSFracture: z.boolean(),
    crepitus: z.boolean(),
    deformity: z.boolean(),
    fracture: z.boolean(),
    GSW: z.boolean(),
    frontal: z.boolean(),
    occipital: z.boolean(),
    parietal: z.boolean(),
    temporal: z.boolean(),
    normal: z.boolean(),
  }),
  face: z.object({
    abrasion: z.boolean(),
    anxious: z.boolean(),
    bloodInAirway: z.boolean(),
    bittenTongue: z.boolean(),
    bruising: z.boolean(),
    blind: z.boolean(),
    burns: z.boolean(),
    crepitus: z.boolean(),
    crying: z.boolean(),
    deformity: z.boolean(),
    deepWound: z.boolean(),
    epistaxis: z.boolean(),
    guarding: z.boolean(),
    GSW: z.boolean(),
    laceration: z.boolean(),
    largeWound: z.boolean(),
    orbitalInjury: z.boolean(),
    oedema: z.boolean(),
    normal: z.boolean(),
  }),
  neck: z.object({
    bruising: z.boolean(),
    burns: z.boolean(),
    crepitus: z.boolean(),
    deformity: z.boolean(),
    guarding: z.boolean(),
    laceration: z.boolean(),
    oedema: z.boolean(),
    penetratingWound: z.boolean(),
    normal: z.boolean(),
  }),
  spine: z.object({
    bruising: z.boolean(),
    crepitus: z.boolean(),
    deformity: z.boolean(),
    guarding: z.boolean(),
    GSW: z.boolean(),
    oedema: z.boolean(),
    penetratingWound: z.boolean(),
    sciaticPain: z.boolean(),
    normal: z.boolean(),
  }),
  chest: z.object({
    abrasion: z.boolean(),
    asymmetricalRiseAndFall: z.boolean(),
    bruising: z.boolean(),
    burns: z.boolean(),
    crepitus: z.boolean(),
    deformity: z.boolean(),
    dyspnoea: z.boolean(),
    flailSegment: z.boolean(),
    guardingPalpation: z.boolean(),
    guardingDepthOfBreathing: z.boolean(),
    GSW: z.boolean(),
    laceration: z.boolean(),
    oedema: z.boolean(),
    stabWound: z.boolean(),
    suckingWound: z.boolean(),
    normal: z.boolean(),
  }),
  abdomen: z.object({
    abrasion: z.boolean(),
    bruisingEcchymosis: z.boolean(),
    burns: z.boolean(),
    distended: z.boolean(),
    evisceration: z.boolean(),
    GSW: z.boolean(),
    guarding: z.boolean(),
    hernia: z.boolean(),
    laceration: z.boolean(),
    reboundTenderness: z.boolean(),
    rupturedMembranes: z.boolean(),
    severePain: z.boolean(),
    stabWound: z.boolean(),
    uterineContractions: z.boolean(),
    normalSoftOnPalpation: z.boolean(),
  }),
  pelvis: z.object({
    crepitus: z.boolean(),
    deformity: z.boolean(),
    guarding: z.boolean(),
    GSW: z.boolean(),
    incontinence: z.boolean(),
    openWound: z.boolean(),
    openBook: z.boolean(),
    severePain: z.boolean(),
    stable: z.boolean(),
  }),
  leftArm: z.object({
    abrasion: z.boolean(),
    amputation: z.boolean(),
    crepitus: z.boolean(),
    bruising: z.boolean(),
    deformity: z.boolean(),
    GSW: z.boolean(),
    guarding: z.boolean(),
    laceration: z.boolean(),
    oedema: z.boolean(),
    pulse: z.boolean(),
  }),
  rightArm: z.object({
    abrasion: z.boolean(),
    amputation: z.boolean(),
    crepitus: z.boolean(),
    bruising: z.boolean(),
    deformity: z.boolean(),
    GSW: z.boolean(),
    guarding: z.boolean(),
    laceration: z.boolean(),
    oedema: z.boolean(),
    pulse: z.boolean(),
  }),
  leftLeg: z.object({
    abrasion: z.boolean(),
    amputation: z.boolean(),
    crepitus: z.boolean(),
    bruising: z.boolean(),
    deformity: z.boolean(),
    GSW: z.boolean(),
    guarding: z.boolean(),
    laceration: z.boolean(),
    oedema: z.boolean(),
    pulse: z.boolean(),
  }),
  rightLeg: z.object({
    abrasion: z.boolean(),
    amputation: z.boolean(),
    crepitus: z.boolean(),
    bruising: z.boolean(),
    deformity: z.boolean(),
    GSW: z.boolean(),
    guarding: z.boolean(),
    laceration: z.boolean(),
    oedema: z.boolean(),
    pulse: z.boolean(),
  }),
  additionalFindings: z.string(),
});

export const IntravenousTherapySchema = z.object({
  therapyDetails: z.array(
    z.object({
      fluid: z.string().min(1, "Fluid is required"),
      volume: z.string().min(1, "Volume is required"),
      admin: z.string().min(1, "Admin is required"),
      rate: z.string().min(1, "Rate is required"),
      time: z.string().min(1, "Time is required"),
      jelco: z.string().min(1, "Jelco is required"),
      site: z.string().min(1, "Site is required"),
      volumeAdministered: z.string().min(1, "Volume administered is required"),
    }),
  ),
  motivationForIV: z.object({
    drugRoute: z.boolean(),
    fluidBolus: z.boolean(),
    p1Unstable: z.boolean(),
  }),
  weight: z.string().min(1, "Weight is required"),
  pawperTape: z.boolean(),
  broselowTape: z.boolean(),
});
const MedicationSchema = z.object({
  medicine: z.string().min(1, "Medicine is required"),
  dose: z.string().min(1, "Dose is required"),
  route: z.string().min(1, "Route is required"),
  time: z.string().min(1, "Time is required"),
  hpcsa: z.string().min(1, "HPCSA is required"),
  name: z.string().min(1, "Name is required"),
  signature: z.string().min(1, "Signature is required"),
});

const ConsultationSchema = z.object({
  consulted: z.boolean(),
  practitioner: z.string().optional(),
  hpcsa: z.string().optional(),
  summaryOfConsult: z.string().optional(),
});

export const MedicationAdministeredSchema = z.object({
  medications: z.array(MedicationSchema),
  consultation: ConsultationSchema,
});

export type MedicationAdministeredType = z.infer<
  typeof MedicationAdministeredSchema
>;

export const DiagnosisSchema = z.object({
  diagnosis: z.string().min(1, "Diagnosis is required"),
  priority: z.enum(["1", "2", "3", "4"], {
    required_error: "You need to select a priority.",
  }),
});

export type DiagnosisType = z.infer<typeof DiagnosisSchema>;

export const MechanismOfInjurySchema = z.object({
  vehicleType: z.enum([
    "MVA",
    "MBA",
    "PVA",
    "Bus",
    "Cyclist",
    "Taxi",
    "Train",
    "Truck",
  ]),
  impactType: z.array(
    z.enum(["Frontal Impact", "Rear", "Rollover", "T - Boned", "Vehicle Spun"]),
  ),
  speed: z.enum(["<60km/h", "60-100km/h", ">120km/h"]),
  personType: z.enum(["Driver", "Passenger", "Unknown"]),
  safetyFeatures: z.array(z.enum(["Airbags", "Restrained"])),
  incidentDetails: z.array(
    z.enum(["?↓LOC", "Multiple Patients", "P1", "or P4", "on Scene"]),
  ),
  extractionMethod: z.enum([
    "Ejected",
    "Removed by Bystander",
    "Extricated by EMS",
    "Self-Extricated",
  ]),
  helmetRemoval: z.enum(["EMS", "Self", "Bystander", "No Helmet"]),
  violenceType: z.array(
    z.enum(["Assault", "Stabbing", "Rape", "Strangulation", "Armed Robbery"]),
  ),
  otherIncidents: z.array(
    z.enum([
      "Industrial Accident",
      "Sports Injury",
      "Limited Patient Access",
      "Self-Inflicted Wounds",
      "Suicidal Tendencies",
    ]),
  ),
  falls: z.object({
    type: z.array(z.enum(["Bed", "Same Level", ">3m", ">10m"])),
    weaponType: z.array(z.enum(["GSW", "AR", "Handgun", "Rifle"])),
  }),
  entrapment: z.object({
    occurred: z.boolean(),
    duration: z.enum(["<30 Mins", "30mins-1hr", "1-2hr", ">2hr", "Unknown"]),
  }),
  crushInjury: z.boolean(),
  drowning: z.object({
    occurred: z.boolean(),
    duration: z.enum(["< 5min", "5 - 10min", "> 10min", "Unknown"]),
    type: z.array(z.enum(["Cold Water", "River / Dam", "Flood", "Pool"])),
    bystanderCPR: z.boolean(),
  }),
  burns: z.object({
    occurred: z.boolean(),
    bsa: z.enum(["<15%", ">15%"]),
    confinedSpace: z.boolean(),
    duration: z.string(),
    type: z.array(
      z.enum([
        "Chemical",
        "Electrical",
        "Flash",
        "Lightning",
        "Steam",
        "Smoke Inhalation",
        "Thermal",
      ]),
    ),
  }),
  allergicReaction: z.object({
    occurred: z.boolean(),
    symptoms: z.array(
      z.enum(["Stridor", "Wheezes", "Erythema", "Pruritus", "Urticaria"]),
    ),
    location: z.array(z.enum(["Abd", "Head", "Limbs", "Torso"])),
  }),
  poisoning: z.boolean(),
  symptoms: z.array(
    z.enum([
      "Abdominal Pain",
      "Altered LOC",
      "Bradycardia",
      "Secretions",
      "Diaphoresis",
      "Hypotension",
      "Incontinence",
      "Miosis",
      "Seizures",
      "Vomiting",
    ]),
  ),
});

export type MechanismOfInjuryType = z.infer<typeof MechanismOfInjurySchema>;
export const PRFFormDataSchema = z.object({
  case_details: z
    .object({
      isOptional: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      data: CaseDetailsSchema,
    })
    .optional(),
  patient_details: z
    .object({
      isOptional: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      data: PatientDetailsSchema,
    })
    .optional(),
  incident_information: z
    .object({
      isOptional: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      data: IncidentInformationSchema,
    })
    .optional(),
  transportation: z
    .object({
      isOptional: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      data: TransportationSchema,
    })
    .optional(),
  primary_survey: z
    .object({
      isOptional: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      data: PrimarySurveySchema,
    })
    .optional(),
  secondary_survey: z
    .object({
      isOptional: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      data: SecondarySurveySchema,
    })
    .optional(),
  vital_signs: z
    .object({
      isOptional: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      data: VitalSignsSchema.optional(),
    })
    .optional(),
  intravenous_therapy: z
    .object({
      isOptional: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      data: IntravenousTherapySchema,
    })
    .optional(),
  history_taking: z
    .object({
      isOptional: z.boolean(),
      isCompleted: z.boolean(),
      data: z.string(),
    })
    .optional(),
  physical_exam: z
    .object({
      isOptional: z.boolean(),
      isCompleted: z.boolean(),
      data: z.string(),
    })
    .optional(),
  interventions: z
    .object({
      isOptional: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      data: z.string(),
    })
    .optional(),
  diagnosis: z
    .object({
      isOptional: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      data: DiagnosisSchema,
    })
    .optional(),
  medication_administration: z
    .object({
      isOptional: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      data: MedicationAdministeredSchema,
    })
    .optional(),
  mechanism_of_injury: z
    .object({
      isOptional: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      data: MechanismOfInjurySchema,
    })
    .optional(),
  patient_handover: z
    .object({
      isOptional: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      data: z.string(),
    })
    .optional(),
  notes: z
    .object({
      isOptional: z.boolean(),
      isCompleted: z.boolean(),
      data: z.string(),
    })
    .optional(),
});

// Define the full form schema
export const PRFFormSchema = z.object({
  prfFormId: z.string().optional(),
  patientId: z.string().optional(),
  prfData: PRFFormDataSchema,
  createdAt: z.union([z.string(), z.date()]).optional(),
  isCompleted: z.boolean().default(false).optional(),
});
