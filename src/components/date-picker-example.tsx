"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import DatePickerWithCalendarSelect, { FormDatePickerWithCalendarSelect } from "./date-picker-with-calendar-select"

// Example form schema
const formSchema = z.object({
  birthDate: z.date({
    required_error: "Birth date is required",
  }),
  appointmentDate: z.date().optional(),
})

type FormData = z.infer<typeof formSchema>

export default function DatePickerExample() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (data: FormData) => {
    console.log("Form data:", data)
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Date Picker with Calendar Select Example</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Using Controller for react-hook-form integration */}
        <Controller
          name="birthDate"
          control={control}
          render={({ field: { onChange, value } }) => (
            <FormDatePickerWithCalendarSelect
              label="Birth Date *"
              value={value}
              onChange={onChange}
              error={errors.birthDate?.message}
              placeholder="Select your birth date"
            />
          )}
        />

        <Controller
          name="appointmentDate"
          control={control}
          render={({ field: { onChange, value } }) => (
            <DatePickerWithCalendarSelect
              label="Appointment Date (Optional)"
              value={value}
              onChange={onChange}
              placeholder="Select appointment date"
            />
          )}
        />

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Submit Form
        </button>
      </form>

      {/* Debug info */}
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">Form Values:</h3>
        <pre className="text-sm">{JSON.stringify(watch(), null, 2)}</pre>
      </div>
    </div>
  )
} 