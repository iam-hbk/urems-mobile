"use server";

import api from "../wretch";
import type { ApiResult } from "../wretch";
import type { UserData } from "@/lib/auth/dal";

export async function apiGetUserInformation(userId: string): ApiResult<UserData> {
  return api.get<UserData>(`/auth/users/${userId}`);
}
