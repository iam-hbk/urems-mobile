
import { create } from "zustand";

interface useZustandSessionProps {
  zsSessionToken: string | null;
  zsSetSessionToken: (token: string) => void;
}

export const useZustandSession = create<useZustandSessionProps>()(
  (set) => ({
    zsSessionToken: null,
    zsSetSessionToken: (token: string) => set({ zsSessionToken: token })
  })
);