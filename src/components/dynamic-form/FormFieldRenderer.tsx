"use client";

import React from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { FieldDefinition as OriginalFieldDefinition } from "@/types/form-template";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { DateField } from "@/components/ui/datefield-rac";
import { TimePicker } from "@/components/ui/time-picker";
import { SignatureField } from "@/components/signature-field";
import AddressAutoComplete from "@/components/AddressAutoComplete";
import { FormFieldType } from "@/types/form-template";
import { CalendarDate, parseDate, DateValue } from "@internationalized/date";
import { cn } from "@/lib/utils";

// Extend FieldDefinition locally for missing props if not yet in global types
interface FieldDefinition extends OriginalFieldDefinition {
  placeholder?: string;
  description?: string;
  showUnknownOption?: boolean;
  typeValidationErrorMessage?: string;
}

interface FormFieldRendererProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  field: FieldDefinition;
  control: Control<TFieldValues>;
  fieldName?: FieldPath<TFieldValues>;
}

const FormFieldRenderer = <TFieldValues extends FieldValues = FieldValues>({
  field,
  control,
  fieldName,
}: FormFieldRendererProps<TFieldValues>) => {
  const nameAttribute = fieldName || (field.name as FieldPath<TFieldValues>);
  const labelId = `${nameAttribute}-label`;

  const {
    name,
    label,
    type,
    isRequired,
    placeholder,
    pattern,
    errorMessage,
    fieldOptions,
    description,
    showUnknownOption,
    id: fieldId,
    typeValidationErrorMessage,
  } = field;

  // Common render logic wrapped in FormItem, FormLabel, FormControl, FormMessage
  const renderControl = (rhfRenderField: any, fieldState: any) => {
    let componentToRender;
    const value = rhfRenderField.value;

    switch (type) {
      case "Text":
      case "Email":
      case "Url":
      case "Password":
      case "Phone":
        componentToRender = (
          <Input
            {...rhfRenderField}
            id={fieldId}
            value={value ?? ""}
            type={
              type === "Password"
                ? "password"
                : type === "Email"
                  ? "email"
                  : type === "Url"
                    ? "url"
                    : "text"
            }
            placeholder={placeholder}
          />
        );
        break;
      case "TextArea":
        componentToRender = (
          <Textarea
            {...rhfRenderField}
            id={fieldId}
            value={value ?? ""}
            placeholder={placeholder}
          />
        );
        break;
      case "Number":
        componentToRender = (
          <Input
            {...rhfRenderField}
            id={fieldId}
            value={value ?? ""}
            type="number"
            placeholder={placeholder}
            onChange={(e) => {
              const val = e.target.value;
              rhfRenderField.onChange(
                val === "" || isNaN(parseFloat(val)) ? null : parseFloat(val),
              );
            }}
          />
        );
        break;
      case "Select":
        componentToRender = (
          <Select
            onValueChange={rhfRenderField.onChange}
            value={value as string | undefined}
            defaultValue={value as string | undefined}
          >
            <FormControl>
              <SelectTrigger id={fieldId}>
                <SelectValue placeholder={placeholder || "Select an option"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {fieldOptions?.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        break;
      case "Boolean":
        componentToRender = (
          <div className="flex items-center">
            <Switch
              id={fieldId}
              checked={!!value}
              onCheckedChange={rhfRenderField.onChange}
              aria-labelledby={labelId}
            />
          </div>
        );
        break;
      case "RadioGroup":
        componentToRender = (
          <RadioGroup
            onValueChange={rhfRenderField.onChange}
            value={value as string | undefined}
            defaultValue={value as string | undefined}
            className="flex flex-col space-y-1"
          >
            {fieldOptions?.map((option) => (
              <FormItem
                key={option.id}
                className="flex items-center space-x-3 space-y-0"
              >
                <FormControl>
                  <RadioGroupItem
                    value={option.value}
                    id={`${fieldId}-${option.value}`}
                  />
                </FormControl>
                <FormLabel
                  htmlFor={`${fieldId}-${option.value}`}
                  className="font-normal"
                >
                  {option.label}
                </FormLabel>
              </FormItem>
            ))}
          </RadioGroup>
        );
        break;
      case "CheckboxGroup":
        componentToRender = (
          <div className="space-y-2">
            {fieldOptions?.map((option) => (
              <FormItem
                key={option.id}
                className="flex flex-row items-start space-x-3 space-y-0"
              >
                <FormControl>
                  <Checkbox
                    checked={
                      (value as string[] | undefined)?.includes(option.value) ||
                      false
                    }
                    onCheckedChange={(checked) => {
                      const currentValue =
                        (value as string[] | undefined) || [];
                      if (checked) {
                        rhfRenderField.onChange([
                          ...currentValue,
                          option.value,
                        ]);
                      } else {
                        rhfRenderField.onChange(
                          currentValue.filter((v) => v !== option.value),
                        );
                      }
                    }}
                    id={`${fieldId}-${option.value}`}
                  />
                </FormControl>
                <FormLabel
                  htmlFor={`${fieldId}-${option.value}`}
                  className="font-normal"
                >
                  {option.label}
                </FormLabel>
              </FormItem>
            ))}
          </div>
        );
        break;
      case "Date":
        let calendarDateValue: CalendarDate | undefined = undefined;
        if (value && typeof value === "string") {
          try {
            calendarDateValue = parseDate(value);
          } catch (e) {
            console.error("Invalid date string for CalendarDate:", value, e);
          }
        } else if (value instanceof CalendarDate) {
          calendarDateValue = value;
        }
        componentToRender = (
          <DateField
            value={calendarDateValue}
            onChange={(date: DateValue | null) =>
              rhfRenderField.onChange(date ? date.toString() : null)
            }
            granularity="day"
            aria-label={label}
            id={fieldId}
          />
        );
        break;
      case "Time":
        componentToRender = (
          <TimePicker
            name={nameAttribute as string}
            showUnknownOption={showUnknownOption}
          />
        );
        break;
      case "DateTime":
        componentToRender = (
          <Input
            {...rhfRenderField}
            id={fieldId}
            value={value ?? ""}
            type="datetime-local"
            placeholder={placeholder}
          />
        );
        break;
      case "Signature":
        componentToRender = (
          <SignatureField
            label={label}
            onSave={(dataUrl: string) => rhfRenderField.onChange(dataUrl)}
            onCancel={() => {
              /* No-op for now, or implement specific cancel logic */
            }}
          />
        );
        break;
      case "Address":
        componentToRender = (
          <AddressAutoComplete
            name={nameAttribute as string}
            placeholder={placeholder}
          />
        );
        break;
      case "File":
      case "Image":
        componentToRender = (
          <Input
            {...rhfRenderField}
            id={fieldId}
            value={undefined}
            type="file"
            onChange={(e) =>
              rhfRenderField.onChange(e.target.files ? e.target.files[0] : null)
            }
            placeholder={placeholder}
            accept={type === "Image" ? "image/*" : undefined}
          />
        );
        break;
      default:
        const exhaustiveCheck: never = type;
        componentToRender = (
          <p className="text-red-500">Unsupported field type: {field.type}</p>
        );
    }
    return componentToRender;
  };

  return (
    <Controller
      name={nameAttribute}
      control={control}
      rules={{
        required: isRequired ? errorMessage || "This field is required" : false,
        pattern: pattern
          ? {
              value: new RegExp(pattern),
              message: errorMessage || "Invalid format",
            }
          : undefined,
        validate: (value) => {
          if (
            type === "Number" &&
            value !== null &&
            value !== undefined &&
            value !== ""
          ) {
            if (isNaN(Number(value))) {
              return typeValidationErrorMessage || "Must be a number";
            }
          }
          return true;
        },
      }}
      render={({ field: rhfRenderField, fieldState }) => (
        <FormItem
          className={cn({
            "mb-4 rounded-md border border-green-300 p-2": true,
            "grid-cols-1": type === "TextArea",
          })}
        >
          {type !== "Boolean" && (
            <FormLabel id={labelId} htmlFor={fieldId}>
              {label}
              {isRequired && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          {type === "Boolean" && (
            <FormLabel id={labelId} htmlFor={fieldId} className="mr-2">
              {label}
              {isRequired && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl>{renderControl(rhfRenderField, fieldState)}</FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormFieldRenderer;
