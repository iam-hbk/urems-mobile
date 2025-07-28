"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList, // Example Icon
  Settings,
  ChevronUp,
  ChevronDown,
  // Lucide icons that might be relevant for generic form sections
  LayoutList, // For sections
  FileText, // For general content/text
  CheckSquare, // For required/completed status
  ListChecks,
  EyeOffIcon, // For multiple items/fields
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useFormTemplate } from "@/hooks/dynamic-forms/use-dynamic-forms";

// TODO: Define a more comprehensive icon map for dynamic form sections
const sectionIconMap: { [key: string]: React.ElementType } = {
  default: LayoutList,
  "Section A": ClipboardList, // Example mapping
  "Another Section": FileText,
};

export default function DynamicFormQuickLinks() {
  const pathname = usePathname();
  
  // Extract formId and responseId from URL pathname
  // Expected patterns: /forms/[formId] or /forms/[formId]/[responseId] or /forms/[formId]/[responseId]/[sectionId]
  const pathSegments = pathname.split('/').filter(Boolean);
  const formId = pathSegments[1]; // forms/[formId]
  const responseId = pathSegments[2] && pathSegments[2] !== formId ? pathSegments[2] : undefined;

  const {
    data: formTemplate,
    isLoading: isLoadingTemplate,
    error: templateError,
  } = useFormTemplate(formId);

  const [showQuickLinks, setShowQuickLinks] = useState<boolean>(true);

  // Memoize allSectionNames to prevent it from causing unnecessary effect runs
  // if formTemplate reference changes but its sections are the same.
  const allSectionNames = useMemo(
    () => (formTemplate?.sections ? formTemplate.sections.map((s) => s.name) : []),
    [formTemplate?.sections],
  );

  const [visibleItems, setVisibleItems] = useState<string[]>(() => {
    // Initialize state from localStorage directly if available
    if (typeof window !== "undefined" && formId) {
      const storageKey = `dynamicFormVisibleNavItems_${formId}`;
      const savedItems = localStorage.getItem(storageKey);
      if (savedItems) {
        try {
          return JSON.parse(savedItems);
        } catch (e) {
          console.error("Failed to parse visibleItems from localStorage", e);
          // Fallback to all section names if parsing fails
          return allSectionNames;
        }
      }
    }
    return allSectionNames; // Default to all sections if no saved items or SSR
  });

  const [customizing, setCustomizing] = useState(false);

  // Effect to update localStorage when visibleItems change
  useEffect(() => {
    if (formId) {
      const storageKey = `dynamicFormVisibleNavItems_${formId}`;
      localStorage.setItem(storageKey, JSON.stringify(visibleItems));
    }
  }, [visibleItems, formId]);

  // Effect to re-initialize from allSectionNames if formId changes and no localStorage for new formId
  // This handles the case where the user navigates from one form to another
  useEffect(() => {
    if (formId) {
      const storageKey = `dynamicFormVisibleNavItems_${formId}`;
      const savedItems = localStorage.getItem(storageKey);
      if (!savedItems) {
        // If for the current formId, there are no saved items, initialize with allSectionNames.
        // This is important if allSectionNames changes due to formId change.
        setVisibleItems(allSectionNames);
      }
    }
    // This effect should run if formId changes, or if allSectionNames derived from a new formTemplate changes.
  }, [formId, allSectionNames]);

  const toggleItem = (itemName: string) => {
    setVisibleItems((prev) => {
      const newItems = prev.includes(itemName)
        ? prev.filter((i) => i !== itemName)
        : [...prev, itemName];
      if (formId) {
        localStorage.setItem(
          `dynamicFormVisibleNavItems_${formId}`,
          JSON.stringify(newItems),
        );
      }
      return newItems;
    });
  };

  const moveItem = (itemName: string, direction: "up" | "down") => {
    setVisibleItems((prev) => {
      const index = prev.indexOf(itemName);
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
      if (formId) {
        localStorage.setItem(
          `dynamicFormVisibleNavItems_${formId}`,
          JSON.stringify(newItems),
        );
      }
      return newItems;
    });
  };

  // Early returns for loading, error, or missing data
  if (!formId) {
    return null; // Don't render if we can't extract formId from URL
  }

  if (isLoadingTemplate) {
    return (
      <nav className="w-full rounded-lg border bg-card p-4 shadow">
        <div className="flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading quick links...</div>
        </div>
      </nav>
    );
  }

  if (templateError || !formTemplate || !formTemplate.sections) {
    return (
      <nav className="w-full rounded-lg border bg-card p-4 shadow">
        <div className="flex items-center justify-center">
          <div className="text-sm text-red-500">
            Failed to load form template for quick links
          </div>
        </div>
      </nav>
    );
  }

  const displayedSections = formTemplate.sections
    .filter((section) => visibleItems.includes(section.name))
    .sort((a, b) => {
      const indexA = visibleItems.indexOf(a.name);
      const indexB = visibleItems.indexOf(b.name);
      if (indexA === -1 && indexB === -1) return 0; // Should not happen if filtered correctly
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

  if (!showQuickLinks)
    return (
      <Button
        variant="outline"
        onClick={() => setShowQuickLinks(true)}
        className="justify-between self-end"
      >
        <ListChecks className="mr-2 h-4 w-4" />
        Show Quick Links
      </Button>
    );

  return (
    <nav className="w-full rounded-lg border bg-card p-4 shadow">
      <div className="flex flex-wrap items-start gap-2">
        <div className="grid max-w-[calc(100%-3rem)] flex-grow grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {displayedSections.map((section) => {
            const Icon = sectionIconMap[section.name] || sectionIconMap.default;
            // For dynamic forms, 'isRequired' is a clear indicator we have from the template
            const isIndicatedAsRequired = section.isRequired;

            return (
              <Button
                variant="secondary"
                className={cn(
                  "relative flex w-full items-center justify-start space-x-1 border text-left",
                  {
                    "border-blue-500 dark:border-blue-400":
                      isIndicatedAsRequired,
                    "border-gray-300 dark:border-gray-600":
                      !isIndicatedAsRequired,
                    "animate-pulse border-2 border-dashed border-gray-500":
                      customizing, // Simple pulse for customizing
                  },
                )}
                title={section.name}
                asChild
                key={section.id}
              >
                <Link
                  href={
                    responseId
                      ? `/forms/${formId}/${responseId}/${section.id}`
                      : `/forms/${formId}`
                  }
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate text-sm">{section.name}</span>
                  {isIndicatedAsRequired && !customizing && (
                    <Badge className="absolute -right-2 -top-2 rounded-full bg-blue-500 p-1 dark:bg-blue-400">
                      <CheckSquare className="h-3 w-3 text-white" />
                    </Badge>
                  )}
                </Link>
              </Button>
            );
          })}
        </div>
        <Popover open={customizing} onOpenChange={setCustomizing}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="ml-auto shrink-0">
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <h3 className="mb-2 font-medium text-card-foreground">
              Customize Quick Links
            </h3>

            <ScrollArea className="h-[300px]">
              <div className="pr-4">
                {formTemplate.sections.map((section) => (
                  <div
                    key={section.id}
                    className="mb-2 flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`ql-${section.id}`}
                      checked={visibleItems.includes(section.name)}
                      onCheckedChange={() => toggleItem(section.name)}
                      aria-labelledby={`ql-label-${section.id}`}
                    />
                    <label
                      id={`ql-label-${section.id}`}
                      htmlFor={`ql-${section.id}`}
                      className="flex-grow text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {section.name}
                    </label>
                    {visibleItems.includes(section.name) && (
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveItem(section.name, "up")}
                          aria-label={`Move ${section.name} up`}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveItem(section.name, "down")}
                          aria-label={`Move ${section.name} down`}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Button
              variant="outline"
              className="w-full justify-between border-destructive/50 bg-destructive/10 hover:border-destructive/70 hover:bg-destructive/20"
              onClick={() => {
                setShowQuickLinks(false);
                setCustomizing(false);
              }}
            >
              Hide Quick Links
              <EyeOffIcon size={20} />
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}
