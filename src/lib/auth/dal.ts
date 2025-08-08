'use server'

import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { ok, err, Result } from "neverthrow";
import type { ApiError } from "@/types/api";
import { UserTokenCookieName } from "./config";
import { API_BASE_URL } from "../wretch";
import { cookieNameUserId } from "@/utils/constant";
import { typeEmployee } from "@/types/person";

export type UserData = {
  firstName: string;
  lastName: string;
  initials: string;
  gender: string;
  id: string;
  email: string;
  userName: string;
  role: string;
  employeeType: string;
  employeeId?: number;
};

export type Session = {
  user: typeEmployee;
  token: string;
};

// Verify session by calling the /me endpoint on the backend
export const verifySession = cache(
  async (): Promise<Result<Session, ApiError>> => {
    const cookieStore = await cookies();
    const token = cookieStore.get(UserTokenCookieName)?.value;
    const userId = cookieStore.get(cookieNameUserId)?.value

    // console.log(' ... api url ... ', API_BASE_URL, token, userId);

    if (!token) {
      return err({
        type: "AuthError",
        title: "No session token",
        status: 401,
        detail: "No session token found in cookies.",
      });
    }

    if (!userId) {
      return err({
        type: "AuthError",
        title: "No user session Id",
        status: 401,
        detail: "No user session reference Id found in cookies.",
      });
    }

    try {
      // Call the /me endpoint to get the current user's data
      const response = await fetch(`${API_BASE_URL}/api/Employee/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error(
          "Session verification failed: The /me endpoint returned an error.",
        );
        const errorJson = (await response
          .json()
          .catch(() => ({}))) as Partial<ApiError>;
        return err({
          type: errorJson.type || "ApiError",
          title: errorJson.title || "Session verification failed",
          status: response.status,
          detail: errorJson.detail || "The /me endpoint returned an error.",
        });
      }

      // const userData: UserData = await response.json();
      const userData: typeEmployee = await response.json();

      // If we get user data, the session is valid
      return ok({
        user: userData,
        token,
      });
    } catch (error) {
      console.error("An error occurred during session verification:", error);
      return err({
        type: "NetworkError",
        title: "A network error occurred during session verification.",
        status: 0,
        detail: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// Get user data (with session verification)
export const getUser = cache(async (): Promise<Result<typeEmployee, ApiError>> => {
  const sessionResult = await verifySession();
  return sessionResult.map((session) => session.user);
});

// Get session token
export const getSessionToken = cache(
  async (): Promise<Result<string, ApiError>> => {
    const sessionResult = await verifySession();
    return sessionResult.map((session) => session.token);
  },
);
