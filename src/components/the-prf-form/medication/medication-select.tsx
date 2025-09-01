"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Star, StarOff, Plus } from "lucide-react";
import { useZuStandCrewStore } from "@/lib/zuStand/crew";
import { useFavoriteMedications } from "@/hooks/medication/useFavoriteMedications";
import { useFormContext } from "react-hook-form";

interface MedicationSelectProps {
  value?: string;
  onChange: (value: string) => void;
  name: string;
  index: number;
  onCustomMedication: (index: number, currentValue?: string) => void;
}

export const MedicationSelect = React.forwardRef<
  HTMLDivElement,
  MedicationSelectProps
>(({ value, onChange, index, onCustomMedication }, _ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const form = useFormContext();
  const { zsVehicle } = useZuStandCrewStore();
  const { favorites, toggleFavorite } = useFavoriteMedications();

  const medications = zsVehicle?.inventory.medications || [];
  const favoriteMedications = medications.filter((med) =>
    favorites.includes(med.id),
  );
  const otherMedications = medications.filter(
    (med) => !favorites.includes(med.id),
  );

  const handleMedicationSelect = React.useCallback(
    (medication: (typeof medications)[0]) => {
      onChange(medication.name);
      form.setValue(`medications.${index}.medicationId`, medication.id);
      form.setValue(`medications.${index}.dose`, medication.dose);
      form.setValue(`medications.${index}.route`, medication.route);
      setIsOpen(false);
      setSearch("");
    },
    [onChange, index, form, setIsOpen, setSearch],
  );

  const handleFavoriteClick = React.useCallback(
    (e: React.MouseEvent, medicationId: string) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(medicationId);
    },
    [toggleFavorite],
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between"
        >
          {value
            ? medications.find((med) => med.name === value)?.name || value
            : "Select medication..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search medications..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No medication found.</CommandEmpty>
            {favoriteMedications.length > 0 && (
              <CommandGroup heading="Favorites">
                {favoriteMedications
                  .filter((med) =>
                    med.name.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((med) => (
                    <div key={med.id} className="flex items-center px-2 py-1.5">
                      <CommandItem
                        value={med.name}
                        onSelect={() => handleMedicationSelect(med)}
                        className="flex-1 cursor-pointer"
                      >
                        {med.name} ({med.currentStock} in stock)
                      </CommandItem>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2 h-8 w-8"
                        onClick={(e) => handleFavoriteClick(e, med.id)}
                      >
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </Button>
                    </div>
                  ))}
                <CommandSeparator />
              </CommandGroup>
            )}
            <CommandGroup heading="All Medications">
              {otherMedications
                .filter((med) =>
                  med.name.toLowerCase().includes(search.toLowerCase()),
                )
                .map((med) => (
                  <div key={med.id} className="flex items-center px-2 py-1.5">
                    <CommandItem
                      value={med.name}
                      onSelect={() => handleMedicationSelect(med)}
                      className="flex-1 cursor-pointer"
                    >
                      {med.name} ({med.currentStock} in stock)
                    </CommandItem>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 h-8 w-8"
                      onClick={(e) => handleFavoriteClick(e, med.id)}
                    >
                      <StarOff className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              <CommandSeparator />
              <CommandItem
                value="custom"
                onSelect={() => {
                  onCustomMedication(index, value);
                  setIsOpen(false);
                  setSearch("");
                }}
              >
                <span className="flex items-center gap-2">
                  Custom Medication
                  <Plus className="h-4 w-4" />
                </span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});

MedicationSelect.displayName = "MedicationSelect";
