import { z } from "zod";

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
  fromSuburbTown: z.string(),
  by: z.string(),
  to: z.string(),
  crewDetails: z.array(
    z.object({
      initialAndSurname: z.string(),
      HPCSANo: z.string(),
    })
  ),
});
export const IncidentInformationSchema = z.object({
  sceneAddress: z.string().min(5),
  dispatchInfo: z.string().min(5),
  onArrival: z.string(),
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
export const PrimarySurveySchema = z.object({
  airway: z.object({
    clear: z.boolean(),
    maintained: z.boolean(),
    lateral: z.boolean(),
    intubated: z.boolean(),
    surgical: z.boolean(),
    blood: z.boolean(),
    vomit: z.boolean(),
    saliva: z.boolean(),
    FBAO: z.boolean(),
  }),
  breathing: z.object({
    trachea: z.object({
      midline: z.boolean(),
      deviated: z.boolean(),
    }),
    airEntry: z.object({
      clear: z.boolean(),
      diminished: z.boolean(),
      absent: z.boolean(),
      left: z.string(),
      right: z.string(),
    }),
    extraSounds: z.object({
      none: z.boolean(),
      soft: z.boolean(),
      loud: z.boolean(),
      wheezes: z.boolean(),
      crackles: z.boolean(),
      stridor: z.boolean(),
      frictionRub: z.boolean(),
    }),
    mechanics: z.object({
      accessoryMuscleUse: z.boolean(),
      apnea: z.boolean(),
      asymmetrical: z.boolean(),
      fatigue: z.boolean(),
      guarding: z.boolean(),
      normal: z.boolean(),
      hypoventilation: z.boolean(),
      ventilated: z.boolean(),
    }),
    neckVeins: z.object({
      normal: z.boolean(),
      distended: z.boolean(),
    }),
  }),
  circulation: z.object({
    haemorrhage: z.object({
      none: z.boolean(),
      arterial: z.boolean(),
      venous: z.boolean(),
      capillary: z.boolean(),
      mild: z.boolean(),
      moderate: z.boolean(),
      severe: z.boolean(),
      internal: z.boolean(),
    }),
    assessmentOfPulses: z.object({
      palpableCentral: z.boolean(),
      palpablePeripherals: z.boolean(),
      weak: z.boolean(),
      absent: z.boolean(),
      strong: z.boolean(),
    }),
    perfusion: z.object({
      good: z.boolean(),
      poor: z.boolean(),
      none: z.boolean(),
      mucosa: z.object({
        pink: z.boolean(),
        pale: z.boolean(),
        cyanosed: z.boolean(),
      }),
      CRT: z.object({
        lessThan2Sec: z.boolean(),
        moreThan2Sec: z.boolean(),
      }),
    }),
  }),
  disability: z.object({
    initialGCS: z.object({
      total: z.string(),
      motor: z.string(),
      verbal: z.string(),
      eyes: z.string(),
    }),
    AVPU: z.object({
      A: z.boolean(),
      V: z.boolean(),
      P: z.boolean(),
      U: z.boolean(),
    }),
    combative: z.boolean(),
    spinal: z.object({
      motorFunction: z.object({
        normal: z.boolean(),
        guarding: z.boolean(),
        loss: z.boolean(),
      }),
      sensation: z.object({
        intact: z.boolean(),
        pinsAndNeedles: z.boolean(),
        numbness: z.boolean(),
        none: z.boolean(),
        fromNeck: z.boolean(),
        nippleLine: z.boolean(),
        abd: z.boolean(),
      }),
    }),
  }),
  patientValuables: z.object({
    cash: z.string(),
    laptop: z.boolean(),
    wallet: z.boolean(),
    idDocument: z.boolean(),
    phone: z.boolean(),
    bag: z.boolean(),
    none: z.boolean(),
    clothing: z.boolean(),
    toiletries: z.boolean(),
    meds: z.boolean(),
    handedTo: z.string(),
    signature: z.string(),
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
export const VitalSignsSchema = z.object({
  bloodPressure: z.object({
    systolic: z.number(),
    diastolic: z.number(),
  }),
  pulseRate: z.object({
    rate: z.number(),
    rhythm: z.string(),
    strength: z.string(),
  }),
  respiratoryRate: z.object({
    rate: z.number(),
    effort: z.string(),
    breathSounds: z.string(),
  }),
  temperature: z.object({
    value: z.number(),
    method: z.string(),
  }),
  oxygenSaturation: z.number(),
  bloodGlucoseLevel: z.number(),
  GCS: z.object({
    eyes: z.number(),
    verbal: z.number(),
    motor: z.number(),
  }),
  painScore: z.number(),
  weight: z.number(),
  height: z.number(),
  additionalObservations: z.string().optional(),
});

// Combine schemas for PRF_FORM_DATA
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
      data: VitalSignsSchema,
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
  medication_administration: z
    .object({
      isOptional: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      data: z.string(),
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
