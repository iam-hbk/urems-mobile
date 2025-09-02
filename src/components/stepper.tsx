"use client";
import {
  PRF_FORM_DATA,
  PRF_FORM_DATA_DISPLAY_NAMES,
  PRFormResponseStatus,
  SectionName,
} from "@/interfaces/prf-form";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { PRFFormDataSchema } from "@/interfaces/prf-schema";
import { z } from "zod";
import { usePathname } from "next/navigation";
import { sectionDescriptions } from "@/interfaces/prf-form";
import { useGetPRFResponseSectionStatus } from "@/hooks/prf/usePrfForms";

type StepStatus = "complete" | "completing";

type SectionDisplayName = (typeof sectionDescriptions)[number];
type SectionInnerShape = z.ZodRawShape & { isOptional: z.ZodTypeAny };
type Props = {
  number: number;
  title: string;
  optional: boolean;
  status: StepStatus;
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
    <div className="flex w-full flex-col items-center">
      <Link href={sectionUrl ? sectionUrl : "#"}>
        <div
          className={`flex items-center space-x-2 rounded-full p-2 px-8 transition-all ${hoverBg} !${hoverText} ${isCurrentStepStyle}`}
        >
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              bg,
            )}
          >
            {number}
          </div>
          <div className={`text-sm capitalize`}>
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
        <div className="m-1 h-6 w-1 bg-gray-300" style={{ width: "1px" }} />
      )}
    </div>
  );
}

type StepItem = {
  title: SectionDisplayName;
  isOptional: boolean;
  status: StepStatus;
  route: string;
};

function Steps({ steps }: { steps: StepItem[] }) {
  return (
    <div className="flex flex-col items-start">
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

export function Stepper() {
  const pathname = usePathname();
  const prfID = pathname.split("/")[2]; // Extract prfID from /edit-prf/[prfID]/...

  const {
    data: statusData,
    isLoading,
    error,
  } = useGetPRFResponseSectionStatus(prfID);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center">
          <div className="text-sm text-gray-500">Loading progress...</div>
        </div>
      </div>
    );
  }

  if (error || !statusData) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center">
          <div className="text-sm text-red-500">
            Error loading progress data
          </div>
        </div>
      </div>
    );
  }

  // Map the status data to StepItem format
  const prf_data: StepItem[] = statusData.sections.map((section) => {
    const sectionKey = section.sectionName as keyof typeof PRF_FORM_DATA_DISPLAY_NAMES;
    const route =
      sectionKey === "case_details"
        ? `/edit-prf/${prfID}`
        : `/edit-prf/${prfID}/${sectionKey.replace(/_/g, "-")}`;

    return {
      title: PRF_FORM_DATA_DISPLAY_NAMES[sectionKey],
      isOptional: !section.isRequired, // If not required, then it's optional
      status: section.isCompleted ? "complete" : "completing",
      route,
    };
  });

  return (
    <div className="p-4">
      <Steps steps={prf_data} />
    </div>
  );
}
