import api from "../wretch";
import type {
  LoginPayload,
  LoginResponse,
  TypeChangePasswordForm,
  TypeForgotPasswordForm,
  TypeResetPasswordForm,
  TypeConfirmEmailForm,
} from "@/types/auth";
import type { Session } from "./dal";

/**
 * Logs the user in by calling the backend API directly.
 * The backend will be responsible for setting the httpOnly session cookie.
 */
export const login = (payload: LoginPayload) => {
  return api.post<LoginResponse>("/auth/login", payload);
};

/**
 * Logs the user out by calling the backend API.
 * The backend handles the clearing of the session cookie.
 */
export const logout = () => {
  return api.post<unknown>("/auth/logout", {});
};

/**
 * Fetches the current user's session state from our BFF route.
 * This is a client-safe way to check the httpOnly cookie.
 * This doesn't use the wretch api because it calls the Next.js API route.
 * wretch api is only for backend to backend calls with dotnet base url.
 */
export const getSession = async (): Promise<Session | null> => {
  try {
    const res = await fetch("/api/auth/session");
    if (!res.ok) return null;
    const session = await res.json();
    // The session object from the API can be null if not authenticated
    return session.user ? session : null;
  } catch (error) {
    console.error("Failed to fetch session:", error);
    return null;
  }
};

/**
 * Change password for authenticated user
 */
export const changePassword = (data: TypeChangePasswordForm) => {
  return api.post<{ message: string }>("/auth/change-password", data);
};

/**
 * Request a password reset code via email (5-character short code)
 */
export const sendPasswordResetCode = (data: TypeForgotPasswordForm) => {
  return api.post<{ message: string; code?: string }>(
    "/auth/send-password-reset-code",
    data,
  );
};

/**
 * Reset password using 5-character email code
 */
export const resetPasswordWithCode = (data: TypeResetPasswordForm) => {
  return api.post<{ message: string }>("/auth/reset-password-with-code", data);
};

/**
 * Send email confirmation code
 */
export const sendConfirmationCode = (data: TypeForgotPasswordForm) => {
  return api.post<{ message: string; code?: string }>(
    "/auth/send-confirmation-code",
    data,
  );
};

/**
 * Confirm email with 5-character code
 */
export const confirmEmailWithCode = (data: TypeConfirmEmailForm) => {
  return api.post<{ message: string }>("/auth/confirm-email-with-code", data);
};
