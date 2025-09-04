import {
  schemaChangePasswordForm,
  schemaForgotPasswordForm,
  schemaResetPasswordForm,
  schemaConfirmEmailForm,
} from "@/schema/auth";
import * as z from "zod";

export type LoginPayload = {
  email: string;
  password?: string;
};

export type LoginResponse = {
  message: string;
  // will be removed when cookies are working in prod
  user_id: string;
  access_token: string;
};

export type TypeLoginForm = {
  email: string;
  password?: string | undefined;
};

export type TypeChangePasswordForm = z.infer<typeof schemaChangePasswordForm>;

export type TypeForgotPasswordForm = z.infer<typeof schemaForgotPasswordForm>;

export type TypeResetPasswordForm = z.infer<typeof schemaResetPasswordForm>;

export type TypeConfirmEmailForm = z.infer<typeof schemaConfirmEmailForm>;


export interface typeParsedCookie {
  name: string;
  value: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: typeSameSite;
  path?: string;
  expires?: string;
}

export type typeSameSite = 'lax' | 'strict' | 'none' | undefined;