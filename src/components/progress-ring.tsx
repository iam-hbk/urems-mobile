import React from "react";

interface ProgressRingProps {
  progress: number;
  max: number;
}

const FormFillProgress: React.FC<ProgressRingProps> = ({ progress, max }) => {
  const radius = 100; // Adjust the radius to make the circle smaller
  const circumference = 2 * Math.PI * radius;
  const progressPercentage = (progress / max) * 100;

  return (
    <div className=" relative flex items-center justify-center w-full max-w-xs mx-auto">
      <svg className="transform -rotate-90 w-56 h-56 ">
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
      <div className="absolute text-2xl sm:text-3xl  lg:text-5xl w-full flex justify-center items-center flex-col">
        <span>{`${progressPercentage.toFixed(0)}%`}</span>
        <span className="text-lg text-primary/50">{`${progress} of ${max} completed`}</span>
      </div>
    </div>
  );
};

export default FormFillProgress;
