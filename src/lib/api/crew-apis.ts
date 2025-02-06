import { UREM__ERP_API_BASE } from "../wretch";

// get crew by employeeID
export async function apiGetCrewEmployeeID(employeeID: string) {
  try {
    if (!employeeID)
      return { message: "Invalid Employee Reference Provided", data: null }

    const myHeaders = new Headers();
    myHeaders.append("accept", "text/plain");

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    const res = await fetch(
      `${UREM__ERP_API_BASE}/api/Crew/${employeeID}`,
      requestOptions)

    const data = await res.json();

    return { data: data, message: "successful" };

  } catch (error: unknown) {
    let msg: string = "";
    if (error instanceof Error)
      msg = error.message;
    else
      msg = "Unknown Error Getting Crew By Employee ID"
    // 
    return { message: msg, data: null }
  }
}