import { create } from 'zustand';
import type { View } from '../router/routes';

interface UiState {
  toastMessage: string;
  viewHistory: View[];
  setToastMessage: (message: string) => void;
  pushView: (view: View) => void;
  popView: () => View | undefined;
  clearHistory: () => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  toastMessage: '',
  viewHistory: [],
  setToastMessage: (message) => set({ toastMessage: message }),
  pushView: (view) => set((s) => ({ viewHistory: [...s.viewHistory, view] })),
  popView: () => {
    const history = get().viewHistory;
    if (history.length === 0) return undefined;
    const next = history[history.length - 1];
    set({ viewHistory: history.slice(0, -1) });
    return next;
  },
  clearHistory: () => set({ viewHistory: [] }),
}));
