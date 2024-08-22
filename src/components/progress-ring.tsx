import { cn } from "@/lib/utils";
import React from "react";

interface ProgressRingProps {
  progress: number;
  max: number;
  className?: string;
}

const FormFillProgress: React.FC<ProgressRingProps> = ({
  progress,
  max,
  className,
}) => {
  const radius = 100; // Adjust the radius to make the circle smaller
  const circumference = 2 * Math.PI * radius;
  const progressPercentage = (progress / max) * 100;

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
        <span className="text-lg text-primary/50">{`${progress} of ${max} completed`}</span>
      </div>
    </div>
  );
};

export default FormFillProgress;
