
'use server';

import { TypeLoginForm } from "@/types/auth";
import { UREM__ERP_API_BASE } from "../wretch";


// login
export async function apiLogin(data: TypeLoginForm) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("accept", "*/*");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "email": data.email,
      "password": data.password
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
      credentials: 'include',
    };

    const res = await fetch(`${UREM__ERP_API_BASE}/api/auth/login`, requestOptions);
    if (!res.ok) {
      throw new Error("Invalid login credentials");
    }

    const results = await res.json();

    return results;

  } catch (error: unknown) { // poor coding styles
    throw error as Error
  }
}