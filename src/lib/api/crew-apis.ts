'use server'

import api, { API_BASE_URL } from "../wretch";
import { err, ok, Result } from "neverthrow";
import type { ApiError } from "@/types/api";
import { TypeCrew } from "@/interfaces/crew";

// get crew by employeeID
export async function apiGetCrewEmployeeID(
  employeeID: string,
): Promise<Result<TypeCrew, ApiError>> {
  if (!employeeID) {
    return err({
      type: "ValidationError",
      title: "Invalid Employee ID",
      status: 400,
      detail: "Invalid Employee Reference Provided",
    });
  }

  const result = await api.get<TypeCrew>(`/api/Crew/${employeeID}`);
  return result;
}

// used this because, i need to pass the user token from the cookie
// get crew by employee id
export async function apiCrewGetEmployee(token: string, employeeId: string) {
  try {
    if (!employeeId) throw new Error("Invalid employee id provided.");
    if (!token) throw new Error("Invalid token. User not authenticated");

    const myHeaders = new Headers();
    myHeaders.append("accept", "text/plain");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    const response = await fetch(`${API_BASE_URL}/api/Crew/${employeeId}`, requestOptions)

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    return { data: data, message: '' };

  }
  catch (error: unknown) {
    return {
      message: (error as Error).message,
      data: null
    }
  }
}

// get crew that is current or future
export async function apiCrewGetCurrent(employeeId: string, token: string) {
  try {

    if (!employeeId) throw new Error("Invalid employee id provided.");
    if (!token) throw new Error("Invalid token. User not authenticated");

    const myHeaders = new Headers();
    myHeaders.append("accept", "text/plain");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    const response = await fetch(`${API_BASE_URL}/api/Crew/current/${employeeId}`, requestOptions)

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    return { data: data, error: null };

  } catch (error: unknown) {
    return {
      error: (error as Error).message,
      data: null
    }
  }
}