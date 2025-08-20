"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  bgColor?: string;
  progressColor?: string;
  textClassName?: string;
  direction?: "clockwise" | "counterclockwise";
  animateOnLoad?: boolean;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
  bgColor = "stroke-gray-200",
  progressColor = "stroke-blue-500",
  textClassName,
  direction = "clockwise",
  animateOnLoad = true,
}: ProgressRingProps) {
  // Calculate radius and center point
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = radius * 2 * Math.PI;

  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  // Calculate the offset based on progress
  const calculateOffset = (progress: number) => {
    if (direction === "clockwise") {
      return ((100 - progress) / 100) * circumference;
    } else {
      return (progress / 100) * circumference;
    }
  };

  // Initialize with the starting offset for animation
  const initialOffset = direction === "clockwise" ? circumference : 0;
  const [offset, setOffset] = useState(
    animateOnLoad ? initialOffset : calculateOffset(normalizedProgress),
  );
  const [isInitialRender, setIsInitialRender] = useState(true);
  const circleRef = useRef<SVGCircleElement>(null);

  // Handle initial animation
  useEffect(() => {
    if (isInitialRender && animateOnLoad) {
      // Use requestAnimationFrame to ensure the initial state is rendered first
      const animationFrame = requestAnimationFrame(() => {
        setOffset(calculateOffset(normalizedProgress));
        setIsInitialRender(false);
      });
      return () => cancelAnimationFrame(animationFrame);
    } else {
      setIsInitialRender(false);
    }
  }, [
    isInitialRender,
    animateOnLoad,
    normalizedProgress,
    circumference,
    direction,
    calculateOffset,
  ]);

  // Handle progress changes after initial render
  useEffect(() => {
    if (!isInitialRender) {
      setOffset(calculateOffset(normalizedProgress));
    }
  }, [
    normalizedProgress,
    circumference,
    direction,
    isInitialRender,
    calculateOffset,
  ]);

  // Determine SVG rotation based on direction
  const svgRotation = direction === "clockwise" ? "-rotate-90" : "rotate-90";

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={`transform ${svgRotation}`}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={bgColor}
        />
        <circle
          ref={circleRef}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            "transition-all duration-700 ease-in-out",
            progressColor,
          )}
          style={{
            transformOrigin: "center",
            transform:
              direction === "counterclockwise" ? "scale(-1, 1)" : "none",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("text-xl font-semibold", textClassName)}>
          {Math.round(normalizedProgress)}%
        </span>
      </div>
    </div>
  );
}
