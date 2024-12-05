import { z } from "zod";
import { PrimarySurveySchema } from "./prf-primary-survey-schema";
import { VitalSignsSchema } from "./prf-vital-signs-schema";

type PatientDetailsContext = {
  parent: {
    unableToObtainInformation: {
      status: boolean;
    };
  };
};

export const PatientDetailsSchema = z.object({
  unableToObtainInformation: z.object({
    status: z.boolean(),
    estimatedAge: z.number().optional(),
    notes: z.string(),
  }),
  age: z.number().optional().superRefine((val, ctx) => {
    const status = (ctx as any).parent?.unableToObtainInformation?.status;
    if (!status && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Age is required when patient information is available",
      });
    }
  }),
  ageUnit: z.enum(["years", "months", "days"]),
  gender: z.enum(["male", "female"]).optional().superRefine((val, ctx) => {
    const status = (ctx as any).parent?.unableToObtainInformation?.status;
    if (!status && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Gender is required when patient information is available",
      });
    }
  }),
  patientName: z.string().superRefine((val, ctx) => {
    const status = (ctx as any).parent?.unableToObtainInformation?.status;
    if (!status && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Patient name is required when patient information is available",
      });
    }
  }),
  patientSurname: z.string().superRefine((val, ctx) => {
    const status = (ctx as any).parent?.unableToObtainInformation?.status;
    if (!status && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Patient surname is required when patient information is available",
      });
    }
  }),
  id: z.string(),
  passport: z.string(),
  // ------------------------------------
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
  //TODO: add a toggle to chose between 1, 2, 3, 4 and colors [red, yellow,orange, green, blue]
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

export const ProceduresSchema = z.object({
  airway: z.object({
    ett: z.boolean(),
    ettSize: z.number().optional(),
    depth: z.number().optional(),
    ettCuffPressure: z.enum([
      "20-30cmH2O",
      "CUFF NOT INFLATED",
      "NOT MEASURED",
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
    date: z.string().optional(),
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
    acuteDelirium: z.boolean(),
    aphasia: z.boolean(),
    incontinence: z.object({
      urine: z.boolean(),
      stool: z.boolean(),
    }),
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
    lastDrVisit: z.string(),
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

// --------------------------------------------
export const PastMedicalHistorySchema = z.object({
  allergies: z.array(z.object({
    allergen: z.string().min(1, "Allergen is required"),
    reaction: z.string().min(1, "Reaction is required"),
    severity: z.enum(["Mild", "Moderate", "Severe"]),
  })),
  currentMedications: z.array(z.object({
    medication: z.string().min(1, "Medication name is required"),
    dosage: z.string().min(1, "Dosage is required"),
    frequency: z.string().min(1, "Frequency is required"),
    lastTaken: z.string().optional(),
  })),
  lastMeal: z.object({
    time: z.string().min(1, "Time is required"),
    description: z.string().optional(),
  }),
  medicalConditions: z.object({
    cardiovascular: z.object({
      hasCondition: z.boolean(),
      conditions: z.array(z.enum([
        "Hypertension",
        "Previous MI",
        "Angina",
        "Bypass Surgery",
        "Pacemaker",
        "Heart Failure",
        "Arrhythmia",
        "Other"
      ])),
      details: z.string().optional(),
    }),
    respiratory: z.object({
      hasCondition: z.boolean(),
      conditions: z.array(z.enum([
        "Asthma",
        "COPD",
        "Tuberculosis",
        "Sleep Apnea",
        "Other"
      ])),
      details: z.string().optional(),
    }),
    neurological: z.object({
      hasCondition: z.boolean(),
      conditions: z.array(z.enum([
        "CVA/Stroke",
        "Epilepsy",
        "TIA",
        "Seizures",
        "Other"
      ])),
      details: z.string().optional(),
    }),
    endocrine: z.object({
      hasCondition: z.boolean(),
      conditions: z.array(z.enum([
        "Diabetes Type 1",
        "Diabetes Type 2",
        "Thyroid Disease",
        "Other"
      ])),
      details: z.string().optional(),
    }),
  }),
  surgicalHistory: z.array(z.object({
    procedure: z.string().min(1, "Procedure is required"),
    date: z.string().optional(),
    complications: z.string().optional(),
  })),
  familyHistory: z.array(z.string()).optional(),
  additionalNotes: z.string().optional(),
});

export type PastMedicalHistoryType = z.infer<typeof PastMedicalHistorySchema>;

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
      data: z.string(),
    })
    .optional(),
  past_medical_history: z.object({
    isOptional: z.boolean().default(false),
    isCompleted: z.boolean().default(false),
    data: PastMedicalHistorySchema,
  }).optional(),
});

// Define the full form schema
export const PRFFormSchema = z.object({
  prfFormId: z.string().optional(),
  patientId: z.string().optional(),
  prfData: PRFFormDataSchema,
  createdAt: z.union([z.string(), z.date()]).optional(),
  isCompleted: z.boolean().default(false).optional(),
});
