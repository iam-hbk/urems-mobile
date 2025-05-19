'use client';

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
import { FormTemplate } from "@/types/form-template";
import { useRouter, usePathname } from "next/navigation";
import { LayoutList, ClipboardList, FileText } from "lucide-react"; // Example icons

// TODO: This map could be shared or passed as a prop if it grows complex
const sectionIconMap: { [key: string]: React.ElementType } = {
  default: LayoutList,
  "Section A": ClipboardList,
  "Another Section": FileText,
};

interface DynamicFormCommandPaletteProps {
  formTemplate?: FormTemplate | null; // Make optional as it might not be loaded initially
  formId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DynamicFormCommandPalette({
  formTemplate,
  formId,
  open,
  onOpenChange,
}: DynamicFormCommandPaletteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  

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

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const commandSections = formTemplate?.sections.map((section) => ({
    id: section.id,
    title: section.name,
    href: `/forms/${formId}/section/${section.id}`,
    icon: sectionIconMap[section.name] || sectionIconMap.default,
    keywords: [section.name].filter(Boolean) as string[],
  })) || [];

  const filteredSections = commandSections.filter((section) => {
    if (!search) return true;
    return section.keywords.some((keyword) =>
      keyword.toLowerCase().includes(search.toLowerCase()),
    );
  });
  // Return null if pathname doesn't include 'section'
  if (!pathname?.includes('section')) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 sm:max-w-[550px]"
        aria-describedby={undefined} // For Radix UI Dialog accessibility
      >
        <DialogTitle className="sr-only">Search Form Sections</DialogTitle>
        <Command className="rounded-lg border shadow-md" shouldFilter={false}>
          <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
            <CommandInput
              placeholder="Search sections..."
              value={search}
              onValueChange={setSearch}
            />
          </div>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {formTemplate && filteredSections.length > 0 && (
              <CommandGroup heading={`Sections in ${formTemplate.title}`}>
                {filteredSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <CommandItem
                      key={section.id}
                      value={section.title} // value prop for cmdk filtering if shouldFilter=true
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
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}