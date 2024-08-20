// src/store.ts
import { fetchPrfForms } from "@/hooks/prf/usePrfForms";
import { PRF_FORM } from "@/interfaces/prf-form";
import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
}

interface StoreState {
  user: User | null;
  prfForms: PRF_FORM[];
  setUser: (user: User) => void;
  addPrfForm: (prf: PRF_FORM) => void;
  setPrfForms: (prfs: PRF_FORM[]) => void;
  updatePrfForm: (updatedPrf: PRF_FORM) => void;
}
const getPrfForms = async () => {
  fetchPrfForms();
};
export const useStore = create<StoreState>((set, get) => ({
  user: null,
  prfForms: [],
  setUser: (user) => set({ user }),
  addPrfForm: (prf) =>
    set((state) => ({
      prfForms: [...state.prfForms, prf],
    })),
  setPrfForms: (prfs) => set({ prfForms: prfs }),
  updatePrfForm: (updatedPrf) =>
    set((state) => ({
      prfForms: state.prfForms.map((prf) => {
        if (prf.prfFormId === updatedPrf.prfFormId) {
          return updatedPrf;
        }
        return prf;
      }),
    })),
}));
