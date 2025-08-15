"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import {
  ClipboardList,
  User,
  Truck,
  AlertTriangle,
  HeartPulse as Heartbeat,
  Stethoscope,
  Activity,
  FileText,
  Clipboard,
  BriefcaseMedical as FirstAid,
  Pill,
  UserCheck,
  Edit3,
  MoreHorizontal,
  Settings,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  ClipboardPlus,
  Cog as Bandage,
  ArrowDownUp,
  Wind,
  PersonStanding,
} from "lucide-react";
import {
  PRF_FORM,
  PRF_FORM_DATA,
  PRF_FORM_DATA_DISPLAY_NAMES,
  sectionDescriptions,
} from "@/interfaces/prf-form";
import { PRFFormDataSchema } from "@/interfaces/prf-schema";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

// utils
const animations = ["animate-shake1", "animate-shake2", "animate-shake3"];

// Move iconMap before the component and export it
export const iconMap = {
  "Case Details": ClipboardList,
  "Patient Details": User,
  Transportation: Truck,
  "Incident Information": AlertTriangle,
  "Primary Survey": Heartbeat,
  "Secondary Survey": Stethoscope,
  "Vital Signs": Activity,
  // "History Taking": FileText,
  // "Physical Exam": Clipboard,
  // Interventions: FirstAid,
  "Medication Administration": Pill,
  "Patient Handover": UserCheck,
  Notes: Edit3,
  Diagnosis: ClipboardPlus,
  "Mechanism of Injury": Bandage,
  "Procedures": ArrowDownUp,
  "Respiratory Distress Assessment": Wind,
  "Injuries": PersonStanding,
  "Assessments": ClipboardPlus,
};

// QuickLinks Component
export default function QuickLinks({ prf }: { prf: PRF_FORM }) {
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const [customizing, setCustomizing] = useState(false);

  useEffect(() => {
    const shapedData = getPrfDataShapedSectionsForQuickLinks(prf);
    const savedItems = localStorage.getItem("visibleNavItems");
    if (savedItems) {
      setVisibleItems(JSON.parse(savedItems));
    } else {
      // Set initial items
      const initialItems = shapedData
        .filter((item) => item.priority === "required")
        .map((item) => item.sectionDescription);
      setVisibleItems(initialItems);
    }
  }, []);

  const toggleItem = (item: string) => {
    setVisibleItems((prev) => {
      const newItems = prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item];
      localStorage.setItem("visibleNavItems", JSON.stringify(newItems));
      return newItems;
    });
  };

  const moveItem = (item: string, direction: "up" | "down") => {
    setVisibleItems((prev) => {
      const index = prev.indexOf(item);
      if (index === -1) return prev;

      const newItems = [...prev];
      if (direction === "up" && index > 0) {
        [newItems[index - 1], newItems[index]] = [
          newItems[index],
          newItems[index - 1],
        ];
      } else if (direction === "down" && index < newItems.length - 1) {
        [newItems[index], newItems[index + 1]] = [
          newItems[index + 1],
          newItems[index],
        ];
      }

      localStorage.setItem("visibleNavItems", JSON.stringify(newItems));
      return newItems;
    });
  };

  return (
    <nav className="w-full rounded-lg border p-4 ">
      <div className="flex flex-wrap items-start gap-2">
        <div className="grid max-w-[calc(100%-3rem)] flex-grow grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
          {visibleItems.map((item) => {
            const randomAnimation =
              animations[Math.floor(Math.random() * animations.length)];
            const optionData = getPrfDataShapedSectionsForQuickLinks(prf).find(
              (section) => section.sectionDescription === item,
            );
            // if (!optionData) return null;

            const Icon =
              optionData?.icon ||
              iconMap[item as keyof typeof iconMap] ||
              ClipboardPlus;
            const isCompleted = optionData?.status === "completed";

            const isOptional = optionData?.priority === "optional";

            return (
              <Link key={item} href={`/edit-prf/${optionData?.route}`}>
                <Button
                  variant={"secondary"}
                  className={cn({
                    "relative flex w-full items-center justify-start space-x-1 border":
                      true,
                    "border-green-700 dark:border-green-500": isCompleted,
                    "border-orange-400 dark:border-orange-600": isOptional,
                    "border-destructive": !isCompleted && !isOptional,
                    [`${randomAnimation} border-2 border-dashed border-gray-500`]:
                      customizing,
                  })}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{item}</span>
                  {!customizing &&
                    (isCompleted ? (
                      <Badge className="absolute -right-2 -top-2 rounded-full bg-green-700 p-1 dark:bg-green-500">
                        <CheckCircle className="h-3 w-3" />
                      </Badge>
                    ) : (
                      <Badge
                        className={cn({
                          "absolute -right-2 -top-2 rounded-full bg-destructive p-1":
                            true,
                          "bg-orange-400 dark:bg-orange-600": isOptional,
                        })}
                      >
                        <AlertCircle className="h-3 w-3" />
                      </Badge>
                    ))}
                </Button>
              </Link>
            );
          })}
        </div>
        <Popover open={customizing} onOpenChange={setCustomizing}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="ml-auto">
              {customizing ? (
                <Settings className="h-4 w-4" />
              ) : (
                <MoreHorizontal className="h-4 w-4" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <h3 className="mb-2 font-medium">Customize Navigation</h3>
            <ScrollArea className="h-[300px]">
              <div className="pr-4">
                {sectionDescriptions.map((item) => (
                  <div key={item} className="mb-2 flex items-center space-x-2">
                    <Checkbox
                      id={item}
                      checked={visibleItems.includes(item)}
                      onCheckedChange={() => toggleItem(item)}
                    />
                    <label
                      htmlFor={item}
                      className="flex-grow text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item}
                    </label>
                    {visibleItems.includes(item) && (
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveItem(item, "up")}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveItem(item, "down")}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}
const getPrfDataShapedSectionsForQuickLinks = (prf: PRF_FORM) => {
  return Object.entries(PRFFormDataSchema.shape).map(([sectionKey]) => {
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
        ? `${prf.prfFormId}/#`
        : `${prf.prfFormId}/${sectionKey.replace(/_/g, "-")}`;

    return {
      sectionDescription:
        PRF_FORM_DATA_DISPLAY_NAMES[sectionKey as keyof PRF_FORM_DATA],
      priority,
      status: sectionData?.isCompleted ? "completed" : "incomplete",
      route,
      icon: iconMap[sectionKey as keyof typeof iconMap],
    };
  });
};
