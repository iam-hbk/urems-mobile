export type UserData = {
  firstName: string;
  lastName: string;
  initials: string;
  gender: string;
  id: string;
  email: string;
  userName: string;
};

export type ClientSession = {
  user: UserData;
  sessionToken: string;
};

export type UseSessionReturn = {
  data: ClientSession | null;
  loading: boolean;
  sessionToken: string | null;
};
