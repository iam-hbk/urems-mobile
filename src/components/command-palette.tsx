"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut } from "@/components/ui/command";
import { PRF_FORM, PRF_FORM_DATA_DISPLAY_NAMES } from "@/interfaces/prf-form";
import { useRouter } from "next/navigation";
import { iconMap } from "./quick-links";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  prf?: PRF_FORM;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ prf, open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Handle CMD+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  // Reset search when opening/closing
  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const sections = Object.keys(PRF_FORM_DATA_DISPLAY_NAMES).map((key) => ({
    title: PRF_FORM_DATA_DISPLAY_NAMES[key as keyof typeof PRF_FORM_DATA_DISPLAY_NAMES],
    href: key === "case_details" 
      ? `/edit-prf/${prf?.prfFormId}/#` 
      : `/edit-prf/${prf?.prfFormId}/${key.replace(/_/g, "-")}`,
    icon: iconMap[key as keyof typeof iconMap],
    keywords: [key.replace(/_/g, " "), PRF_FORM_DATA_DISPLAY_NAMES[key as keyof typeof PRF_FORM_DATA_DISPLAY_NAMES]],
  }));

  const filteredSections = sections.filter((section) => {
    if (!search) return true;
    
    return section.keywords.some((keyword) =>
      keyword.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-[550px]">
        <Command className="rounded-lg border shadow-md" shouldFilter={false}>
          <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
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
                      onOpenChange(false);
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