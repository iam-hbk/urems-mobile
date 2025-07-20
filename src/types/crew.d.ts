import { typeEmployee } from "./employee";

// will change based on the new schema
export interface typeCrew {
  id: string;
  vehicleId: string;
  startTime: string,
  endTime: string,
  employeeNumber: string;
  employee: typeEmployee,
}

export type typeShiftStatus = 'current' | 'past' | 'future' | 'unknown'