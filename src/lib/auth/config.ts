import { EmployeeData } from "@/app/profile/page";

export type Session = {
  user: EmployeeData;
  expires: string;
};

export type AuthConfig = {
  baseUrl: string;
  apiPath: string;
  session?: Session;
};

export const authConfig: AuthConfig = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiPath: '/api/auth',
}; 