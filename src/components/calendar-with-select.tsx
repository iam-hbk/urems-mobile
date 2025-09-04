"use client";

import { DropdownNavProps, DropdownProps } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CalendarWithSelectProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function CalendarWithSelect({
  value,
  onChange,
  disabled = false,
  className = "",
}: CalendarWithSelectProps) {
  const handleCalendarChange = (
    _value: string | number,
    _e: React.ChangeEventHandler<HTMLSelectElement>,
  ) => {
    const _event = {
      target: {
        value: String(_value),
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    _e(_event);
  };

  return (
    <div className={className}>
      <Calendar
        mode="single"
        selected={value}
        onSelect={onChange}
        disabled={disabled}
        className="rounded-md border p-2"
        classNames={{
          month_caption: "mx-0",
        }}
        captionLayout="dropdown"
        defaultMonth={value || new Date()}
        startMonth={new Date(1980, 6)}
        hideNavigation
        components={{
          DropdownNav: (props: DropdownNavProps) => {
            return (
              <div className="flex w-full items-center gap-2">
                {props.children}
              </div>
            );
          },
          Dropdown: (props: DropdownProps) => {
            return (
              <Select
                value={String(props.value)}
                onValueChange={(value) => {
                  if (props.onChange) {
                    handleCalendarChange(value, props.onChange);
                  }
                }}
                disabled={disabled}
              >
                <SelectTrigger className="h-8 w-fit font-medium first:grow">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                  {props.options?.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={String(option.value)}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          },
        }}
      />
    </div>
  );
}
