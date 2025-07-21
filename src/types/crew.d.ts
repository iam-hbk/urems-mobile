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

// v2
export interface typeCrewEmployee {
  personId: string;
  firstName: string;
  lastName: string;
  initials: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  employeeId: string;
  employeeNumber: string;
  employeeTypeId: number;
}

export interface typeCrew1 {
  Id: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
}

export interface typeCrewInfoV1 {
  employees: typeCrewEmployee[],
  crew: typeCrew1
}