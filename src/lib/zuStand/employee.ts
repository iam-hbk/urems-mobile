import { create } from "zustand";
import { UserData } from "../auth/dal";

interface useZuStandEmployeeStoreProps {
  zsEmployee: null | UserData;
  zsSetEmployee: (val: UserData) => void;
}

export const useZuStandEmployeeStore = create<useZuStandEmployeeStoreProps>()(
  (set) => ({
    zsEmployee: null,
    zsSetEmployee: (val) => set({ zsEmployee: val }),
  }),
);