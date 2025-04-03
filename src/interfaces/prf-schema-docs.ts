/**
 * PRF (Patient Record Form) Schema Documentation
 * This file contains the complete schema definition for the PRF form with field descriptions
 */

import { z } from "zod";

/**
 * Patient Information Schema
 * Contains basic patient identification and demographic information
 */
const PatientDetailsSchema = z.object({
  unableToObtainInformation: z.object({
    status: z
      .boolean()
      .default(false)
      .describe("Indicates if complete patient information cannot be obtained"),
    estimatedAge: z
      .number()
      .optional()
      .describe("Estimated age when exact age is unknown"),
    notes: z
      .string()
      .optional()
      .describe("Additional notes regarding inability to obtain information"),
  }),
  age: z.number().optional().describe("Patient's age"),
  ageUnit: z
    .enum(["years", "months", "days"])
    .default("years")
    .describe("Unit of age measurement"),
  gender: z.enum(["male", "female"]).optional().describe("Patient's gender"),
  patientName: z.string().optional().describe("Patient's first name"),
  patientSurname: z.string().optional().describe("Patient's surname/last name"),
  id: z.string().optional().describe("Patient's ID number"),
  passport: z.string().optional().describe("Patient's passport number"),

  nextOfKin: z
    .object({
      name: z.string().describe("Name of next of kin"),
      relationToPatient: z.string().describe("Relationship to patient"),
      email: z
        .string()
        .email()
        .optional()
        .describe("Email address of next of kin"),
      physicalAddress: z.string().describe("Physical address of next of kin"),
      phoneNo: z.string().describe("Primary phone number"),
      alternatePhoneNo: z
        .string()
        .optional()
        .describe("Alternative phone number"),
      otherNOKPhoneNo: z
        .string()
        .optional()
        .describe("Additional contact number"),
    })
    .optional(),

  medicalAid: z
    .object({
      name: z.string().describe("Name of medical aid/insurance provider"),
      number: z.string().describe("Medical aid/insurance number"),
      principalMember: z.string().describe("Name of principal member"),
      authNo: z
        .string()
        .optional()
        .describe("Authorization number if applicable"),
    })
    .optional(),

  employer: z
    .object({
      name: z.string().describe("Employer's name"),
      workPhoneNo: z.string().describe("Work contact number"),
      workAddress: z.string().describe("Employer's physical address"),
    })
    .optional(),

  pastHistory: z
    .object({
      allergies: z.string().optional().describe("Known allergies"),
      medication: z.string().optional().describe("Current medications"),
      medicalHx: z.string().optional().describe("Medical history"),
      lastMeal: z.string().optional().describe("Time and details of last meal"),
      cva: z
        .boolean()
        .default(false)
        .describe("History of CVA (Cerebrovascular Accident)"),
      epilepsy: z.boolean().default(false).describe("History of epilepsy"),
      cardiac: z
        .boolean()
        .default(false)
        .describe("History of cardiac conditions"),
      byPass: z.boolean().default(false).describe("History of bypass surgery"),
      dmOneOrTwo: z
        .boolean()
        .default(false)
        .describe("History of diabetes (Type 1 or 2)"),
      HPT: z.boolean().default(false).describe("History of hypertension"),
      asthma: z.boolean().default(false).describe("History of asthma"),
      copd: z.boolean().default(false).describe("History of COPD"),
    })
    .optional(),
});

/**
 * Case Details Schema
 * Contains information about the emergency response case
 */
const CaseDetailsSchema = z.object({
  regionDistrict: z
    .string()
    .min(2, "Region/District is required")
    .max(50)
    .describe("Region or district where the case occurred"),
  base: z
    .string()
    .min(2, "Base is required")
    .max(50)
    .describe("Emergency response base location"),
  province: z
    .string()
    .min(2, "Province is required")
    .max(50)
    .describe("Province where the case occurred"),
  vehicle: z
    .object({
      id: z.number().describe("Unique identifier for the response vehicle"),
      name: z
        .string()
        .min(2)
        .describe("Name/designation of the response vehicle"),
      license: z.string().min(2).describe("Vehicle license number"),
      registrationNumber: z
        .string()
        .min(2)
        .describe("Vehicle registration number"),
    })
    .describe("Response vehicle information"),
  dateOfCase: z.date().describe("Date and time when the case occurred"),
});

/**
 * Transportation Schema
 * Details about patient transportation
 */
const TransportationSchema = z.object({
  fromSuburbTown: z.string().min(1).describe("Starting location of transport"),
  by: z.string().min(2).describe("Mode of transport"),
  to: z.string().min(2).describe("Destination location"),
  crewDetails: z
    .array(
      z.object({
        initialAndSurname: z
          .string()
          .min(2)
          .describe("Crew member's name and surname"),
        HPCSANo: z.string().min(2).describe("HPCSA registration number"),
      }),
    )
    .nonempty()
    .describe("Details of crew members involved"),
});

/**
 * Incident Information Schema
 * Details about the incident/emergency
 */
const IncidentInformationSchema = z.object({
  sceneAddress: z
    .string()
    .min(5)
    .describe("Address where the incident occurred"),
  dispatchInfo: z
    .string()
    .min(5)
    .describe("Information provided during dispatch"),
  onArrival: z.string().min(5).describe("Situation found on arrival at scene"),
  chiefComplaint: z
    .string()
    .describe("Patient's main complaint or reason for emergency"),
});

/**
 * Vital Signs Schema
 * Patient's vital signs measurements
 */
const VitalSignsSchema = z.object({
  readings: z
    .array(
      z.object({
        time: z.string().describe("Time of vital signs measurement"),
        bp: z
          .object({
            systolic: z.number().describe("Systolic blood pressure reading"),
            diastolic: z.number().describe("Diastolic blood pressure reading"),
          })
          .describe("Blood pressure measurement"),
        pulse: z.number().describe("Pulse rate (beats per minute)"),
        respiration: z
          .number()
          .describe("Respiratory rate (breaths per minute)"),
        temperature: z.number().describe("Body temperature"),
        spo2: z.number().describe("Blood oxygen saturation level (%)"),
        gcs: z
          .object({
            eyes: z
              .number()
              .min(1)
              .max(4)
              .describe("Glasgow Coma Scale - Eye opening"),
            verbal: z
              .number()
              .min(1)
              .max(5)
              .describe("Glasgow Coma Scale - Verbal response"),
            motor: z
              .number()
              .min(1)
              .max(6)
              .describe("Glasgow Coma Scale - Motor response"),
          })
          .describe("Glasgow Coma Scale assessment"),
        pupils: z
          .object({
            left: z.object({
              size: z.number().describe("Left pupil size in mm"),
              reaction: z
                .enum(["brisk", "sluggish", "fixed"])
                .describe("Left pupil reaction to light"),
            }),
            right: z.object({
              size: z.number().describe("Right pupil size in mm"),
              reaction: z
                .enum(["brisk", "sluggish", "fixed"])
                .describe("Right pupil reaction to light"),
            }),
          })
          .describe("Pupillary assessment"),
      }),
    )
    .describe("Array of vital signs readings over time"),
});

/**
 * Mechanism of Injury Schema
 * Details about how the injury occurred
 */
const MechanismOfInjurySchema = z
  .object({
    vehicleType: z
      .object({
        occured: z
          .boolean()
          .optional()
          .describe("Whether vehicle was involved"),
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
          .optional()
          .describe("Type of vehicle involved"),
      })
      .describe("Vehicle involvement details"),

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
      .optional()
      .describe("Type of vehicle impact"),

    speed: z
      .enum(["<60km/h", "60-100km/h", ">120km/h"])
      .optional()
      .describe("Estimated speed at impact"),

    personType: z
      .enum(["Driver", "Passenger", "Unknown"])
      .optional()
      .describe("Patient's position in vehicle"),

    safetyFeatures: z
      .array(z.enum(["Airbags", "Restrained"]))
      .optional()
      .describe("Safety features in use"),

    extractionMethod: z
      .enum([
        "Ejected",
        "Removed by Bystander",
        "Extricated by EMS",
        "Self-Extricated",
      ])
      .optional()
      .describe("How patient was removed from vehicle"),

    burns: z
      .object({
        occurred: z.boolean().optional().describe("Whether burns occurred"),
        bsa: z
          .enum(["<15%", ">15%"])
          .optional()
          .describe("Body Surface Area affected"),
        confinedSpace: z
          .boolean()
          .optional()
          .describe("Whether in confined space"),
        duration: z.string().default("").describe("Duration of exposure"),
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
          .optional()
          .describe("Types of burns"),
      })
      .optional()
      .describe("Burn injury details"),
  })
  .describe("Complete mechanism of injury information");

/**
 * Procedures Schema
 * Medical procedures performed
 */
const ProceduresSchema = z
  .object({
    airway: z
      .object({
        ett: z.boolean().describe("Endotracheal tube placed"),
        ettSize: z.number().optional().describe("ETT size"),
        depth: z.number().optional().describe("ETT depth"),
        ettCuffPressure: z
          .enum(["20-30cmH2O", "Cuff Not Inflated", "Not Measured"])
          .describe("ETT cuff pressure"),
        gastricTube: z.boolean().describe("Gastric tube placed"),
        iGel: z.boolean().describe("iGel airway used"),
        lma: z.boolean().describe("Laryngeal mask airway used"),
        opa: z.boolean().describe("Oropharyngeal airway used"),
        suction: z.boolean().describe("Suction performed"),
      })
      .describe("Airway management procedures"),

    breathing: z
      .object({
        bvm: z.boolean().describe("Bag valve mask ventilation"),
        cpap: z.boolean().describe("Continuous positive airway pressure"),
        etco2: z.boolean().describe("End-tidal CO2 monitoring"),
        oxygen: z.boolean().describe("Oxygen therapy"),
        ventilation: z.boolean().describe("Mechanical ventilation"),
        ventilator: z
          .object({
            mode: z.string().optional().describe("Ventilation mode"),
            peep: z
              .number()
              .optional()
              .describe("Positive end-expiratory pressure"),
            fio2: z.number().optional().describe("Fraction of inspired oxygen"),
            rate: z.number().optional().describe("Respiratory rate setting"),
          })
          .optional()
          .describe("Ventilator settings"),
      })
      .describe("Breathing support procedures"),

    circulation: z
      .object({
        cpr: z.boolean().describe("CPR performed"),
        defib: z.boolean().describe("Defibrillation performed"),
        ecg: z.boolean().describe("ECG monitoring"),
        iv: z.boolean().describe("Intravenous access"),
        io: z.boolean().describe("Intraosseous access"),
        fluidTherapy: z
          .array(
            z.object({
              type: z.string().describe("Type of fluid"),
              volume: z.number().describe("Volume administered (mL)"),
              route: z.string().describe("Administration route"),
              time: z.string().describe("Time of administration"),
            }),
          )
          .optional()
          .describe("Fluid therapy details"),
      })
      .describe("Circulatory support procedures"),
  })
  .describe("Medical procedures performed during care");

/**
 * Medication Administration Schema
 * Details of medications given
 */
const MedicationAdministeredSchema = z
  .object({
    medications: z
      .array(
        z.object({
          medicine: z.string().min(1).describe("Name of medication"),
          medicationId: z.string().optional().describe("Medication identifier"),
          dose: z.string().min(1).describe("Dose administered"),
          route: z.string().min(1).describe("Route of administration"),
          time: z
            .object({
              value: z.string().min(1).describe("Time of administration"),
              unknown: z.boolean().describe("Whether exact time is unknown"),
            })
            .describe("Administration timing"),
          hpcsa: z.string().min(1).describe("HPCSA number of administrator"),
          name: z.string().min(1).describe("Name of administrator"),
          signature: z.string().min(1).describe("Administrator's signature"),
        }),
      )
      .describe("List of medications administered"),

    consultation: z
      .object({
        consulted: z.boolean().describe("Whether consultation was obtained"),
        practitioner: z.string().describe("Consulting practitioner's name"),
        hpcsa: z.string().describe("Practitioner's HPCSA number"),
        summaryOfConsult: z.string().describe("Summary of consultation"),
      })
      .describe("Consultation details"),
  })
  .describe("Complete medication administration record");

/**
 * Diagnosis Schema
 * Medical diagnosis and priority information
 */
const DiagnosisSchema = z.object({
  diagnosis: z.string().min(1).describe("Medical diagnosis"),
  priorityType: z
    .enum(["number", "color"])
    .default("number")
    .describe("Type of priority classification"),
  priority: z
    .union([
      z.enum(["1", "2", "3", "4"]),
      z.enum(["red", "yellow", "orange", "green", "blue"]),
    ])
    .describe("Priority level of the case"),
  // ... other diagnosis fields
});

/**
 * Primary Survey Schema
 * Initial rapid examination to identify life-threatening conditions
 */
const PrimarySurveySchema = z
  .object({
    airway: z
      .object({
        patent: z.boolean().describe("Whether airway is patent/clear"),
        obstruction: z.boolean().describe("Presence of airway obstruction"),
        notes: z.string().optional().describe("Additional airway observations"),
      })
      .describe("Airway assessment"),

    breathing: z
      .object({
        spontaneous: z.boolean().describe("Whether breathing is spontaneous"),
        rate: z.number().describe("Respiratory rate"),
        effort: z
          .enum(["normal", "labored", "shallow", "absent"])
          .describe("Quality of breathing effort"),
        sounds: z
          .array(
            z.enum(["clear", "wheezing", "crackles", "diminished", "absent"]),
          )
          .describe("Breath sounds observed"),
      })
      .describe("Breathing assessment"),

    circulation: z
      .object({
        pulsePresent: z.boolean().describe("Presence of pulse"),
        pulseRate: z.number().describe("Pulse rate"),
        skinColor: z
          .enum(["normal", "pale", "cyanotic", "flushed"])
          .describe("Skin color"),
        skinTemp: z
          .enum(["normal", "cool", "cold", "hot"])
          .describe("Skin temperature"),
        capillaryRefill: z
          .enum(["<2 seconds", ">2 seconds"])
          .describe("Capillary refill time"),
      })
      .describe("Circulation assessment"),

    disability: z
      .object({
        consciousness: z
          .enum(["alert", "verbal", "pain", "unresponsive"])
          .describe("AVPU scale assessment"),
        pupils: z
          .object({
            reactive: z.boolean().describe("Whether pupils are reactive"),
            equal: z.boolean().describe("Whether pupils are equal"),
            size: z.number().describe("Pupil size in mm"),
          })
          .describe("Pupillary assessment"),
        movement: z
          .enum(["normal", "weak", "absent"])
          .describe("Motor function"),
      })
      .describe("Neurological status assessment"),

    exposure: z
      .object({
        temperature: z.number().describe("Body temperature"),
        injuries: z.array(z.string()).describe("Visible injuries noted"),
        environmentalFactors: z
          .string()
          .optional()
          .describe("Relevant environmental conditions"),
      })
      .describe("Exposure and environmental assessment"),
  })
  .describe("Primary survey findings");

/**
 * Secondary Survey Schema
 * Detailed head-to-toe examination
 */
const SecondarySurveySchema = z
  .object({
    head: z
      .object({
        inspection: z.string().describe("Visual examination findings"),
        palpation: z.string().describe("Palpation findings"),
        injuries: z
          .array(z.string())
          .optional()
          .describe("Identified injuries"),
      })
      .describe("Head examination"),

    neck: z
      .object({
        tenderness: z.boolean().describe("Presence of neck tenderness"),
        trachealDeviation: z
          .boolean()
          .describe("Presence of tracheal deviation"),
        jvd: z.boolean().describe("Jugular venous distention"),
        findings: z.string().optional().describe("Additional findings"),
      })
      .describe("Neck examination"),

    chest: z
      .object({
        inspection: z.string().describe("Visual examination findings"),
        palpation: z.string().describe("Palpation findings"),
        auscultation: z.string().describe("Breathing sounds"),
        injuries: z
          .array(z.string())
          .optional()
          .describe("Identified injuries"),
      })
      .describe("Chest examination"),

    abdomen: z
      .object({
        inspection: z.string().describe("Visual examination findings"),
        palpation: z
          .object({
            tenderness: z
              .boolean()
              .describe("Presence of abdominal tenderness"),
            rigidity: z.boolean().describe("Presence of abdominal rigidity"),
            location: z.string().optional().describe("Location of findings"),
          })
          .describe("Abdominal palpation findings"),
      })
      .describe("Abdominal examination"),

    pelvis: z
      .object({
        stability: z.boolean().describe("Pelvic stability"),
        tenderness: z.boolean().describe("Presence of pelvic tenderness"),
        findings: z.string().optional().describe("Additional findings"),
      })
      .describe("Pelvic examination"),

    extremities: z
      .object({
        upperLeft: z.string().describe("Left upper extremity findings"),
        upperRight: z.string().describe("Right upper extremity findings"),
        lowerLeft: z.string().describe("Left lower extremity findings"),
        lowerRight: z.string().describe("Right lower extremity findings"),
        pulses: z
          .object({
            radial: z.boolean().describe("Radial pulse present"),
            dorsalis: z.boolean().describe("Dorsalis pedis pulse present"),
          })
          .describe("Peripheral pulses"),
      })
      .describe("Extremities examination"),
  })
  .describe("Secondary survey findings");

/**
 * Intravenous Therapy Schema
 * Details of IV access and fluid administration
 */
const IntravenousTherapySchema = z
  .object({
    access: z
      .array(
        z.object({
          site: z.string().describe("IV access site"),
          gauge: z.number().describe("IV catheter gauge"),
          attempts: z.number().describe("Number of attempts"),
          successful: z.boolean().describe("Whether access was successful"),
          complications: z
            .array(z.string())
            .optional()
            .describe("Any complications"),
        }),
      )
      .describe("IV access attempts"),

    fluids: z
      .array(
        z.object({
          type: z.string().describe("Type of fluid administered"),
          volume: z.number().describe("Volume administered in mL"),
          rate: z.string().describe("Administration rate"),
          startTime: z.string().describe("Time fluid administration started"),
          endTime: z
            .string()
            .optional()
            .describe("Time fluid administration ended"),
        }),
      )
      .describe("Fluid administration details"),
  })
  .describe("Intravenous therapy record");

/**
 * Respiratory Distress Schema
 * Assessment of respiratory difficulties
 */
const RespiratoryDistressSchema = z
  .object({
    symptoms: z
      .array(
        z.enum([
          "shortness_of_breath",
          "wheezing",
          "chest_pain",
          "cough",
          "difficulty_speaking",
        ]),
      )
      .describe("Respiratory distress symptoms"),

    assessment: z
      .object({
        workOfBreathing: z
          .enum(["mild", "moderate", "severe"])
          .describe("Work of breathing assessment"),
        useOfAccessoryMuscles: z.boolean().describe("Use of accessory muscles"),
        speakInSentences: z
          .boolean()
          .describe("Ability to speak in full sentences"),
        position: z
          .enum(["sitting_upright", "tripod", "lying_flat"])
          .describe("Patient position"),
      })
      .describe("Respiratory assessment details"),

    interventions: z
      .array(
        z.object({
          type: z.string().describe("Type of intervention"),
          time: z.string().describe("Time of intervention"),
          response: z.string().describe("Patient's response to intervention"),
        }),
      )
      .describe("Respiratory interventions performed"),
  })
  .describe("Respiratory distress evaluation");

/**
 * Injury Schema
 * Detailed documentation of injuries
 */
const InjurySchema = z
  .object({
    injuries: z.array(
      z.object({
        side: z.enum(["anterior", "posterior"]),
        id: z.number(),
        x: z.number(),
        y: z.number(),
        symbol: z.string(),
      }),
    ),
  })
  .describe("Injury assessment record");

/**
 * Assessments Schema
 * Various clinical assessments
 */
const AssessmentsSchema = z
  .object({
    neurological: z
      .object({
        gcs: z
          .object({
            eyes: z.number().min(1).max(4).describe("GCS eye opening score"),
            verbal: z
              .number()
              .min(1)
              .max(5)
              .describe("GCS verbal response score"),
            motor: z
              .number()
              .min(1)
              .max(6)
              .describe("GCS motor response score"),
          })
          .describe("Glasgow Coma Scale scores"),
        pupils: z
          .object({
            leftReaction: z
              .enum(["brisk", "sluggish", "fixed"])
              .describe("Left pupil reaction"),
            rightReaction: z
              .enum(["brisk", "sluggish", "fixed"])
              .describe("Right pupil reaction"),
            leftSize: z.number().describe("Left pupil size in mm"),
            rightSize: z.number().describe("Right pupil size in mm"),
          })
          .describe("Pupillary assessment"),
      })
      .describe("Neurological assessment"),

    pain: z
      .object({
        score: z.number().min(0).max(10).describe("Pain score (0-10)"),
        location: z.string().describe("Pain location"),
        character: z.string().describe("Pain character"),
        radiation: z.string().optional().describe("Pain radiation"),
      })
      .describe("Pain assessment"),
  })
  .describe("Clinical assessments");

/**
 * Patient Handover Schema
 * Documentation of patient transfer of care
 */
const PatientHandoverSchema = z
  .object({
    receivingFacility: z.string().describe("Name of receiving facility"),
    staffMember: z
      .object({
        name: z.string().describe("Name of receiving staff member"),
        designation: z.string().describe("Staff member's designation"),
        signature: z.string().describe("Staff member's signature"),
      })
      .describe("Receiving staff details"),

    handoverTime: z.string().describe("Time of handover"),
    patientCondition: z.string().describe("Patient's condition at handover"),

    documentation: z
      .object({
        prfCopy: z.boolean().describe("PRF copy provided"),
        ecgStrips: z.boolean().describe("ECG strips provided"),
        otherDocs: z
          .array(z.string())
          .optional()
          .describe("Other documentation provided"),
      })
      .describe("Handover documentation"),
  })
  .describe("Patient handover record");

/**
 * Past Medical History Schema
 * Detailed patient medical history
 */
const PastMedicalHistorySchema = z
  .object({
    conditions: z
      .array(
        z.object({
          condition: z.string().describe("Medical condition"),
          duration: z.string().describe("Duration of condition"),
          treatment: z.string().optional().describe("Current treatment"),
        }),
      )
      .describe("Chronic conditions"),

    medications: z
      .array(
        z.object({
          name: z.string().describe("Medication name"),
          dose: z.string().describe("Medication dose"),
          frequency: z.string().describe("Administration frequency"),
          compliance: z.boolean().optional().describe("Medication compliance"),
        }),
      )
      .describe("Current medications"),

    allergies: z
      .array(
        z.object({
          allergen: z.string().describe("Allergen name"),
          reaction: z.string().describe("Allergic reaction"),
          severity: z
            .enum(["mild", "moderate", "severe"])
            .describe("Reaction severity"),
        }),
      )
      .describe("Known allergies"),

    surgeries: z
      .array(
        z.object({
          procedure: z.string().describe("Surgical procedure"),
          date: z.string().describe("Date of surgery"),
          complications: z.string().optional().describe("Any complications"),
        }),
      )
      .describe("Previous surgeries"),
  })
  .describe("Complete past medical history");

/**
 * Inventory Schema
 * Tracking of equipment and supplies used
 */
const InventorySchema = z
  .object({
    equipment: z
      .array(
        z.object({
          item: z.string().describe("Equipment name"),
          quantity: z.number().describe("Quantity used"),
          serialNumber: z
            .string()
            .optional()
            .describe("Equipment serial number"),
        }),
      )
      .describe("Equipment used"),

    medications: z
      .array(
        z.object({
          name: z.string().describe("Medication name"),
          quantity: z.number().describe("Quantity used"),
          unit: z.string().describe("Unit of measurement"),
          batchNumber: z
            .string()
            .optional()
            .describe("Medication batch number"),
        }),
      )
      .describe("Medications used"),

    disposables: z
      .array(
        z.object({
          item: z.string().describe("Disposable item name"),
          quantity: z.number().describe("Quantity used"),
        }),
      )
      .describe("Disposable items used"),
  })
  .describe("Inventory of items used during care");

/**
 * Complete PRF Form Schema
 * Combines all sub-schemas into the complete form structure
 */
export const PRFFormSchema = z.object({
  prfFormId: z
    .number()
    .optional()
    .describe("Unique identifier for the PRF form"),
  patientId: z
    .number()
    .optional()
    .describe("Unique identifier for the patient"),
  prfData: z
    .object({
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
    })
    .describe("Main PRF form data container"),
  createdAt: z
    .union([z.string(), z.date()])
    .optional()
    .describe("Form creation timestamp"),
  isCompleted: z
    .boolean()
    .default(false)
    .optional()
    .describe("Overall form completion status"),
  EmployeeID: z.string().describe("ID of the employee completing the form"),
  CrewID: z
    .string()
    .default("CrewID")
    .optional()
    .describe("ID of the responding crew"),
});

// Export types for TypeScript usage
export type PRFFormType = z.infer<typeof PRFFormSchema>;
export type PatientDetailsType = z.infer<typeof PatientDetailsSchema>;
export type CaseDetailsType = z.infer<typeof CaseDetailsSchema>;
export type TransportationType = z.infer<typeof TransportationSchema>;
export type IncidentInformationType = z.infer<typeof IncidentInformationSchema>;
export type DiagnosisType = z.infer<typeof DiagnosisSchema>;
export type VitalSignsType = z.infer<typeof VitalSignsSchema>;
export type MechanismOfInjuryType = z.infer<typeof MechanismOfInjurySchema>;
export type ProceduresType = z.infer<typeof ProceduresSchema>;
export type MedicationAdministeredType = z.infer<
  typeof MedicationAdministeredSchema
>;
export type PrimarySurveyType = z.infer<typeof PrimarySurveySchema>;
export type SecondarySurveyType = z.infer<typeof SecondarySurveySchema>;
export type IntravenousTherapyType = z.infer<typeof IntravenousTherapySchema>;
export type RespiratoryDistressType = z.infer<typeof RespiratoryDistressSchema>;
export type InjuryType = z.infer<typeof InjurySchema>;
export type AssessmentsType = z.infer<typeof AssessmentsSchema>;
export type PatientHandoverType = z.infer<typeof PatientHandoverSchema>;
export type PastMedicalHistoryType = z.infer<typeof PastMedicalHistorySchema>;
export type InventoryType = z.infer<typeof InventorySchema>;
