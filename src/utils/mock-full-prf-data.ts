import { PRFFormType } from "@/interfaces/prf-schema-docs";

export const data: PRFFormType[] = [
  {
    prfFormId: 12345,
    patientId: 67890,
    prfData: {
      case_details: {
        isOptional: false,
        isCompleted: true,
        data: {
          regionDistrict: "Downtown",
          base: "Station 1",
          province: "Gauteng",
          vehicle: {
            id: 5,
            name: "Rescue 1",
            license: "ABC 123 GP",
            registrationNumber: "REG456",
          },
          dateOfCase: new Date("2024-01-20T10:00:00.000Z"),
        },
      },
      patient_details: {
        isOptional: false,
        isCompleted: true,
        data: {
          unableToObtainInformation: {
            status: false,
          },
          age: 35,
          ageUnit: "years",
          gender: "male",
          patientName: "John",
          patientSurname: "Doe",
          id: "1234567890",
          passport: "P1234567",
          nextOfKin: {
            name: "Jane Doe",
            relationToPatient: "Wife",
            email: "jane.doe@example.com",
            physicalAddress: "123 Main St",
            phoneNo: "555-123-4567",
            alternatePhoneNo: "555-987-6543",
            otherNOKPhoneNo: "555-111-2222",
          },
          medicalAid: {
            name: "BestMed",
            number: "MA12345",
            principalMember: "John Doe",
            authNo: "AUTH6789",
          },
          employer: {
            name: "Acme Corp",
            workPhoneNo: "555-222-3333",
            workAddress: "456 Oak Ave",
          },
          pastHistory: {
            allergies: "Penicillin",
            medication: "Lisinopril",
            medicalHx: "Hypertension",
            lastMeal: "08:00 Sandwich",
            cva: false,
            epilepsy: false,
            cardiac: true,
            byPass: true,
            dmOneOrTwo: false,
            HPT: true,
            asthma: false,
            copd: false,
          },
        },
      },
      incident_information: {
        isOptional: false,
        isCompleted: true,
        data: {
          sceneAddress: "789 Pine Ln",
          dispatchInfo: "MVC reported",
          onArrival: "Patient conscious",
          chiefComplaint: "Chest pain",
        },
      },
      transportation: {
        isOptional: false,
        isCompleted: true,
        data: {
          fromSuburbTown: "Sandton",
          by: "Ambulance",
          to: "City Hospital",
          crewDetails: [
            {
              initialAndSurname: "AS Surname",
              HPCSANo: "HP12345",
            },
          ],
        },
      },
      primary_survey: {
        isOptional: false,
        isCompleted: true,
        data: {
          airway: {
            patent: true,
            obstruction: false,
          },
          breathing: {
            spontaneous: true,
            rate: 16,
            effort: "normal",
            sounds: ["clear"],
          },
          circulation: {
            pulsePresent: true,
            pulseRate: 80,
            skinColor: "normal",
            skinTemp: "normal",
            capillaryRefill: "<2 seconds",
          },
          disability: {
            consciousness: "alert",
            pupils: {
              reactive: true,
              equal: true,
              size: 3,
            },
            movement: "normal",
          },
          exposure: {
            temperature: 36.8,
            injuries: ["None visible"],
          },
        },
      },
      secondary_survey: {
        isOptional: false,
        isCompleted: true,
        data: {
          head: {
            inspection: "Normal",
            palpation: "No abnormalities",
            injuries: [],
          },
          neck: {
            tenderness: false,
            trachealDeviation: false,
            jvd: false,
          },
          chest: {
            inspection: "Normal",
            palpation: "No pain",
            auscultation: "Clear",
            injuries: [],
          },
          abdomen: {
            inspection: "Soft",
            palpation: {
              tenderness: false,
              rigidity: false,
            },
          },
          pelvis: {
            stability: true,
            tenderness: false,
          },
          extremities: {
            upperLeft: "Normal",
            upperRight: "Normal",
            lowerLeft: "Normal",
            lowerRight: "Normal",
            pulses: {
              radial: true,
              dorsalis: true,
            },
          },
        },
      },
      vital_signs: {
        isOptional: false,
        isCompleted: true,
        data: {
          readings: [
            {
              time: "10:05",
              bp: {
                systolic: 120,
                diastolic: 80,
              },
              pulse: 80,
              respiration: 16,
              temperature: 36.8,
              spo2: 98,
              gcs: {
                eyes: 4,
                verbal: 5,
                motor: 6,
              },
              pupils: {
                left: {
                  size: 3,
                  reaction: "brisk",
                },
                right: {
                  size: 3,
                  reaction: "brisk",
                },
              },
            },
          ],
        },
      },
      intravenous_therapy: {
        isOptional: false,
        isCompleted: true,
        data: {
          access: [
            {
              site: "Left arm",
              gauge: 18,
              attempts: 1,
              successful: true,
              complications: [],
            },
          ],
          fluids: [
            {
              type: "Normal Saline",
              volume: 500,
              rate: "100 mL/hr",
              startTime: "10:10",
            },
          ],
        },
      },
      history_taking: {
        isOptional: false,
        isCompleted: true,
        data: "Patient reports chest pain started an hour ago.",
      },
      // physical_exam: {
      //   isOptional: false,
      //   isCompleted: true,
      //   data: "Auscultation reveals clear lung sounds. Heart sounds normal.",
      // },
      interventions: {
        isOptional: false,
        isCompleted: true,
        data: "Oxygen administered via nasal cannula.",
      },
      diagnosis: {
        isOptional: false,
        isCompleted: true,
        data: {
          diagnosis: "Possible MI",
          priorityType: "number",
          priority: "2",
        },
      },
      medication_administration: {
        isOptional: false,
        isCompleted: true,
        data: {
          medications: [
            {
              medicine: "Aspirin",
              medicationId: "ASP123",
              dose: "300mg",
              route: "Oral",
              time: {
                value: "10:15",
                unknown: false,
              },
              hpcsa: "HP12345",
              name: "AS Surname",
              signature: "signature",
            },
          ],
          consultation: {
            consulted: true,
            practitioner: "Dr. Smith",
            hpcsa: "MD67890",
            summaryOfConsult: "Advised to administer aspirin.",
          },
        },
      },
      mechanism_of_injury: {
        isOptional: false,
        isCompleted: true,
        data: {
          vehicleType: {
            occured: true,
            vehicleTypesSelection: "MVA",
          },
          impactType: ["Frontal Impact"],
          speed: "60-100km/h",
          personType: "Driver",
          safetyFeatures: ["Airbags", "Restrained"],
          extractionMethod: "Self-Extricated",
          burns: {
            occurred: false,
            duration: "",
          },
        },
      },
      procedures: {
        isOptional: false,
        isCompleted: true,
        data: {
          airway: {
            ett: false,
            ettCuffPressure: "Not Measured",
            gastricTube: false,
            iGel: false,
            lma: false,
            opa: false,
            suction: false,
          },
          breathing: {
            bvm: false,
            cpap: false,
            etco2: false,
            oxygen: true,
            ventilation: false,
          },
          circulation: {
            cpr: false,
            defib: false,
            ecg: true,
            iv: true,
            io: false,
          },
        },
      },
      respiratory_distress: {
        isOptional: false,
        isCompleted: true,
        data: {
          symptoms: [],
          assessment: {
            workOfBreathing: "mild",
            useOfAccessoryMuscles: false,
            speakInSentences: true,
            position: "sitting_upright",
          },
          interventions: [],
        },
      },
      injuries: {
        data: {
          injuries: [
            {
              side: "anterior",
              id: 0,
              x: 101.65625,
              y: 108,
              symbol: "M1 13L5.75472 1L10 13L14.7547 1L19 13",
            },
          ],
        },
        isCompleted: true,
        isOptional: false,
      },
      assessments: {
        isOptional: false,
        isCompleted: true,
        data: {
          neurological: {
            gcs: {
              eyes: 4,
              verbal: 5,
              motor: 6,
            },
            pupils: {
              leftReaction: "brisk",
              rightReaction: "brisk",
              leftSize: 3,
              rightSize: 3,
            },
          },
          pain: {
            score: 6,
            location: "Chest",
            character: "Sharp",
          },
        },
      },
      patient_handover: {
        isOptional: false,
        isCompleted: true,
        data: {
          receivingFacility: "City Hospital",
          staffMember: {
            name: "Nurse Johnson",
            designation: "RN",
            signature: "Signature",
          },
          handoverTime: "10:30",
          patientCondition: "Stable",
          documentation: {
            prfCopy: true,
            ecgStrips: true,
          },
        },
      },
      notes: {
        isOptional: false,
        isCompleted: true,
        data: "Patient stable on arrival at hospital.",
      },
      past_medical_history: {
        isOptional: false,
        isCompleted: true,
        data: {
          conditions: [
            {
              condition: "Hypertension",
              duration: "5 years",
            },
          ],
          medications: [
            {
              name: "Lisinopril",
              dose: "10mg",
              frequency: "Daily",
            },
          ],
          allergies: [
            {
              allergen: "Penicillin",
              reaction: "Rash",
              severity: "mild",
            },
          ],
          surgeries: [],
        },
      },
      inventory: {
        isOptional: false,
        isCompleted: true,
        data: {
          equipment: [
            {
              item: "Oxygen Tank",
              quantity: 1,
            },
          ],
          medications: [
            {
              name: "Aspirin",
              quantity: 1,
              unit: "tablet",
            },
          ],
          disposables: [
            {
              item: "Gloves",
              quantity: 2,
            },
          ],
        },
      },
    },
    createdAt: "2024-01-20T09:00:00.000Z",
    isCompleted: true,
    EmployeeID: "EMP001",
    CrewID: "CR123",
  },
  {
    prfFormId: 54321,
    patientId: 98765,
    prfData: {
      case_details: {
        isOptional: false,
        isCompleted: true,
        data: {
          regionDistrict: "Uptown",
          base: "Station 2",
          province: "Western Cape",
          vehicle: {
            id: 10,
            name: "Response 2",
            license: "XYZ 789 WC",
            registrationNumber: "REG987",
          },
          dateOfCase: new Date("2024-01-21T14:00:00.000Z"),
        },
      },
      patient_details: {
        isOptional: false,
        isCompleted: true,
        data: {
          unableToObtainInformation: {
            status: false,
          },
          age: 62,
          ageUnit: "years",
          gender: "female",
          patientName: "Alice",
          patientSurname: "Smith",
          id: "0987654321",
          passport: "P7654321",
          nextOfKin: {
            name: "Bob Smith",
            relationToPatient: "Son",
            email: "bob.smith@example.com",
            physicalAddress: "456 Elm St",
            phoneNo: "555-444-5555",
            alternatePhoneNo: "555-666-7777",
            otherNOKPhoneNo: "555-888-9999",
          },
          medicalAid: {
            name: "Discovery",
            number: "MA54321",
            principalMember: "Alice Smith",
            authNo: "AUTH9876",
          },
          employer: {
            name: "Beta Industries",
            workPhoneNo: "555-111-4444",
            workAddress: "789 Maple Dr",
          },
          pastHistory: {
            allergies: "Sulfa drugs",
            medication: "Metformin",
            medicalHx: "Diabetes",
            lastMeal: "12:00 Salad",
            cva: false,
            epilepsy: false,
            cardiac: false,
            byPass: false,
            dmOneOrTwo: true,
            HPT: false,
            asthma: true,
            copd: false,
          },
        },
      },
      incident_information: {
        isOptional: false,
        isCompleted: true,
        data: {
          sceneAddress: "321 Oak Ave",
          dispatchInfo: "Fall reported",
          onArrival: "Patient alert",
          chiefComplaint: "Hip pain",
        },
      },
      transportation: {
        isOptional: false,
        isCompleted: true,
        data: {
          fromSuburbTown: "Camps Bay",
          by: "Ambulance",
          to: "Coastal Hospital",
          crewDetails: [
            {
              initialAndSurname: "CD Surname",
              HPCSANo: "HP54321",
            },
          ],
        },
      },
      primary_survey: {
        isOptional: false,
        isCompleted: true,
        data: {
          airway: {
            patent: true,
            obstruction: false,
          },
          breathing: {
            spontaneous: true,
            rate: 18,
            effort: "normal",
            sounds: ["clear"],
          },
          circulation: {
            pulsePresent: true,
            pulseRate: 75,
            skinColor: "normal",
            skinTemp: "normal",
            capillaryRefill: "<2 seconds",
          },
          disability: {
            consciousness: "alert",
            pupils: {
              reactive: true,
              equal: true,
              size: 2,
            },
            movement: "normal",
          },
          exposure: {
            temperature: 37.0,
            injuries: ["Possible hip fracture"],
          },
        },
      },
      secondary_survey: {
        isOptional: false,
        isCompleted: true,
        data: {
          head: {
            inspection: "Normal",
            palpation: "No abnormalities",
            injuries: [],
          },
          neck: {
            tenderness: false,
            trachealDeviation: false,
            jvd: false,
          },
          chest: {
            inspection: "Normal",
            palpation: "No pain",
            auscultation: "Clear",
            injuries: [],
          },
          abdomen: {
            inspection: "Soft",
            palpation: {
              tenderness: false,
              rigidity: false,
            },
          },
          pelvis: {
            stability: false,
            tenderness: true,
          },
          extremities: {
            upperLeft: "Normal",
            upperRight: "Normal",
            lowerLeft: "Pain with movement",
            lowerRight: "Normal",
            pulses: {
              radial: true,
              dorsalis: true,
            },
          },
        },
      },
      vital_signs: {
        isOptional: false,
        isCompleted: true,
        data: {
          readings: [
            {
              time: "14:05",
              bp: {
                systolic: 130,
                diastolic: 85,
              },
              pulse: 75,
              respiration: 18,
              temperature: 37.0,
              spo2: 97,
              gcs: {
                eyes: 4,
                verbal: 5,
                motor: 6,
              },
              pupils: {
                left: {
                  size: 2,
                  reaction: "brisk",
                },
                right: {
                  size: 2,
                  reaction: "brisk",
                },
              },
            },
          ],
        },
      },
      intravenous_therapy: {
        isOptional: false,
        isCompleted: true,
        data: {
          access: [
            {
              site: "Right arm",
              gauge: 20,
              attempts: 1,
              successful: true,
              complications: [],
            },
          ],
          fluids: [
            {
              type: "Normal Saline",
              volume: 250,
              rate: "50 mL/hr",
              startTime: "14:10",
            },
          ],
        },
      },
      history_taking: {
        isOptional: false,
        isCompleted: true,
        data: "Patient reports fall at home. Complains of hip pain.",
      },
      // physical_exam: {
      //   isOptional: false,
      //   isCompleted: true,
      //   data: "External rotation of left leg. Pain on palpation of hip.",
      // },
      interventions: {
        isOptional: false,
        isCompleted: true,
        data: "Splint applied to left leg.",
      },
      diagnosis: {
        isOptional: false,
        isCompleted: true,
        data: {
          diagnosis: "Possible hip fracture",
          priorityType: "color",
          priority: "orange",
        },
      },
      medication_administration: {
        isOptional: false,
        isCompleted: true,
        data: {
          medications: [
            {
              medicine: "Paracetamol",
              medicationId: "PCM456",
              dose: "1g",
              route: "IV",
              time: {
                value: "14:15",
                unknown: false,
              },
              hpcsa: "HP98765",
              name: "CD Surname",
              signature: "signature",
            },
          ],
          consultation: {
            consulted: true,
            practitioner: "Dr. Brown",
            hpcsa: "MD12345",
            summaryOfConsult: "Advised to administer pain medication.",
          },
        },
      },
      mechanism_of_injury: {
        isOptional: false,
        isCompleted: true,
        data: {
          vehicleType: {
            occured: false,
          },
          burns: {
            occurred: false,
            duration: "",
          },
        },
      },
      procedures: {
        isOptional: false,
        isCompleted: true,
        data: {
          airway: {
            ett: false,
            ettCuffPressure: "Not Measured",
            gastricTube: false,
            iGel: false,
            lma: false,
            opa: false,
            suction: false,
          },
          breathing: {
            bvm: false,
            cpap: false,
            etco2: false,
            oxygen: true,
            ventilation: false,
          },
          circulation: {
            cpr: false,
            defib: false,
            ecg: true,
            iv: true,
            io: false,
          },
        },
      },
      respiratory_distress: {
        isOptional: false,
        isCompleted: true,
        data: {
          symptoms: [],
          assessment: {
            workOfBreathing: "mild",
            useOfAccessoryMuscles: false,
            speakInSentences: true,
            position: "sitting_upright",
          },
          interventions: [],
        },
      },
      injuries: {
        data: {
          injuries: [
            {
              side: "anterior",
              id: 0,
              x: 101.65625,
              y: 108,
              symbol: "M1 13L5.75472 1L10 13L14.7547 1L19 13",
            },
          ],
        },
        isCompleted: true,
        isOptional: false,
      },
      assessments: {
        isOptional: false,
        isCompleted: true,
        data: {
          neurological: {
            gcs: {
              eyes: 4,
              verbal: 5,
              motor: 6,
            },
            pupils: {
              leftReaction: "brisk",
              rightReaction: "brisk",
              leftSize: 2,
              rightSize: 2,
            },
          },
          pain: {
            score: 8,
            location: "Hip",
            character: "Sharp, localized",
          },
        },
      },
      patient_handover: {
        isOptional: false,
        isCompleted: true,
        data: {
          receivingFacility: "Coastal Hospital",
          staffMember: {
            name: "Dr. Green",
            designation: "ER Physician",
            signature: "Signature",
          },
          handoverTime: "14:30",
          patientCondition: "Stable",
          documentation: {
            prfCopy: true,
            ecgStrips: false,
          },
        },
      },
      notes: {
        isOptional: false,
        isCompleted: true,
        data: "Patient transferred to ER for further evaluation.",
      },
      past_medical_history: {
        isOptional: false,
        isCompleted: true,
        data: {
          conditions: [
            {
              condition: "Diabetes",
              duration: "10 years",
            },
          ],
          medications: [
            {
              name: "Metformin",
              dose: "500mg",
              frequency: "BID",
            },
          ],
          allergies: [
            {
              allergen: "Sulfa drugs",
              reaction: "Hives",
              severity: "mild",
            },
          ],
          surgeries: [],
        },
      },
      inventory: {
        isOptional: false,
        isCompleted: true,
        data: {
          equipment: [
            {
              item: "Splint",
              quantity: 1,
            },
          ],
          medications: [
            {
              name: "Paracetamol",
              quantity: 1,
              unit: "vial",
            },
          ],
          disposables: [
            {
              item: "Gloves",
              quantity: 2,
            },
          ],
        },
      },
    },
    createdAt: "2024-01-21T13:00:00.000Z",
    isCompleted: true,
    EmployeeID: "EMP002",
    CrewID: "CR456",
  },
];
