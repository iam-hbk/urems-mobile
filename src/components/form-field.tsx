"use client";

import type { UseFormReturn } from "react-hook-form";
import type {
  FieldDefinition,
  DetailedFormResponse,
} from "@/types/form-template";
import {
  FormControl,
  FormField as ShadcnFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import DatePickerWithCalendarSelect from "@/components/date-picker-with-calendar-select";
import { AddressInput, type AddressData } from "@/components/address-input";

type DynamicFieldValue = string | number | boolean | string[] | AddressData;
type DynamicFormValues = Record<string, DynamicFieldValue>;

interface FormFieldProps {
  fieldDefinition: FieldDefinition;
  form: UseFormReturn<DynamicFormValues>;
  entryIndex: number;
  existingResponse?: DetailedFormResponse;
}

export function FormFieldBuilder({
  fieldDefinition,
  form,
  entryIndex,
  existingResponse,
}: FormFieldProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fieldName = `${fieldDefinition.id}_${entryIndex}`;

  const getDefaultValue = useCallback(() => {
    if (!existingResponse?.fieldResponses) {
      // Check for default options
      const defaultOption = fieldDefinition.fieldOptions?.find(
        (opt) => opt.isDefault,
      );
      if (defaultOption) {
        return fieldDefinition.type === "CheckboxGroup"
          ? [defaultOption.value]
          : defaultOption.value;
      }
      // Set Boolean fields to false by default, CheckboxGroup to empty array, others to empty string
      if (fieldDefinition.type === "Boolean") return false;
      return fieldDefinition.type === "CheckboxGroup" ? [] : "";
    }

    const response = existingResponse.fieldResponses.find(
      (r) =>
        r.fieldDefinitionId === fieldDefinition.id &&
        (r.entrySequenceNumber || 0) === entryIndex,
    );

    if (!response) {
      // Check for default options
      const defaultOption = fieldDefinition.fieldOptions?.find(
        (opt) => opt.isDefault,
      );
      if (defaultOption) {
        return fieldDefinition.type === "CheckboxGroup"
          ? [defaultOption.value]
          : defaultOption.value;
      }
      // Set Boolean fields to false by default, CheckboxGroup to empty array, others to empty string
      if (fieldDefinition.type === "Boolean") return false;
      return fieldDefinition.type === "CheckboxGroup" ? [] : "";
    }

    switch (fieldDefinition.type) {
      case "Boolean":
        return response.value === "true";
      case "Number":
        return response.value ? Number(response.value) : "";
      case "CheckboxGroup":
        try {
          return JSON.parse(response.value);
        } catch {
          return [];
        }
      default:
        return response.value || "";
    }
  }, [existingResponse, fieldDefinition, entryIndex]);

  // Set default value when component mounts
  useEffect(() => {
    const defaultValue = getDefaultValue();
    // Set the default value if it's not undefined (includes false for Boolean fields)
    if (defaultValue !== undefined) {
      form.setValue(fieldName, defaultValue);
    }
  }, [fieldName, form, getDefaultValue]);

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles((prev) => [...prev, ...fileArray]);
      form.setValue(fieldName, fileArray.map((f) => f.name).join(", "));
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      form.setValue(fieldName, newFiles.map((f) => f.name).join(", "));
      return newFiles;
    });
  };

  const renderField = () => {
    switch (fieldDefinition.type) {
      case "Text":
      case "Email":
      case "Url":
      case "Phone":
      case "Password":
        return (
          <ShadcnFormField<DynamicFormValues, string>
            control={form.control}
            name={fieldName}
            rules={{
              required: fieldDefinition.isRequired
                ? fieldDefinition.errorMessage || "This field is required"
                : false,
              pattern: fieldDefinition.pattern
                ? {
                    value: new RegExp(fieldDefinition.pattern),
                    message: fieldDefinition.errorMessage || "Invalid format",
                  }
                : undefined,
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {fieldDefinition.label}
                  {fieldDefinition.isRequired && (
                    <span className="ml-1 text-destructive">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    type={fieldDefinition.type.toLowerCase()}
                    placeholder={`Enter ${fieldDefinition.label.toLowerCase()}`}
                    {...field}
                    value={
                      typeof field.value === "string" ||
                      typeof field.value === "number"
                        ? field.value
                        : ""
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "TextArea":
        return (
          <ShadcnFormField<DynamicFormValues, string>
            control={form.control}
            name={fieldName}
            rules={{
              required: fieldDefinition.isRequired
                ? fieldDefinition.errorMessage || "This field is required"
                : false,
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {fieldDefinition.label}
                  {fieldDefinition.isRequired && (
                    <span className="ml-1 text-destructive">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={`Enter ${fieldDefinition.label.toLowerCase()}`}
                    className="min-h-[100px]"
                    {...field}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "Number":
        return (
          <ShadcnFormField<DynamicFormValues, string>
            control={form.control}
            name={fieldName}
            rules={{
              required: fieldDefinition.isRequired
                ? fieldDefinition.errorMessage || "This field is required"
                : false,
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {fieldDefinition.label}
                  {fieldDefinition.isRequired && (
                    <span className="ml-1 text-destructive">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={`Enter ${fieldDefinition.label.toLowerCase()}`}
                    {...field}
                    value={
                      typeof field.value === "number" || field.value === ""
                        ? (field.value as number | "")
                        : ""
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : "",
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "Date":
        return (
          <ShadcnFormField<DynamicFormValues, string>
            control={form.control}
            name={fieldName}
            rules={{
              required: fieldDefinition.isRequired
                ? fieldDefinition.errorMessage || "This field is required"
                : false,
            }}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <DatePickerWithCalendarSelect
                    label={`${fieldDefinition.label}${fieldDefinition.isRequired ? " *" : ""}`}
                    value={
                      typeof field.value === "string"
                        ? new Date(field.value)
                        : undefined
                    }
                    onChange={(date: Date | undefined) => {
                      field.onChange(
                        date ? date.toISOString().split("T")[0] : "",
                      );
                    }}
                    placeholder={`Select ${fieldDefinition.label.toLowerCase()}`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "Time":
        return (
          <ShadcnFormField<DynamicFormValues, string>
            control={form.control}
            name={fieldName}
            rules={{
              required: fieldDefinition.isRequired
                ? fieldDefinition.errorMessage || "This field is required"
                : false,
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {fieldDefinition.label}
                  {fieldDefinition.isRequired && (
                    <span className="ml-1 text-destructive">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "DateTime":
        return (
          <ShadcnFormField<DynamicFormValues, string>
            control={form.control}
            name={fieldName}
            rules={{
              required: fieldDefinition.isRequired
                ? fieldDefinition.errorMessage || "This field is required"
                : false,
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {fieldDefinition.label}
                  {fieldDefinition.isRequired && (
                    <span className="ml-1 text-destructive">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "Boolean":
        return (
          <ShadcnFormField<DynamicFormValues, string>
            control={form.control}
            name={fieldName}
            rules={
              {
                // Don't use standard required validation for Boolean fields
                // Our custom submit logic will handle untouched required fields
              }
            }
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value === true}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {fieldDefinition.label}
                    {fieldDefinition.isRequired && (
                      <span className="ml-1 text-destructive">*</span>
                    )}
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "Select":
        return (
          <ShadcnFormField<DynamicFormValues, string>
            control={form.control}
            name={fieldName}
            rules={{
              required: fieldDefinition.isRequired
                ? fieldDefinition.errorMessage || "This field is required"
                : false,
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {fieldDefinition.label}
                  {fieldDefinition.isRequired && (
                    <span className="ml-1 text-destructive">*</span>
                  )}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={typeof field.value === "string" ? field.value : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={`Select ${fieldDefinition.label.toLowerCase()}`}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fieldDefinition.fieldOptions?.map((option) => (
                      <SelectItem key={option.id} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "RadioGroup":
        return (
          <ShadcnFormField<DynamicFormValues, string>
            control={form.control}
            name={fieldName}
            rules={{
              required: fieldDefinition.isRequired
                ? fieldDefinition.errorMessage || "This field is required"
                : false,
            }}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>
                  {fieldDefinition.label}
                  {fieldDefinition.isRequired && (
                    <span className="ml-1 text-destructive">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={typeof field.value === "string" ? field.value : ""}
                    className="flex flex-col space-y-1"
                  >
                    {fieldDefinition.fieldOptions?.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`${fieldName}_${option.id}`}
                        />
                        <Label htmlFor={`${fieldName}_${option.id}`}>
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "CheckboxGroup":
        return (
          <ShadcnFormField<DynamicFormValues, string>
            control={form.control}
            name={fieldName}
            rules={{
              required: fieldDefinition.isRequired
                ? fieldDefinition.errorMessage || "This field is required"
                : false,
            }}
            render={({ field }) => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>
                    {fieldDefinition.label}
                    {fieldDefinition.isRequired && (
                      <span className="ml-1 text-destructive">*</span>
                    )}
                  </FormLabel>
                </div>
                {fieldDefinition.fieldOptions?.map((option) => (
                  <FormItem
                    key={option.id}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={(Array.isArray(field.value)
                          ? field.value
                          : []
                        ).includes(option.value)}
                        onCheckedChange={(checked) => {
                          const currentValue = Array.isArray(field.value)
                            ? field.value
                            : [];
                          if (checked) {
                            field.onChange([...currentValue, option.value]);
                          } else {
                            field.onChange(
                              currentValue.filter(
                                (value: string) => value !== option.value,
                              ),
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {option.label}
                    </FormLabel>
                  </FormItem>
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "File":
      case "Image":
        return (
          <ShadcnFormField
            control={form.control}
            name={fieldName}
            rules={{
              required: fieldDefinition.isRequired
                ? fieldDefinition.errorMessage || "This field is required"
                : false,
            }}
            render={() => (
              <FormItem>
                <FormLabel>
                  {fieldDefinition.label}
                  {fieldDefinition.isRequired && (
                    <span className="ml-1 text-destructive">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById(`file-${fieldName}`)?.click()
                        }
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload {fieldDefinition.type}
                      </Button>
                      <input
                        id={`file-${fieldName}`}
                        type="file"
                        multiple
                        accept={
                          fieldDefinition.type === "Image"
                            ? "image/*"
                            : undefined
                        }
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files)}
                      />
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-1">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded bg-muted p-2"
                          >
                            <span className="text-sm">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "Signature":
        return (
          <FormItem>
            <FormLabel>
              {fieldDefinition.label}
              {fieldDefinition.isRequired && (
                <span className="ml-1 text-destructive">*</span>
              )}
            </FormLabel>
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
              <p className="text-muted-foreground">
                Signature pad would be implemented here
              </p>
              <Button type="button" variant="outline" className="mt-2">
                Open Signature Pad
              </Button>
            </div>
          </FormItem>
        );

      case "Address":
        return (
          <AddressInput
            name={fieldName}
            control={form.control}
            label={fieldDefinition.label}
            isRequired={fieldDefinition.isRequired}
            placeholder={`Enter ${fieldDefinition.label.toLowerCase()}`}
          />
        );

      default:
        return (
          <div className="rounded border border-dashed border-muted-foreground/25 p-4">
            <p className="text-muted-foreground">
              Field type &quot;{fieldDefinition.type}&quot; not implemented yet
            </p>
          </div>
        );
    }
  };

  return <div className="space-y-2">{renderField()}</div>;
}
