"use client";
import {
  PRF_FORM,
  PRF_FORM_DATA,
  PRF_FORM_DATA_DISPLAY_NAMES,
} from "@/interfaces/prf-form";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { ForwardRefExoticComponent, RefAttributes } from "react";
import { PRFFormDataSchema } from "@/interfaces/prf-schema";
import { z } from "zod";
import { usePathname } from "next/navigation";
import { MapPinIcon } from "lucide-react";
import { DialogCloseProps } from "@radix-ui/react-dialog";
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
  const path = usePathname().split("/");

  const isCurrentStep =
    path[path.length - 1] ===
    sectionUrl.split("/")[sectionUrl.split("/").length - 1];
  const bg = cn({
    "bg-green-500 text-white": status === "complete",
    "bg-red-600 text-white": status === "completing" && !optional,
    "bg-gray-500 text-white": status === "completing" && optional,
    "bg-gray-300 text-black": status !== "complete" && status !== "completing",
  });

  const hoverText = cn({
    "hover:text-white": status === "complete" || status === "completing",
    "hover:text-black": status !== "complete" && status !== "completing",
  });

  const hoverBg = cn({
    "hover:bg-green-500 hover:text-white": status === "complete",
    "hover:bg-red-600 hover:text-white": status === "completing" && !optional,
    "hover:bg-gray-500 hover:text-white": status === "completing" && optional,
    "hover:bg-gray-300 hover:text-black":
      status !== "complete" && status !== "completing",
  });

  const isCurrentStepStyle = cn({
    "bg-green-500 text-white": status === "complete" && isCurrentStep,
    "bg-red-600 text-white":
      status === "completing" && !optional && isCurrentStep,
    "bg-gray-500 text-white":
      status === "completing" && optional && isCurrentStep,
    "bg-gray-300 text-black":
      status !== "complete" && status !== "completing" && isCurrentStep,
  });

  return (
    <div className="flex flex-col items-center w-full ">
      <Link href={sectionUrl ? sectionUrl : "#"}>
        <div
          className={`flex items-center space-x-2 transition-all rounded-full p-2 px-8 ${hoverBg} !${hoverText} ${isCurrentStepStyle}`}
        >
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full",
              bg
            )}
          >
            {number}
          </div>
          <div className={`text-sm capitalize `}>
            <div>{title}</div>
            {optional && (
              <div className="text-xs">
                Optional <br />
              </div>
            )}
          </div>
          {/* {isCurrentStep && <MapPinIcon className="ml-2 " />} */}
        </div>
      </Link>
      {!isLastStep && (
        <div className="h-6 w-1 m-1 bg-gray-300" style={{ width: "1px" }} />
      )}
    </div>
  );
}

function Steps({ steps }: { steps: any[] }) {
  return (
    <div className="flex items-start flex-col">
      {steps.map((step, index) => (
        <Step
          key={index}
          number={index + 1}
          title={step.title}
          optional={step.isOptional}
          status={step.status}
          sectionUrl={step.route}
          isLastStep={index === steps.length - 1}
        />
      ))}
    </div>
  );
}

type StepperProps = {
  prf: PRF_FORM;
};
export function Stepper({ prf }: StepperProps) {
  const prf_data: any = Object.entries(PRFFormDataSchema.shape).map(
    ([sectionKey]) => {
      const sectionSchema =
        PRFFormDataSchema.shape[sectionKey as keyof PRF_FORM_DATA];

      // Unwrap the ZodOptional to get the inner ZodObject
      const innerSchema =
        sectionSchema instanceof z.ZodOptional
          ? sectionSchema._def.innerType
          : sectionSchema;

      // Check if `isOptional` has a default value set
      const isOptional = innerSchema.shape.isOptional instanceof z.ZodDefault;

      const sectionData = prf.prfData[sectionKey as keyof PRF_FORM_DATA];

      // Determine if the section is optional
      const priority = sectionData
        ? sectionData.isOptional
          ? "optional"
          : "required"
        : isOptional
        ? "required"
        : "optional";
      const route =
        sectionKey === "case_details"
          ? `/edit-prf/${prf.prfFormId}`
          : `/edit-prf/${prf.prfFormId}/${sectionKey.replace(/_/g, "-")}`;

      return {
        title: PRF_FORM_DATA_DISPLAY_NAMES[sectionKey as keyof PRF_FORM_DATA],
        isOptional: priority === "optional",
        status: sectionData?.isCompleted ? "complete" : "completing",
        route,
      };
    }
  );

  return (
    <div className="p-4">
      <Steps steps={prf_data} />
    </div>
  );
}
