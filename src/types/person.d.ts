
export interface typeEmployee {
  id: string;
  employeeNumber: string;
  employeeTypeId: number;
  personId: string;
  employeeType: EmployeeType;
  person: typeIdentityPerson;
  certificates: [];
  stockTransfers: [];
}

// / meeds to change this to person
export interface typePerson {
  firstName: string;
  lastName: string;
  initials: string;
  gender: string;
  id: string;
  email: string;
  userName: string | null;
  dateOfBirth: string;
  personIdentifications?: typePersonIdentifications[]
}

export interface typeIdentityPerson {
  firstName: string;
  secondName: string;
  lastName: string;
  dateOfBirth: string;
  initials: string;
  gender: string;
  employee: Employee;
  patient: null;
  licenses: [];
  personContactDetails: [];
  crews: [];
  personIdentifications: [];
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumber: null;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: null;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}