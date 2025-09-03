"use client";
import { Clock } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Checkbox } from "./checkbox";
import { Button } from "./button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "./label";
import { Separator } from "./separator";
import { Input } from "./input";

interface TimePickerProps {
  name: string;
  className?: string;
  showUnknownOption?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export function TimePicker({
  name,
  className,
  showUnknownOption = false,
  value: customValue,
  onChange: onCustomChange,
}: TimePickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, ...field } }) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[140px] justify-start text-left font-normal",
                !value?.value && "text-muted-foreground",
                className,
              )}
              {...field}
            >
              <Clock className="mr-2 h-4 w-4" />
              {value?.unknown ? (
                <span className="text-muted-foreground">Unknown</span>
              ) : customValue ? (
                customValue
              ) : value?.value ? (
                value.value
              ) : (
                <span>Pick time</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-4" align="start">
            <div className="flex flex-col space-y-4">
              <div className="space-y-2">
                <Label>Select Time</Label>
                <Input
                  suppressHydrationWarning
                  type="time"
                  className={cn(value?.unknown && "opacity-50")}
                  value={customValue || value?.value || ""}
                  onChange={(e) => {
                    if (onCustomChange) {
                      // console.log("onCustomChange:", e.target.value);
                      onCustomChange(e.target.value);
                    } else {
                      onChange({
                        value: e.target.value,
                        unknown: false,
                      });
                    }
                  }}
                  disabled={value?.unknown}
                />
              </div>

              {showUnknownOption && (
                <>
                  <Separator />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`${name}-unknown`}
                      checked={value?.unknown || false}
                      onCheckedChange={(checked) => {
                        onChange({
                          value: checked
                            ? ""
                            : new Date().toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                            }),
                          unknown: checked as boolean,
                        });
                      }}
                    />
                    <Label
                      htmlFor={`${name}-unknown`}
                      className="text-sm font-normal"
                    >
                      Unknown Time
                    </Label>
                  </div>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}
    />
  );
}
