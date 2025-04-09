import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRF_FORM } from "@/interfaces/prf-form";
import { User } from "@/interfaces/user";

interface NotesState {
  notesByPrfId: Record<string, { notes: string }>;
  updateNotes: (prfId: string, notes: string) => void;
  clearNotes: (prfId: string) => void;
}

interface StoreState extends NotesState {
  user: User | null;
  prfForms: PRF_FORM[];
  setUser: (user: User) => void;
  setPrfForms: (prfForms: PRF_FORM[]) => void;
  addPrfForm: (prf: PRF_FORM) => void;
  updatePrfForm: (updatedPrf: PRF_FORM) => void;
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
            prf.prfFormId === updatedPrf.prfFormId ? updatedPrf : prf
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
          const { [prfId]: _, ...rest } = state.notesByPrfId;
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
    }
  )
);
