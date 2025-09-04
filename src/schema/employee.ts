import { z } from "zod"

export const PersonIdentificationsSchema = z.object({
  isPrimary: z.boolean(),
  identification: z.object({
    identification1: z
      .string()
      .min(2, "Identification must be at least 2 characters"),
    identificationType: z.object({
      identificationType1: z
        .string()
        .min(2, "Identification type must be at least 2 characters"),
    }),
  }),
})