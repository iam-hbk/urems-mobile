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
} from "lucide-react";
import { sectionDescriptions } from "@/interfaces/prf-form";


const iconMap = {
  "Case Details": ClipboardList,
  "Patient Details": User,
  Transportation: Truck,
  "Incident Information": AlertTriangle,
  "Primary Survey": Heartbeat,
  "Secondary Survey": Stethoscope,
  "Vital Signs": Activity,
  "History Taking": FileText,
  "Physical Exam": Clipboard,
  Interventions: FirstAid,
  "Medication Administration": Pill,
  "Patient Handover": UserCheck,
  Notes: Edit3,
};

const toSnakeCase = (str: string) => str.toLowerCase().replace(/\s+/g, "-");

export default function QuickLinks({ prfID }: { prfID: string }) {
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const [customizing, setCustomizing] = useState(false);

  useEffect(() => {
    const savedItems = localStorage.getItem("visibleNavItems");
    if (savedItems) {
      setVisibleItems(JSON.parse(savedItems));
    } else {
      // Set initial items
      setVisibleItems(sectionDescriptions.slice(0, 10));
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
    <nav className="w-full rounded-lg border p-4">
      <div className="flex flex-wrap items-start gap-2">
        <div className="grid max-w-[calc(100%-3rem)] flex-grow grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
          {visibleItems.map((item) => {
            const Icon = iconMap[item as keyof typeof iconMap];
            return (
              <Link
                key={item}
                href={`/edit-prf/${prfID}/${toSnakeCase(item)}`}
                className="flex items-center space-x-1 rounded-md border bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item}</span>
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
