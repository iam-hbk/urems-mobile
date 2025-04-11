'use client';

import { create } from 'zustand';
import { Session, authConfig } from './config';

interface AuthStore {
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  loading: true,
  initialized: false,
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
}));

// Initialize the auth state
if (typeof window !== 'undefined') {
  // Check for existing session
  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/check-session');
      if (res.ok) {
        const session = await res.json();
        useAuthStore.getState().setSession(session);
      }
    } catch (error) {
      console.error('Failed to check session:', error);
    } finally {
      useAuthStore.getState().setLoading(false);
      useAuthStore.getState().setInitialized(true);
    }
  };

  // Only run if not initialized
  if (!useAuthStore.getState().initialized) {
    checkSession();
  }
}

export const authClient = {
  signIn: {
    credentials: async (credentials: { employeeNumber: string; password: string }) => {
      try {
        useAuthStore.getState().setLoading(true);
        const res = await fetch(`${authConfig.baseUrl}${authConfig.apiPath}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
        
        if (!res.ok) throw new Error('Authentication failed');
        
        const session = await res.json();
        useAuthStore.getState().setSession(session);
        return session;
      } catch (error) {
        throw error;
      } finally {
        useAuthStore.getState().setLoading(false);
      }
    }
  },
  signOut: async () => {
    try {
      useAuthStore.getState().setLoading(true);
      await fetch(`${authConfig.baseUrl}${authConfig.apiPath}/logout`, {
        method: 'POST',
      });
      useAuthStore.getState().setSession(null);
    } catch (error) {
      throw error;
    } finally {
      useAuthStore.getState().setLoading(false);
    }
  },
  useSession: () => {
    const { session, loading, initialized } = useAuthStore();
    return {
      data: session,
      loading: loading || !initialized,
    };
  },
}; 