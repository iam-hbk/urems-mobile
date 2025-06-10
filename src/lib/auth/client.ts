'use client';

import { create } from 'zustand';
import { authConfig, TypeSession, UserTokenCookieName } from './config';
import { TypeLoginForm } from '@/types/auth';
import { apiLogin } from './api';
import { toast } from 'sonner';
import { getCookie, setCookie } from '@/utils/cookies';

interface AuthStore {
  session: TypeSession | null;
  zsSessionToken: string | null;
  zsSetSessionToken: (token: string) => void;
  loading: boolean;
  initialized: boolean;
  setSession: (session: TypeSession | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  zsSessionToken: null,
  loading: true,
  initialized: false,
  zsSetSessionToken: (token) => set({ zsSessionToken: token }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
}));


// Initialize the auth state
if (typeof window !== 'undefined') {

  // Check for existing session
  const checkSession = async () => {
    try {
      const cookieValue = await getCookie(UserTokenCookieName);

      if (cookieValue) {
        useAuthStore.getState().zsSetSessionToken(cookieValue);
      }
    } catch (error: unknown) {
      const m = (error instanceof Error) ? error.message : "Failed to check session";
      toast.error(m);
    }
    finally {
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
    credentials: async (credentials: TypeLoginForm) => {
      try {
        useAuthStore.getState().setLoading(true);

        const res = await apiLogin(credentials);

        if (!res) {
          throw new Error('Authentication failed');
        }

        // store in cookie
        await setCookie(UserTokenCookieName, res.token);

        // might not be useful because of cookie
        useAuthStore.getState().zsSetSessionToken(res.token);

        return res.token;

      } catch (error) {
        throw error as Error;
      } finally {
        useAuthStore.getState().setLoading(false);
      }
    }
  },
  signOut: async () => {
    try {
      useAuthStore.getState().setLoading(true);
      const res = await fetch(`${authConfig.baseUrl}${authConfig.apiPath}/logout`, {
        method: 'POST',
        credentials: 'include', // Important for cookies
      });

      if (!res.ok) {
        throw new Error('Logout failed');
      }

      useAuthStore.getState().setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      useAuthStore.getState().setLoading(false);
    }
  },
  useSession: () => {
    const {
      session,
      loading,
      initialized,
      zsSessionToken
    } = useAuthStore();

    // 
    return {
      data: session,
      sessionToken: zsSessionToken,
      loading: loading || !initialized,
    };
  },
}; 