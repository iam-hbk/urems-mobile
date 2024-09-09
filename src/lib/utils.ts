import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const getSchemaType = (schema: z.ZodTypeAny, path: string): z.ZodTypeAny | undefined => {
  const pathParts = path.split(".");
  let currentSchema = schema;

  for (const part of pathParts) {
    if (currentSchema instanceof z.ZodObject) {
      currentSchema = currentSchema.shape[part];
    } else {
      return undefined;
    }
  }

  return currentSchema;
};