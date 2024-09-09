import { PRF_FORM } from "@/interfaces/prf-form";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  name: string;
  email: string;
};

interface StoreState {
  user: User | null;
  prfForms: PRF_FORM[];
  setUser: (user: User) => void;
  addPrfForm: (prf: PRF_FORM) => void;
  setPrfForms: (prfs: PRF_FORM[]) => void;
  updatePrfForm: (updatedPrf: PRF_FORM) => void;
}
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      prfForms: [],
      setUser: (user) => set({ user }),
      addPrfForm: (prf) =>
        set((state) => ({
          prfForms: [...state.prfForms, prf],
        })),
      setPrfForms: (prfs) => set({ prfForms: prfs }),
      updatePrfForm: (updatedPrf) => {
        console.log("UPDATES ->", updatedPrf);
        console.log("BEFORE WITH GET ->", get().prfForms.find((p) => p.prfFormId === updatedPrf.prfFormId));
        set((state) => ({
          prfForms: state.prfForms.map((prf) => {
            if (prf.prfFormId === updatedPrf.prfFormId) {
              console.log("BEFORE WITH STATE ->", state.prfForms.find((p) => p.prfFormId === updatedPrf.prfFormId));
              console.log(
                `Updating THIS - ${prf.prfFormId} - ${updatedPrf.prfFormId === prf.prfFormId}`,
              );
              return updatedPrf;
            }
            return prf;
          }),
        }));
        console.log("RESULTS ->", get().prfForms);

      },
    }),
    { name: "prf-store" },
  ),
);
