import { EmployeeData } from "@/app/profile/page";

export type TypeSession = {
  user: EmployeeData;
  expires: string;
};

export type AuthConfig = {
  baseUrl: string;
  apiPath: string;
  session?: TypeSession;
};

export const UserTokenCookieName = 'userToken';

export const authConfig: AuthConfig = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiPath: '/api/auth',
}; 