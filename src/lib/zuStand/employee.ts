

import { TypeEmployeeData } from "@/types/employee";
import { create } from "zustand";
// import { persist } from "zustand/middleware";


interface useZuStandEmployeeStoreItems {
  zsEmployee: null | TypeEmployeeData;
  zsSetEmployee: (val: TypeEmployeeData) => void;
  zsClearemployee: () => void;
}

export const useZuStandEmployeeStore = create<useZuStandEmployeeStoreItems>()(
  // persist(
  (set) => ({
    zsEmployee: null,
    zsSetEmployee: (val) => set({ zsEmployee: val }),
    zsClearemployee: () => set({ zsEmployee: null }),
  })
  // ,  )
);