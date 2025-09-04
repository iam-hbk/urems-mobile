import { UserData } from './dal'

export type TypeSession = {
  user: UserData;
  expires: string;
};

export type AuthConfig = {
  baseUrl: string;
  apiPath: string;
  session?: TypeSession;
};

export const UserTokenCookieName = 'access_token';

export const authConfig: AuthConfig = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiPath: '/api/auth',
}; 