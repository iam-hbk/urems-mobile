import api from "../wretch";
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