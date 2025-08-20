"use server";

import api from "../wretch";

export async function apiGetUserInformation(userId: string) {
  try {
    const results = await api.get(`/api/auth/users/${userId}`);

    return results;
  } catch (error: unknown) {
    throw error as Error;
  }
}
