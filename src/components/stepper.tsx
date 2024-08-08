import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
type Props = {
  number: number;
  title: string;
  optional: boolean;
  status: string;
  sectionUrl: string;
  isLastStep?: boolean;
};

function Step({
  number,
  title,
  optional,
  status,
  sectionUrl,
  isLastStep,
}: Props) {
  const bg = cn({
    "bg-green-500 text-white": status === "complete",
    "bg-orange-500 text-white": status === "completing",
    "bg-gray-300 text-black": status !== "complete" && status !== "completing",
  });

  const hoverText = cn({
    "hover:text-white": status === "complete" || status === "completing",
    "hover:text-black": status !== "complete" && status !== "completing",
  });

  const hoverBg = cn({
    "hover:bg-green-500 hover:text-white": status === "complete",
    "hover:bg-orange-500 hover:text-white": status === "completing",
    "hover:bg-gray-300 hover:text-black":
      status !== "complete" && status !== "completing",
  });

  return (
    <div className="flex flex-col items-center">
      <Link href={sectionUrl}>
        <div
          className={`flex items-center space-x-2 transition-all rounded-full p-2 ${hoverBg} !${hoverText}`}
        >
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full",
              bg
            )}
          >
            {number}
          </div>
          <div className={`text-sm `}>
            <div>{title}</div>
            {optional && (
              <div
                className={`text-xs ${
                  optional ? "text-gray-500" : "text-black"
                }`}
              >
                Optional <br />
              </div>
            )}
          </div>
        </div>
      </Link>
      {!isLastStep && (
        <div className="h-14 w-1 m-1 bg-gray-300" style={{ width: "1px" }} />
      )}
    </div>
  );
}

function Steps({ steps }: { steps: any[] }) {
  return (
    <div className="flex flex-col ">
      {steps.map((step, index) => (
        <Step
          key={index}
          number={index + 1}
          title={step.title}
          optional={step.isOptional}
          status={step.status}
          sectionUrl={step.sectionUrl}
          isLastStep={index === steps.length - 1}
        />
      ))}
    </div>
  );
}

const form = {
  patient_details: {
    section_name: "Patient Details",
    data: {
      name: "",
      age: "",
      gender: "",
      id: "",
      surname: "",
      passport: "",
      nextOfKin: {
        name: "",
        relationToPatient: "",
        email: "",
        physicalAddress: "",
        phoneNo: "",
        alternatePhoneNo: "",
        otherNOKPhoneNo: "",
      },
      medicalAid: {
        name: "",
        number: "",
        principalMember: "",
        authNo: "",
      },
      employer: {
        name: "",
        workPhoneNo: "",
        workAddress: "",
      },
    },
    status: "incomplete", // completing, complete
    isOptional: false, // true
    sectionUrl: "/patient-details",
  },
  transportation: {
    section_name: "Transportation",
    data: {
      fromSuburbTown: "",
      by: "",
      to: "",
      crewDetails: [
        {
          initialAndSurname: "",
          HPCSANo: "",
        },
      ],
    },
    status: "completing", // completing, complete
    isOptional: false, // true
    sectionUrl: "/transportation",
  },
  medical_history: {
    section_name: "Medical History",
    data: {
      conditions: "",
      medications: "",
      allergies: "",
    },
    status: "complete", // completing, complete
    isOptional: true, // true
    sectionUrl: "/medical-history",
  },
} as any;

export function Stepper() {
  // Transform the form data into steps
  const stepsData = Object.keys(form).map((key, index) => ({
    title: form[key].section_name,
    isOptional: form[key].isOptional,
    status: form[key].status,
    sectionUrl: form[key].sectionUrl,
  }));

  return (
    <div className="p-4">
      <Steps steps={stepsData} />
    </div>
  );
}
