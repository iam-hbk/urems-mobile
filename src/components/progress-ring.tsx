import { useGetPRFResponseSectionStatus } from "@/hooks/prf/usePrfForms";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React from "react";

interface ProgressRingProps {
  className?: string;
}

const FormFillProgress: React.FC<ProgressRingProps> = ({ className }) => {
  const prfID = usePathname().split("/")[2];
  // Fetch section status and calculate progress here
  const {
    data: PRFormSectionStatus,
    isLoading,
    error,
  } = useGetPRFResponseSectionStatus(prfID);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!!error) {
    return (
      <div className="flex w-full max-w-xs flex-col items-center justify-center rounded-full">
        <h1>Error</h1>
        <p>Could not fetch PRF section status: {error.detail}</p>
      </div>
    );
  }

  if (!PRFormSectionStatus) {
    return (
      <div className="flex w-full max-w-xs flex-col items-center justify-center rounded-full">
        <h1>Error</h1>
        <p>Could not fetch PRF section status</p>
      </div>
    );
  }

  const radius = 100; // Adjust the radius to make the circle smaller
  const circumference = 2 * Math.PI * radius;
  const progressPercentage =
    (PRFormSectionStatus?.completedSections /
      PRFormSectionStatus?.totalSections) *
    100;

  return (
    <div
      className={cn(
        "relative mx-auto flex w-full max-w-xs items-center justify-center",
        className,
      )}
    >
      <svg className="h-56 w-56 -rotate-90 transform">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth="20"
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth="20"
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={
            circumference - (progressPercentage / 100) * circumference
          }
          className="text-primary"
        />
      </svg>
      <div className="absolute flex w-full flex-col items-center justify-center text-2xl sm:text-3xl lg:text-5xl">
        <span>{`${progressPercentage.toFixed(0)}%`}</span>
        <span className="text-lg text-primary/50">{`${PRFormSectionStatus.completedSections} of ${PRFormSectionStatus.totalSections} completed`}</span>
      </div>
    </div>
  );
};

export default FormFillProgress;
