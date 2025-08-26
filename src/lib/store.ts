import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRF_FORM } from "@/interfaces/prf-form";
import { User } from "@/interfaces/user";
import { FormResponseSummary } from "@/types/form-template";

interface NotesState {
  notesByPrfId: Record<string, { notes: string }>;
  updateNotes: (prfId: string, notes: string) => void;
  clearNotes: (prfId: string) => void;
}

interface StoreState extends NotesState {
  user: User | null;
  prfForms: FormResponseSummary[];
  setUser: (user: User) => void;
  setPrfForms: (prfForms: FormResponseSummary[]) => void;
  addPrfForm: (prf: FormResponseSummary) => void;
  updatePrfForm: (updatedPrf: FormResponseSummary) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      prfForms: [],
      notesByPrfId: {},
      setUser: (user) => set({ user }),
      setPrfForms: (prfForms) => set({ prfForms }),
      addPrfForm: (prf) =>
        set((state) => ({
          prfForms: [...state.prfForms, prf],
        })),
      updatePrfForm: (updatedPrf) =>
        set((state) => ({
          prfForms: state.prfForms.map((prf) =>
            prf.id === updatedPrf.id ? updatedPrf : prf,
          ),
        })),
      updateNotes: (prfId, notes) =>
        set((state) => ({
          notesByPrfId: {
            ...state.notesByPrfId,
            [prfId]: { notes },
          },
        })),
      clearNotes: (prfId) =>
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [prfId]: removed, ...rest } = state.notesByPrfId;
          return { notesByPrfId: rest };
        }),
    }),
    {
      name: "prf-storage",
      partialize: (state) => ({
        user: state.user,
        prfForms: state.prfForms,
        notesByPrfId: state.notesByPrfId,
      }),
    },
  ),
);
