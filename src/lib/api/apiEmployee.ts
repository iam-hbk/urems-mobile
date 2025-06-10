'use server';

import { getCookie } from "@/utils/cookies";
import { UserTokenCookieName } from "../auth/config";
import { UREM__ERP_API_BASE } from "../wretch";
import { TypeChangePasswordForm } from "@/types/auth";


export async function apiGetUserInformation() {
  try {

    const sessionToken = await getCookie(UserTokenCookieName);

    const myHeaders = new Headers();
    myHeaders.append("accept", "*/*");
    myHeaders.append("Authorization", `Bearer ${sessionToken}`);

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    const res = await fetch(`${UREM__ERP_API_BASE}/api/auth/users`, requestOptions);

    if (!res.ok) {
      throw new Error("Error getting all users");
    }

    const results = await res.json();

    return results[0];
  }
  catch (error: unknown) {
    throw error as Error;
  }
}

export async function apiChangePassword(data: TypeChangePasswordForm) {
  try {

    if (data.newPassword !== data.confirmPassword) {
      throw new Error('Confirm and new password, do not match');
    }

    const cookieAuthToken = await getCookie(UserTokenCookieName);

    const myHeaders = new Headers();
    myHeaders.append("accept", "*/*");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${cookieAuthToken}`);

    const raw = JSON.stringify({
      "currentPassword": data.currentPassword,
      "newPassword": data.newPassword
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const res = await fetch(`${UREM__ERP_API_BASE}/api/auth/reset-password`, requestOptions);

    if (!res.ok) {
      throw new Error("Invalid password provided");
    }
  }
  catch (error: unknown) {
    throw error as Error;
  }
}