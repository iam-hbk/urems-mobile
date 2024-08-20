import { PatientDetailsType as PRF_FORM_PATIENT_DETAILS } from "@/components/the-prf-form/patient-details-section";
import { CaseDetailsType as PRF_FORM_CASE_DETAILS } from "@/components/the-prf-form/case-details-section";
export type PRF_FORM = {
  prfFormId?: string;
  patientId?: string;
  prfData: PRF_FORM_DATA;
  createdAt?: string | Date;
  isCompleted?: boolean;
};

type PRF_FORM_TRANSPORTATION = {
  fromSuburbTown: string;
  by: string;
  to: string;
  crewDetails: {
    initialAndSurname: string;
    HPCSANo: string;
  }[];
};

type PRF_FORM_INCIDENT_INFORMATION = {
  sceneAddress: string;
  dispatchInfo: string;
  onArrival: string;
  chiefComplaint: string;
  pastHistory: {
    allergies: string;
    medication: string;
    medicalHx: string;
    lastMeal: string;
    cva: boolean;
    epilepsy: boolean;
    cardiac: boolean;
    byPass: boolean;
    dmOneOrTwo: boolean;
    HPT: boolean;
    asthma: boolean;
    copd: boolean;
  };
};

type PRF_FORM_PRIMARY_SURVEY = {
  airway: {
    clear: boolean;
    maintained: boolean;
    lateral: boolean;
    intubated: boolean;
    surgical: boolean;
    blood: boolean;
    vomit: boolean;
    saliva: boolean;
    FBAO: boolean;
  };
  breathing: {
    trachea: {
      midline: boolean;
      deviated: boolean;
    };
    airEntry: {
      clear: boolean;
      diminished: boolean;
      absent: boolean;
      left: string;
      right: string;
    };
    extraSounds: {
      none: boolean;
      soft: boolean;
      loud: boolean;
      wheezes: boolean;
      crackles: boolean;
      stridor: boolean;
      frictionRub: boolean;
    };
    mechanics: {
      accessoryMuscleUse: boolean;
      apnea: boolean;
      asymmetrical: boolean;
      fatigue: boolean;
      guarding: boolean;
      normal: boolean;
      hypoventilation: boolean;
      ventilated: boolean;
    };
    neckVeins: {
      normal: boolean;
      distended: boolean;
    };
  };
  circulation: {
    haemorrhage: {
      none: boolean;
      arterial: boolean;
      venous: boolean;
      capillary: boolean;
      mild: boolean;
      moderate: boolean;
      severe: boolean;
      internal: boolean;
    };
    assessmentOfPulses: {
      palpableCentral: boolean;
      palpablePeripherals: boolean;
      weak: boolean;
      absent: boolean;
      strong: boolean;
    };
    perfusion: {
      good: boolean;
      poor: boolean;
      none: boolean;
      mucosa: {
        pink: boolean;
        pale: boolean;
        cyanosed: boolean;
      };
      CRT: {
        lessThan2Sec: boolean;
        moreThan2Sec: boolean;
      };
    };
  };
  disability: {
    initialGCS: {
      total: string;
      motor: string;
      verbal: string;
      eyes: string;
    };
    AVPU: {
      A: boolean;
      V: boolean;
      P: boolean;
      U: boolean;
    };
    combative: boolean;
    spinal: {
      motorFunction: {
        normal: boolean;
        guarding: boolean;
        loss: boolean;
      };
      sensation: {
        intact: boolean;
        pinsAndNeedles: boolean;
        numbness: boolean;
        none: boolean;
        fromNeck: boolean;
        nippleLine: boolean;
        abd: boolean;
      };
    };
  };
  patientValuables: {
    cash: string;
    laptop: boolean;
    wallet: boolean;
    idDocument: boolean;
    phone: boolean;
    bag: boolean;
    none: boolean;
    clothing: boolean;
    toiletries: boolean;
    meds: boolean;
    handedTo: string;
    signature: string;
  };
};
type PRF_FORM_SECONDARY_SURVEY = {
  scalp: {
    abrasion: boolean;
    avulsion: boolean;
    bruising: boolean;
    burns: boolean;
    deepWound: boolean;
    GSW: boolean;
    oedema: boolean;
    laceration: boolean;
    largeWound: boolean;
    normal: boolean;
  };
  cranium: {
    BOSFracture: boolean;
    crepitus: boolean;
    deformity: boolean;
    fracture: boolean;
    GSW: boolean;
    frontal: boolean;
    occipital: boolean;
    parietal: boolean;
    temporal: boolean;
    normal: boolean;
  };
  face: {
    abrasion: boolean;
    anxious: boolean;
    bloodInAirway: boolean;
    bittenTongue: boolean;
    bruising: boolean;
    blind: boolean;
    burns: boolean;
    crepitus: boolean;
    crying: boolean;
    deformity: boolean;
    deepWound: boolean;
    epistaxis: boolean;
    guarding: boolean;
    GSW: boolean;
    laceration: boolean;
    largeWound: boolean;
    orbitalInjury: boolean;
    oedema: boolean;
    normal: boolean;
  };
  neck: {
    bruising: boolean;
    burns: boolean;
    crepitus: boolean;
    deformity: boolean;
    guarding: boolean;
    laceration: boolean;
    oedema: boolean;
    penetratingWound: boolean;
    normal: boolean;
  };
  spine: {
    bruising: boolean;
    crepitus: boolean;
    deformity: boolean;
    guarding: boolean;
    GSW: boolean;
    oedema: boolean;
    penetratingWound: boolean;
    sciaticPain: boolean;
    normal: boolean;
  };
  chest: {
    abrasion: boolean;
    asymmetricalRiseAndFall: boolean;
    bruising: boolean;
    burns: boolean;
    crepitus: boolean;
    deformity: boolean;
    dyspnoea: boolean;
    flailSegment: boolean;
    guardingPalpation: boolean;
    guardingDepthOfBreathing: boolean;
    GSW: boolean;
    laceration: boolean;
    oedema: boolean;
    stabWound: boolean;
    suckingWound: boolean;
    normal: boolean;
  };
  abdomen: {
    abrasion: boolean;
    bruisingEcchymosis: boolean;
    burns: boolean;
    distended: boolean;
    evisceration: boolean;
    GSW: boolean;
    guarding: boolean;
    hernia: boolean;
    laceration: boolean;
    reboundTenderness: boolean;
    rupturedMembranes: boolean;
    severePain: boolean;
    stabWound: boolean;
    uterineContractions: boolean;
    normalSoftOnPalpation: boolean;
  };
  pelvis: {
    crepitus: boolean;
    deformity: boolean;
    guarding: boolean;
    GSW: boolean;
    incontinence: boolean;
    openWound: boolean;
    openBook: boolean;
    severePain: boolean;
    stable: boolean;
  };
  leftArm: {
    abrasion: boolean;
    amputation: boolean;
    crepitus: boolean;
    bruising: boolean;
    deformity: boolean;
    GSW: boolean;
    guarding: boolean;
    laceration: boolean;
    oedema: boolean;
    pulse: boolean;
  };
  rightArm: {
    abrasion: boolean;
    amputation: boolean;
    crepitus: boolean;
    bruising: boolean;
    deformity: boolean;
    GSW: boolean;
    guarding: boolean;
    laceration: boolean;
    oedema: boolean;
    pulse: boolean;
  };
  leftLeg: {
    abrasion: boolean;
    amputation: boolean;
    crepitus: boolean;
    bruising: boolean;
    deformity: boolean;
    GSW: boolean;
    guarding: boolean;
    laceration: boolean;
    oedema: boolean;
    pulse: boolean;
  };
  rightLeg: {
    abrasion: boolean;
    amputation: boolean;
    crepitus: boolean;
    bruising: boolean;
    deformity: boolean;
    GSW: boolean;
    guarding: boolean;
    laceration: boolean;
    oedema: boolean;
    pulse: boolean;
  };
  additionalFindings: string;
};

type PRF_FORM_SECTION = {
  isOptional: boolean;
  isCompleted: boolean;
};

type PRF_FORM_SECTION_WITH_DATA<T> = PRF_FORM_SECTION & {
  data: T;
};

export type PRF_FORM_DATA = {
  case_details?: PRF_FORM_SECTION_WITH_DATA<PRF_FORM_CASE_DETAILS>;
  patient_details?: PRF_FORM_SECTION_WITH_DATA<PRF_FORM_PATIENT_DETAILS>;
  transportation?: PRF_FORM_SECTION_WITH_DATA<PRF_FORM_TRANSPORTATION>;
  primary_survey?: PRF_FORM_SECTION_WITH_DATA<PRF_FORM_PRIMARY_SURVEY>;
  secondary_survey?: PRF_FORM_SECTION_WITH_DATA<PRF_FORM_SECONDARY_SURVEY>;
  vital_signs?: PRF_FORM_SECTION_WITH_DATA<any>;
  history_taking?: PRF_FORM_SECTION_WITH_DATA<any>;
  physical_exam?: PRF_FORM_SECTION_WITH_DATA<any>;
  interventions?: PRF_FORM_SECTION_WITH_DATA<any>;
  medication_administration?: PRF_FORM_SECTION_WITH_DATA<any>;
  patient_handover?: PRF_FORM_SECTION_WITH_DATA<any>;
};
