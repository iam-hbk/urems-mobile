import { create } from "zustand";
// import { persist } from "zustand/middleware";


interface useZuStandCrewStoreItems {
  zsCrewID: null | number;
  zsSetCrewID: (val: number) => void;
  zsClearCrewID: () => void;
}

export const useZuStandCrewStore = create<useZuStandCrewStoreItems>()(
  // persist(
  (set, get) => ({
    zsCrewID: null,
    zsSetCrewID: (val: number) => set({ zsCrewID: val }),
    zsClearCrewID: () => set({ zsCrewID: null }),
  })
  // ,  )
)

