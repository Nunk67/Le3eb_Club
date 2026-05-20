import { create } from 'zustand';
import type { Wallet as WalletType } from '@shared/types';

/** Client-side wallet snapshot; server remains source of truth until PG migration. */
interface WalletState {
  wallet: WalletType | null;
  setWallet: (wallet: WalletType | null) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallet: null,
  setWallet: (wallet) => set({ wallet }),
}));
