import { PersonIdentificationsSchema } from "@/schema/employee";
import { typePerson } from "./person";

export type typePersonIdentifications = z.infer<typeof PersonIdentificationsSchema>;

interface typeEmployeeTypes {
  employeeTypeId: number;
  typeDescription: string;
  employees: [null];
}

export interface typeEmployee {
  id: string;
  personId: string;
  employeeNumber: string;
  employeeTypeId: number;
  // typeIdentityPerson - to find all info, but also needs to change the api to allow all
  // person: typeIdentityPerson;
  person: typePerson;
  certificates: [];
  employeeType: typeEmployeeTypes;
  stockTransfers: [];
}
