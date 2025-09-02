import type { UserData } from "./dal";

export type ClientSession = {
  user: UserData;
  sessionToken: string;
};

export type UseSessionReturn = {
  data: ClientSession | null;
  loading: boolean;
  sessionToken: string | null;
};
