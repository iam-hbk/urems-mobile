import * as z from "zod";

export const schemaLoginForm = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export type LoginPayload = z.infer<typeof schemaLoginForm>;

export const schemaChangePasswordForm = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one digit")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export const schemaForgotPasswordForm = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

export const schemaResetPasswordForm = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  code: z.string().min(1, "Reset code is required").max(5, "Code must be 5 characters"),
  newPassword: z.string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one digit")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export const schemaConfirmEmailForm = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  code: z.string().min(1, "Confirmation code is required").max(5, "Code must be 5 characters"),
});
