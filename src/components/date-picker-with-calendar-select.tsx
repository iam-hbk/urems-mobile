"use client";

import { CalendarIcon } from "lucide-react";
import { forwardRef, useMemo, useState } from "react";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import {
  Button,
  DatePicker,
  Dialog,
  Group,
  Label,
  Popover,
  Calendar as CalendarRac,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarCell,
} from "react-aria-components";

import { DateInput } from "@/components/ui/datefield-rac";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DatePickerWithCalendarSelectProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
}

const DatePickerWithCalendarSelect = forwardRef<
  HTMLDivElement,
  DatePickerWithCalendarSelectProps
>(
  (
    {
      value,
      onChange,
      disabled = false,
      className = "",
      label = "Date picker",
    },
    ref,
  ) => {
    // Convert Date to CalendarDate for react-aria
    const calendarValue = useMemo(() => {
      if (!value) return undefined;
      const year = value.getFullYear();
      const month = value.getMonth() + 1; // getMonth() returns 0-based month
      const day = value.getDate();
      return new CalendarDate(year, month, day);
    }, [value]);

    // Handle date changes from react-aria DatePicker
    const handleDateChange = (date: CalendarDate | null) => {
      if (!onChange) return;

      if (!date) {
        onChange(undefined);
        return;
      }

      // Convert CalendarDate back to Date
      const jsDate = new Date(date.year, date.month - 1, date.day);
      onChange(jsDate);
    };

    return (
      <div ref={ref} className={className}>
        <DatePicker
          className="*:not-first:mt-2"
          value={calendarValue}
          onChange={handleDateChange}
          isDisabled={disabled}
        >
          <Label className="text-sm font-medium text-foreground">{label}</Label>
          <div className="flex">
            <Group className="w-full">
              <DateInput className="pe-9" />
            </Group>
            <Button className="data-focus-visible:border-ring data-focus-visible:ring-ring/50 data-focus-visible:ring-[3px] z-10 -me-px -ms-9 flex w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground">
              <CalendarIcon size={16} />
            </Button>
          </div>
          <Popover
            className="data-entering:animate-in data-exiting:animate-out outline-hidden z-50 rounded-lg border bg-background text-popover-foreground shadow-lg data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2"
            offset={4}
            shouldCloseOnInteractOutside={(element) => {
              // Don't close if clicking on select elements or their children
              const selectElements = document.querySelectorAll(
                '[role="combobox"], [role="listbox"]',
              );
              return ![...selectElements].some(
                (select) => select === element || select.contains(element),
              );
            }}
          >
            <Dialog className="max-h-[inherit] overflow-auto p-2">
              <EnhancedCalendar />
            </Dialog>
          </Popover>
        </DatePicker>
      </div>
    );
  },
);

DatePickerWithCalendarSelect.displayName = "DatePickerWithCalendarSelect";

// Enhanced Calendar with month/year selectors
function EnhancedCalendar() {
  const currentDate = today(getLocalTimeZone());
  const [focusedValue, setFocusedValue] = useState<CalendarDate>(currentDate);

  // Generate years array (1980 to current year + 10)
  const years = useMemo(() => {
    const startYear = 1980;
    const endYear = currentDate.year + 10;
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i,
    );
  }, [currentDate.year]);

  // Generate months array
  const months = useMemo(
    () => [
      { value: 1, label: "January" },
      { value: 2, label: "February" },
      { value: 3, label: "March" },
      { value: 4, label: "April" },
      { value: 5, label: "May" },
      { value: 6, label: "June" },
      { value: 7, label: "July" },
      { value: 8, label: "August" },
      { value: 9, label: "September" },
      { value: 10, label: "October" },
      { value: 11, label: "November" },
      { value: 12, label: "December" },
    ],
    [],
  );

  const handleMonthChange = (monthValue: string) => {
    const month = parseInt(monthValue);
    const newDate = focusedValue.set({ month });
    setFocusedValue(newDate);
  };

  const handleYearChange = (yearValue: string) => {
    const year = parseInt(yearValue);
    const newDate = focusedValue.set({ year });
    setFocusedValue(newDate);
  };

  return (
    <CalendarRac
      className="w-fit"
      focusedValue={focusedValue}
      onFocusChange={setFocusedValue}
    >
      <div className="space-y-3">
        {/* Month and Year Selectors */}
        <div className="flex items-center gap-2 px-2">
          <Select
            value={String(focusedValue.month)}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="h-8 w-fit font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
              {months.map((month) => (
                <SelectItem key={month.value} value={String(month.value)}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(focusedValue.year)}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="h-8 w-fit font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Calendar Grid */}
        <CalendarGrid>
          <CalendarGridHeader>
            {(day) => (
              <CalendarHeaderCell className="size-9 rounded-md p-0 text-xs font-medium text-muted-foreground/80">
                {day}
              </CalendarHeaderCell>
            )}
          </CalendarGridHeader>
          <CalendarGridBody className="[&_td]:px-0 [&_td]:py-px">
            {(date) => (
              <CalendarCell
                date={date}
                className={cn(
                  "data-hovered:bg-accent data-selected:bg-primary data-hovered:text-foreground data-selected:text-primary-foreground data-focus-visible:ring-ring/50 data-disabled:pointer-events-none data-disabled:opacity-30 data-focus-visible:z-10 data-focus-visible:ring-[3px] data-unavailable:pointer-events-none data-unavailable:line-through data-unavailable:opacity-30 relative flex size-9 items-center justify-center whitespace-nowrap rounded-md p-0 text-sm font-normal text-foreground outline-none duration-150 [transition-property:color,background-color,border-radius,box-shadow]",
                  // Today indicator styles
                  date.compare(currentDate) === 0 &&
                    "data-selected:after:bg-background after:pointer-events-none after:absolute after:bottom-1 after:start-1/2 after:z-10 after:size-[3px] after:-translate-x-1/2 after:rounded-full after:bg-primary",
                )}
              />
            )}
          </CalendarGridBody>
        </CalendarGrid>
      </div>
    </CalendarRac>
  );
}

export default DatePickerWithCalendarSelect;

// React Hook Form compatible wrapper
export const FormDatePickerWithCalendarSelect = forwardRef<
  HTMLDivElement,
  DatePickerWithCalendarSelectProps & {
    name?: string;
    error?: string;
  }
>(({ error, ...props }, ref) => {
  return (
    <div className="space-y-1">
      <DatePickerWithCalendarSelect ref={ref} {...props} />
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
});

FormDatePickerWithCalendarSelect.displayName =
  "FormDatePickerWithCalendarSelect";
