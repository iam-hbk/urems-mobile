import { create } from "zustand";
import { UserData } from "../auth/dal";

interface useZuStandEmployeeStoreProps {
  zsEmployee: null | UserData;
  zsSetEmployee: (val: UserData) => void;
  zsEmployeeId: string | null;
  zsSetEmployeeId: (val: string) => void;
}

export const useZuStandEmployeeStore = create<useZuStandEmployeeStoreProps>()(
  (set) => ({
    zsEmployee: null,
    zsEmployeeId: null,
    zsSetEmployee: (val) => set({ zsEmployee: val }),
    zsSetEmployeeId: (val) => set({ zsEmployeeId: val }),
  }),
);