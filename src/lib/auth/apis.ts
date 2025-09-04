// 'use server'

import api from "../wretch";
import type {
  LoginPayload,
  LoginResponse,
} from "@/types/auth";

/**
 * Logs the user in by calling the backend API directly.
 * The backend will be responsible for setting the httpOnly session cookie.
 */
export const login = (payload: LoginPayload) => {
  return api
    .post<LoginResponse>("/auth/login", payload);
};
