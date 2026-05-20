import { create } from 'zustand';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  setTokens: (token: string | null, refreshToken?: string | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  token: null,
  refreshToken: null,
  setTokens: (token, refreshToken = null) => set({ token, refreshToken }),
  clear: () => set({ token: null, refreshToken: null }),
}));
