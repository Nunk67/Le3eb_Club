import { create } from 'zustand';
import type { CompanionRanking } from '../services/businessApi';

interface CompanionState {
  rankings: CompanionRanking[];
  setRankings: (rankings: CompanionRanking[]) => void;
}

export const useCompanionStore = create<CompanionState>((set) => ({
  rankings: [],
  setRankings: (rankings) => set({ rankings }),
}));
