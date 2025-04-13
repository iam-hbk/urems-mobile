import { EmployeeData } from "@/app/profile/page";
import { create } from "zustand";
// import { persist } from "zustand/middleware";


interface useZuStandEmployeeStoreItems {
  zsEmployee: null | EmployeeData;
  zsSetEmployee: (val: EmployeeData) => void;
  zsClearemployee: () => void;
}


export const useZuStandEmployeeStore = create<useZuStandEmployeeStoreItems>()(
  // persist(
  (set, get) => ({
    zsEmployee: null,
    zsSetEmployee: (val: EmployeeData) => set({ zsEmployee: val }),
    zsClearemployee: () => set({ zsEmployee: null }),
  })
  // ,  )
)

