import { z } from "zod";
import { PrimarySurveySchema } from "./prf-primary-survey-schema";
import { VitalSignsSchema } from "./prf-vital-signs-schema";

export const PatientDetailsSchema = z
  .object({
    unableToObtainInformation: z.object({
      status: z.boolean().default(false),
      estimatedAge: z.number().optional(),
      notes: z.string().optional(),
    }),
    age: z.number().optional(),
    ageUnit: z.enum(["years", "months", "days"]).default("years"),
    gender: z.enum(["male", "female"]).optional(),
    patientName: z.string().optional(),
    patientSurname: z.string().optional(),
    id: z.string().optional(),
    passport: z.string().optional(),

    // ------------------------------------
    nextOfKin: z
      .object({
        name: z.string(),
        relationToPatient: z.string(),
        email: z.string().email().optional(),
        physicalAddress: z.string(),
        phoneNo: z.string(),
        alternatePhoneNo: z.string().optional(),
        otherNOKPhoneNo: z.string().optional(),
      })
      .optional(),
    medicalAid: z
      .object({
        name: z.string(),
        number: z.string(),
        principalMember: z.string(),
        authNo: z.string().optional(),
      })
      .optional(),
    employer: z
      .object({
        name: z.string(),
        workPhoneNo: z.string(),
        workAddress: z.string(),
      })
      .optional(),
    pastHistory: z
      .object({
        allergies: z.string().optional(),
        medication: z.string().optional(),
        medicalHx: z.string().optional(),
        lastMeal: z.string().optional(),
        cva: z.boolean().default(false),
        epilepsy: z.boolean().default(false),
        cardiac: z.boolean().default(false),
        byPass: z.boolean().default(false),
        dmOneOrTwo: z.boolean().default(false),
        HPT: z.boolean().default(false),
        asthma: z.boolean().default(false),
        copd: z.boolean().default(false),
      })
      .optional(),
  })
  .superRefine((val, ctx) => {
    // Skip validation if unable to obtain information
    if (val.unableToObtainInformation.status === true) return true;

    // Check required fields when able to obtain information
    if (val.age === undefined || val.age === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Age is required when able to obtain patient information",
        path: ["age"],
      });
    }

    if (!val.gender) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Gender is required when able to obtain patient information",
        path: ["gender"],
      });
    }

    if (!val.patientName || val.patientName.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Patient name is required when able to obtain patient information",
        path: ["patientName"],
      });
    }

    if (!val.patientSurname || val.patientSurname.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Patient surname is required when able to obtain patient information",
        path: ["patientSurname"],
      });
    }
  });

export type PatientDetailsType = z.infer<typeof PatientDetailsSchema>;

export const CaseDetailsSchema = z.object({
  regionDistrict: z.string().min(2, "Region/District is required").max(50),
  base: z.string().min(2, "Base is required").max(50),
  province: z.string().min(2, "Province is required").max(50),
  vehicle: z.object(
    {
      id: z.string({
        required_error: "Vehicle ID is required",
        invalid_type_error: "Vehicle ID must be a string",
      }),
      name: z
        .string({
          required_error: "Vehicle name is required",
          invalid_type_error: "Vehicle name must be a string",
        })
        .min(2, "Vehicle name must be at least 2 characters"),
      license: z
        .string({
          required_error: "Vehicle license is required",
          invalid_type_error: "Vehicle license must be a string",
        })
        .min(2, "Vehicle license must be at least 2 characters"),
      registrationNumber: z
        .string({
          required_error: "Vehicle registration number is required",
          invalid_type_error: "Vehicle registration number must be a string",
        })
        .min(2, "Vehicle registration number must be at least 2 characters"),
    },
    {
      required_error: "Vehicle information is required",
      invalid_type_error: "Invalid vehicle information format",
    },
  ),
  dateOfCase: z.date({
    required_error: "A date of birth is required.",
  }),
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
});
export const SecondarySurveySchema = z.object({
  scalp: z.object({
    abrasion: z.boolean(),
    avulsion: z.boolean(),
    bruising: z.boolean(),
    burns: z.boolean(),
    deepWound: z.boolean(),
    GunShotWound: z.boolean(),
    PenetratingWound: z.boolean(),
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
    GunShotWound: z.boolean(),
    PenetratingWound: z.boolean(),
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
    GunShotWound: z.boolean(),
    PenetratingWound: z.boolean(),
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
    GunShotWound: z.boolean(),
    PenetratingWound: z.boolean(),
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
    GunShotWound: z.boolean(),
    PenetratingWound: z.boolean(),
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
    GunShotWound: z.boolean(),
    PenetratingWound: z.boolean(),
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
    GunShotWound: z.boolean(),
    PenetratingWound: z.boolean(),
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
    GunShotWound: z.boolean(),
    PenetratingWound: z.boolean(),
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
    GunShotWound: z.boolean(),
    PenetratingWound: z.boolean(),
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
    GunShotWound: z.boolean(),
    PenetratingWound: z.boolean(),
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
    GunShotWound: z.boolean(),
    PenetratingWound: z.boolean(),
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
      fluid: z.string().min(1, "Fluid type is required"),
      fluidId: z.string().optional(), // Optional because custom fluids won't have an ID
      volume: z.number().min(0, "Volume must be a positive number"),
      admin: z.enum([
        "10dropper",
        "20dropper",
        "60dropper",
        "extensionSet",
        "buretteSet",
        "bloodAdminSet",
      ]),
      rate: z.string().min(1, "Rate is required"),
      time: z.object({
        value: z.string(),
        unknown: z.boolean(),
      }),
      jelco: z.enum(["14G", "16G", "18G", "20G", "22G", "24G"]),
      site: z.enum([
        "Right Antecubital",
        "Left Antecubital",
        "Right Hand",
        "Left Hand",
        "Right Forearm",
        "Left Forearm",
        "Right Foot",
        "Left Foot",
        "Right External Jugular",
        "Left External Jugular",
        "Scalp",
      ]),
      volumeAdministered: z
        .number()
        .min(0, "Volume administered must be a positive number"),
    }),
  ),
  motivationForIV: z.object({
    drugRoute: z.boolean(),
    fluidBolus: z.boolean(),
    p1Unstable: z.boolean(),
    p1Stable: z.boolean(),
  }),
  weight: z.string(),
  weightMeasurementType: z.enum(["estimated", "pawper", "broselow"]),
});

const MedicationSchema = z.object({
  medicine: z.string().min(1, "Medicine is required"),
  medicationId: z.string().optional(), // Optional because custom medications won't have an ID
  dose: z.string().min(1, "Dose is required"),
  route: z.string().min(1, "Route is required"),
  time: z.object({
    value: z.string().min(1, "Time is required"),
    unknown: z.boolean(),
  }),
  hpcsa: z.string().min(1, "HPCSA is required"),
  name: z.string().min(1, "Name is required"),
  signature: z.string().min(1, "Signature is required"),
});

const ConsultationSchema = z
  .object({
    consulted: z.boolean(),
    practitioner: z.string(),
    hpcsa: z.string(),
    summaryOfConsult: z.string(),
  })
  .refine(
    (data) => {
      if (!data.consulted) return true;
      return !!data.practitioner && !!data.hpcsa && !!data.summaryOfConsult;
    },
    {
      message:
        "Practitioner name, HPCSA number, and consultation summary are required when consulted is checked",
      path: ["consulted"], // shows error on the consulted checkbox
    },
  );

export const MedicationAdministeredSchema = z.object({
  medications: z.array(MedicationSchema),
  consultation: ConsultationSchema,
});

export type MedicationAdministeredType = z.infer<
  typeof MedicationAdministeredSchema
>;

export const DiagnosisSchema = z.object({
  diagnosis: z.string().min(1, "Diagnosis is required"),
  priorityType: z.enum(["number", "color"]).default("number"),
  priority: z.union([
    z.enum(["1", "2", "3", "4"], {
      required_error: "You need to select a priority.",
    }),
    z.enum(["red", "yellow", "orange", "green", "blue"], {
      required_error: "You need to select a priority color.",
    }),
  ]),
  allergicReaction: z
    .object({
      occurred: z.boolean().optional(),
      symptoms: z
        .array(
          z.enum(["stridor", "wheezes", "erythema", "pruritus", "urticaria"]),
        )
        .optional(),
      location: z.array(z.enum(["abd", "head", "limbs", "torso"])).optional(),
    })
    .optional(),
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

export type DiagnosisType = z.infer<typeof DiagnosisSchema>;

export const MechanismOfInjurySchema = z.object({
  vehicleType: z.object({
    occured: z.boolean().optional(),
    vehicleTypesSelection: z
      .enum([
        "MVA",
        "MBA",
        "PVA",
        "Bus",
        "Cyclist",
        "Taxi",
        "Train",
        "Truck",
        "Aircraft",
      ])
      .optional(),
  }),
  impactType: z
    .array(
      z.enum([
        "Frontal Impact",
        "Rear",
        "Rollover",
        "T - Boned",
        "Vehicle Spun",
      ]),
    )
    .optional(),
  speed: z.enum(["<60km/h", "60-100km/h", ">120km/h"]).optional(),
  personType: z.enum(["Driver", "Passenger", "Unknown"]).optional(),
  safetyFeatures: z.array(z.enum(["Airbags", "Restrained"])).optional(),
  incidentDetails: z
    .array(z.enum(["?↓LOC", "Multiple Patients", "P1", "or P4", "on Scene"]))
    .optional(),
  extractionMethod: z
    .enum([
      "Ejected",
      "Removed by Bystander",
      "Extricated by EMS",
      "Self-Extricated",
    ])
    .optional(),
  helmetRemoval: z.enum(["EMS", "Self", "Bystander", "No Helmet"]).optional(),
  violenceType: z
    .array(
      z.enum(["Assault", "Stabbing", "Rape", "Strangulation", "Armed Robbery"]),
    )
    .optional(),
  otherIncidents: z
    .array(
      z.enum([
        "Industrial Accident",
        "Sports Injury",
        "Limited Patient Access",
        "Self-Inflicted Wounds",
        "Suicidal Tendencies",
      ]),
    )
    .optional(),
  falls: z
    .object({
      type: z.array(z.enum(["Bed", "Same Level", ">3m", ">10m"])).optional(),
      weaponType: z
        .array(z.enum(["Gun Shot Wound", "AR", "Handgun", "Rifle"]))
        .optional(),
    })
    .optional(),
  entrapment: z
    .object({
      occurred: z.boolean().optional(),
      duration: z
        .enum(["<30 Mins", "30mins-1hr", "1-2hr", ">2hr", "Unknown"])
        .optional(),
    })
    .optional(),
  crushInjury: z.boolean().optional(),
  drowning: z
    .object({
      occurred: z.boolean().optional(),
      duration: z
        .enum(["< 5min", "5 - 10min", "> 10min", "Unknown"])
        .optional(),
      type: z
        .array(z.enum(["Cold Water", "River / Dam", "Flood", "Pool"]))
        .optional(),
      bystanderCPR: z.boolean().optional(),
    })
    .optional(),
  burns: z
    .object({
      occurred: z.boolean().optional(),
      bsa: z.enum(["<15%", ">15%"]).optional(),
      confinedSpace: z.boolean().optional(),
      duration: z.string().default(""),
      type: z
        .array(
          z.enum([
            "Chemical",
            "Electrical",
            "Flash",
            "Lightning",
            "Steam",
            "Smoke Inhalation",
            "Thermal",
          ]),
        )
        .optional(),
    })
    .optional(),
});

export type MechanismOfInjuryType = z.infer<typeof MechanismOfInjurySchema>;

export const ProceduresSchema = z.object({
  airway: z.object({
    ett: z.boolean(),
    ettSize: z.number().optional(),
    depth: z.number().optional(),
    ettCuffPressure: z.enum([
      "20-30cmH2O",
      "Cuff Not Inflated",
      "Not Measured",
    ]),
    gastricTube: z.boolean(),
    iGel: z.boolean(),
    lma: z.boolean(),
    lta: z.boolean(),
    lateral: z.boolean(),
    needleAirway: z.boolean(),
    opa: z.boolean(),
    rsi: z.boolean(),
    suction: z.boolean(),
    surgicalCric: z.boolean(),
  }),
  alignment: z.object({
    extrication: z.boolean(),
    headblocks: z.boolean(),
    ked: z.boolean(),
    logroll: z.boolean(),
    mils: z.boolean(),
    scoop: z.boolean(),
    spiderHarness: z.boolean(),
    spineboard: z.boolean(),
    splint: z.boolean(),
    tracIii: z.boolean(),
  }),
  breathing: z.object({
    bvm: z.boolean(),
    chestDecompression: z.boolean(),
    cpap: z.boolean(),
    etco2: z.boolean(),
    icd: z.boolean(),
    l: z.boolean(),
    r: z.boolean(),
    date: z.date().optional(),
    oxygen: z.boolean(),
    spo2: z.boolean(),
    ventilation: z.boolean(),
    ventilator: z.string().optional(),
    mode: z.string().optional(),
    peep: z.number().optional(),
    pip: z.number().optional(),
    fio2: z.number().optional(),
    ie: z.string().optional(),
    tv: z.number().optional(),
    rate: z.number().optional(),
  }),
  circulation: z.object({
    blood: z.boolean(),
    bolus: z.boolean(),
    buretrol: z.boolean(),
    cpr: z.boolean(),
    cardioversion: z.boolean(),
    centralIv: z.boolean(),
    defib: z.boolean(),
    dialAFlow: z.boolean(),
    ecg: z.boolean(),
    lead12: z.boolean(),
    fluidWarmer: z.boolean(),
    hiCapLine: z.boolean(),
    infusionPump: z.boolean(),
    infusion: z.boolean(),
    io: z.boolean(),
    pacing: z.boolean(),
    peripheralIv: z.boolean(),
    plasma: z.boolean(),
    syringeDriver: z.boolean(),
  }),
});
export type ProceduresType = z.infer<typeof ProceduresSchema>;

const RespiratoryDistressSchema = z.object({
  hx: z.array(
    z.enum([
      "Asthma",
      "COPD",
      "Emphysema",
      "Hx of Pulmonary Emboli",
      "Lung Cancer",
      "Prone to Chest Infections / Pneumonia",
      "Pulmonary TB",
      "COVID +",
    ]),
  ),
  riskFactorsForPulmEmbolus: z.array(
    z.enum([
      "Taking Contraceptives",
      "Hx of DVTs",
      "Recent: Long Distance Travel",
      "Fracture",
      "Recently given birth",
    ]),
  ),
  additionalFindings: z.array(
    z.enum([
      "Accessory Muscles Use",
      "Audible Wheezes",
      "Audible Stridor",
      "Apnea",
      "On Home O2",
      "Coughing: Wet",
      "Coughing: Dry",
      "Dyspnoea Not Relieved by Prescribed Medication",
      "Guards Depth of Breathing",
      "Hyperventilation",
      "Inability to Talk",
      "Kussmaul",
      "Recent Flu",
      "Severe Drooling",
      "Signs of Respiratory Fatigue",
      "Soot in Mouth",
      "Tachypnoea",
      "Tripod Position",
      "Talks in Phrases",
      "Uses Single Words Only",
    ]),
  ),
  infant: z.array(
    z.enum([
      "Chest Recession",
      "Grunting",
      "Irritable",
      "Prem Baby: Respiratory Distress Syndrome",
      "Congenital Abnormality",
      "Hyaline Membrane Disease",
    ]),
  ),
});

export type RespiratoryDistressType = z.infer<typeof RespiratoryDistressSchema>;

export const AssessmentsSchema = z.object({
  neuroAssessment: z.object({
    cincinnatiScale: z.object({
      armDrift: z.boolean(),
      facialDroop: z.boolean(),
      slurredSpeech: z.boolean(),
    }),
    seizure: z.object({
      tonic: z.boolean(),
      clonic: z.boolean(),
      petite: z.boolean(),
    }),
    incontinence: z.object({
      urine: z.boolean(),
      stool: z.boolean(),
    }),
    acuteDelirium: z.boolean(),
    aphasia: z.boolean(),
    stupor: z.boolean(),
    syncopeEvents: z.boolean(),
  }),
  neuroConditions: z.array(
    z.enum([
      "Brain tumour",
      "Bipolar",
      "Dementia",
      "Depression",
      "Epilepsy",
      "Hydrocephalus",
      "Multiple Sclerosis",
      "Parkinson's",
      "Previous: TBI",
      "Previous: TIA",
      "Previous: Stroke",
      "Quadriplegia",
      "Paraplegia",
      "Schizophrenia",
      "Syndrome",
    ]),
  ),
  abdominalAssessment: z.object({
    urineOutput: z.object({
      burning: z.boolean(),
      darkYellow: z.boolean(),
      normal: z.boolean(),
      blood: z.boolean(),
      poly: z.boolean(),
      noOutput: z.boolean(),
      ihtFoleyCath: z.boolean(),
      uo: z.string(),
    }),
    hx: z.array(
      z.enum(["Diverticulitis", "Liver or Renal Failure", "Stones", "UTIs"]),
    ),
    git: z.array(z.enum(["Ascites", "Bloated", "Constipation", "Diaphoresis"])),
    gastroenteritis: z.boolean(),
    hematemesis: z.boolean(),
    melaenaStool: z.boolean(),
    pegTube: z.boolean(),
    diarrhoea: z.boolean(),
    emesis: z.boolean(),
    emesisAmount: z.string(),
    emesisDays: z.string(),
    pain: z.array(
      z.enum(["Burning", "Cramping", "Dull", "Sharp", "Tearing", "Reflux"]),
    ),
    contractions: z.object({
      mild: z.boolean(),
      mod: z.boolean(),
      severe: z.boolean(),
      amount: z.string(),
    }),
    pregnant: z.boolean(),
    twinPregnancy: z.boolean(),
    paraGravida: z.string(),
    discharge: z.boolean(),
    pvBleeding: z.boolean(),
    lastDrVisit: z.date(),
    gestation: z.string(),
  }),
  painAssessment: z.object({
    provocation: z.object({
      onsetDuringExertion: z.boolean(),
      duringRest: z.boolean(),
      wokenByPain: z.boolean(),
      onsetDuringMild: z.boolean(),
      onsetDuringMod: z.boolean(),
      onsetDuringActivity: z.boolean(),
    }),
    quality: z.array(
      z.enum([
        "Burning",
        "Crushing / Weight",
        "Intermittent",
        "Constant",
        "Dull",
        "Sharp",
        "Tearing",
        "Cannot Describe",
      ]),
    ),
    radiating: z.object({
      yes: z.boolean(),
      lArm: z.boolean(),
      rArm: z.boolean(),
      face: z.boolean(),
      back: z.boolean(),
      leg: z.boolean(),
    }),
    severity: z.object({
      atOnset: z.string(),
      current: z.string(),
    }),
    timeOfOnset: z.string(),
    negativeMurphysSign: z.boolean(),
  }),
  cardiacRiskFactors: z.array(
    z.enum([
      "Age",
      "↑BMI",
      "Diabetes",
      "Family Cardiac Hx",
      "Hypertension",
      "↑Cholesterol",
      "Previous Cardiac Event",
      "Smoker",
      "Stress",
    ]),
  ),
  signsOfDehydration: z.array(
    z.enum([
      "Cold Peripheries",
      "Confused",
      "Cramping",
      "Dysphagia",
      "Dizziness",
      "Dry Mucosa",
      "Hypotension",
      "Poor Skin Turgor",
      "Sunken Eyes",
      "Sunken Fontanelles",
      "Syncope",
      "Tachycardia",
      "Weak",
    ]),
  ),
  signsOfAcuteCoronarySyndrome: z.array(
    z.enum([
      "Chest Pain Not Increased by Deep Breathing",
      "Crushing Pain",
      "Diaphoresis",
      "Radiating Pain",
      "Nausea",
      "Pale",
      "ECG Changes",
      "ST Elevation",
    ]),
  ),
});

export type AssessmentsType = z.infer<typeof AssessmentsSchema>;

export const InjurySchema = z.object({
  injuries: z.array(
    z.object({
      side: z.enum(["anterior", "posterior"]),
      id: z.number(),
      x: z.number(),
      y: z.number(),
      symbol: z.string(),
    }),
  ),
  anteriorImage: z.string().optional(),
  posteriorImage: z.string().optional(),
});

export type InjuryType = z.infer<typeof InjurySchema>;

export const PatientHandoverSchema = z.object({
  fullName: z.string().min(3, { message: "Full Name is required" }),
  date: z.date({ message: "Date is required" }),
  patientSignature: z.string({
    message: "Patient Signature is required",
  }),
  witnessSignature: z.string({
    message: "Witness Signature is required",
  }),
});
export type PatientHandoverType = z.infer<typeof PatientHandoverSchema>;

export const PastMedicalHistorySchema = z.object({
  allergies: z.array(
    z.object({
      allergen: z.string().min(1, "Allergen is required"),
      reaction: z.string().min(1, "Reaction is required"),
      severity: z.enum(["Mild", "Moderate", "Severe"]),
    }),
  ),
  currentMedications: z.array(
    z.object({
      medication: z.string().min(1, "Medication name is required"),
      dosage: z.string().min(1, "Dosage is required"),
      frequency: z.string().min(1, "Frequency is required"),
      lastTaken: z.string().optional(),
    }),
  ),
  lastMeal: z.object({
    time: z.string().min(1, "Time is required"),
    description: z.string().optional(),
  }),
  medicalConditions: z.object({
    cardiovascular: z.object({
      hasCondition: z.boolean(),
      conditions: z.array(
        z.enum([
          "Hypertension",
          "Previous MI",
          "Angina",
          "Bypass Surgery",
          "Pacemaker",
          "Heart Failure",
          "Arrhythmia",
          "Other",
        ]),
      ),
      details: z.string().optional(),
    }),
    respiratory: z.object({
      hasCondition: z.boolean(),
      conditions: z.array(
        z.enum(["Asthma", "COPD", "Tuberculosis", "Sleep Apnea", "Other"]),
      ),
      details: z.string().optional(),
    }),
    neurological: z.object({
      hasCondition: z.boolean(),
      conditions: z.array(
        z.enum(["CVA/Stroke", "Epilepsy", "TIA", "Seizures", "Other"]),
      ),
      details: z.string().optional(),
    }),
    endocrine: z.object({
      hasCondition: z.boolean(),
      conditions: z.array(
        z.enum([
          "Diabetes Type 1",
          "Diabetes Type 2",
          "Thyroid Disease",
          "Other",
        ]),
      ),
      details: z.string().optional(),
    }),
  }),
  surgicalHistory: z.array(
    z.object({
      procedure: z.string().min(1, "Procedure is required"),
      date: z.string().optional(),
      complications: z.string().optional(),
    }),
  ),
  familyHistory: z.array(z.string()).default([]),
  additionalNotes: z.string().optional(),
});

export type PastMedicalHistoryType = z.infer<typeof PastMedicalHistorySchema>;

// Inventory section schema
export const InventoryItemSchema = z.object({
  itemId: z.string(),
  name: z.string(),
  category: z.enum(["medication", "fluid", "equipment", "consumable"]),
  quantityUsed: z.number().min(0),
  availableStock: z.number().min(0),
  notes: z.string().optional(),
});

export const InventorySchema = z.object({
  items: z.array(InventoryItemSchema),
  additionalNotes: z.string().optional(),
});

export type InventoryItemType = z.infer<typeof InventoryItemSchema>;
export type InventoryType = z.infer<typeof InventorySchema>;

export const NotesSchema = z.object({
  notes: z.string(),
});

export type NotesType = z.infer<typeof NotesSchema>;

export const PRFFormDataSchema = z.object({
  case_details: z
    .object({
      isOptional: z.boolean().default(false).optional(),
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
  // history_taking: z
  //   .object({
  //     isOptional: z.boolean(),
  //     isCompleted: z.boolean(),
  //     data: z.string(),
  //   })
  //   .optional(),
  // physical_exam: z
  //   .object({
  //     isOptional: z.boolean(),
  //     isCompleted: z.boolean(),
  //     data: z.string(),
  //   })
  //   .optional(),
  // interventions: z
  //   .object({
  //     isOptional: z.boolean().default(false),
  //     isCompleted: z.boolean().default(false),
  //     data: z.string(),
  //   })
  //   .optional(),
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
  procedures: z
    .object({
      isOptional: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      data: ProceduresSchema,
    })
    .optional(),
  respiratory_distress: z
    .object({
      isOptional: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      data: RespiratoryDistressSchema,
    })
    .optional(),
  injuries: z
    .object({
      isOptional: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      data: InjurySchema,
    })
    .optional(),
  assessments: z
    .object({
      isOptional: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      data: AssessmentsSchema,
    })
    .optional(),
  patient_handover: z
    .object({
      isOptional: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      data: PatientHandoverSchema,
    })
    .optional(),
  notes: z
    .object({
      isOptional: z.boolean(),
      isCompleted: z.boolean(),
      data: NotesSchema,
    })
    .optional(),
  past_medical_history: z
    .object({
      isOptional: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      data: PastMedicalHistorySchema,
    })
    .optional(),
  inventory: z
    .object({
      isOptional: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      data: InventorySchema,
    })
    .optional(),
});

// Define the full form schema
export const PRFFormSchema = z.object({
  responseId: z.string(),
  patientId: z.string().optional(),
  prfData: PRFFormDataSchema,
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
  isCompleted: z.boolean().default(false).optional(),
  employeeId: z.string(), // added employee and crew IDs
  crewId: z.string().default("crewId").optional(), // this can be optional for now
});
