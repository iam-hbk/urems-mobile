'use server';

import { getCookie } from "@/utils/cookies";
import { UserTokenCookieName } from "../auth/config";
import api from "../wretch";

export async function apiGetUserInformation(userId: string) {
  try {
    const sessionToken = await getCookie(UserTokenCookieName);

    const results = await api.get(`/api/auth/users/${userId}`);

    return results;
  }
  catch (error: unknown) {
    throw error as Error;
  }
}