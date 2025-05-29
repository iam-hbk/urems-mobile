
import * as z from "zod";

export const SchemaLoginForm = z.object({
  email: z.string().min(1, "Employee number is required"),
  password: z.string().min(1, "Password is required"),
});
