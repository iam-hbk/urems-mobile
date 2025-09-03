"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";
import { PRF_FORM_DATA_DISPLAY_NAMES } from "@/interfaces/prf-form";
import { useRouter, usePathname } from "next/navigation";
import { iconMap } from "./quick-links";
import { useGetPRFResponseSectionStatus } from "@/hooks/prf/usePrfForms";

interface CommandPaletteProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export function CommandPalette({
  open,
  onOpenChangeAction,
}: CommandPaletteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const prfID = pathname.split("/")[2]; // Extract prfID from /edit-prf/[prfID]/...

  const {
    data: statusData,
    isLoading,
    error,
  } = useGetPRFResponseSectionStatus(prfID);

  // Handle CMD+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChangeAction(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChangeAction]);

  // Reset search when opening/closing
  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const sections =
    statusData?.sections.map((section) => {
      const sectionKey =
        section.sectionName as keyof typeof PRF_FORM_DATA_DISPLAY_NAMES;
      return {
        title: PRF_FORM_DATA_DISPLAY_NAMES[sectionKey],
        href:
          sectionKey === "case_details"
            ? `/edit-prf/${prfID}/#`
            : `/edit-prf/${prfID}/${sectionKey.replace(/_/g, "-")}`,
        icon: iconMap[sectionKey as keyof typeof iconMap],
        keywords: [
          sectionKey.replace(/_/g, " "),
          PRF_FORM_DATA_DISPLAY_NAMES[sectionKey],
        ],
      };
    }) || [];

  const filteredSections = sections.filter((section) => {
    if (!search) return true;

    return section.keywords.some((keyword) =>
      keyword.toLowerCase().includes(search.toLowerCase()),
    );
  });

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChangeAction}>
        <DialogContent
          className="p-0 sm:max-w-[550px]"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">Search PRF Sections</DialogTitle>
          <div className="p-6 text-center">
            <div className="text-sm text-gray-500">Loading sections...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !statusData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChangeAction}>
        <DialogContent
          className="p-0 sm:max-w-[550px]"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">Search PRF Sections</DialogTitle>
          <div className="p-6 text-center">
            <div className="text-sm text-red-500">
              Error loading sections. Please try again.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent
        className="p-0 sm:max-w-[550px]"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Search PRF Sections</DialogTitle>
        <Command className="rounded-lg border shadow-md" shouldFilter={false}>
          <div
            className="flex items-center border-b px-3"
            cmdk-input-wrapper=""
          >
            <CommandInput
              placeholder="Type a command or search..."
              value={search}
              onValueChange={setSearch}
            />
          </div>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="PRF Sections">
              {filteredSections.map((section) => {
                const Icon = section.icon;
                return (
                  <CommandItem
                    key={section.href}
                    onSelect={() => {
                      router.push(section.href);
                      onOpenChangeAction(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2"
                  >
                    {Icon && <Icon className="h-4 w-4 shrink-0" />}
                    <span className="flex-1 truncate">{section.title}</span>
                    <CommandShortcut>↵</CommandShortcut>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
