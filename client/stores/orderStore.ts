import { create } from 'zustand';
import type { IMOrder } from '@shared/types';

interface OrderState {
  imOrders: IMOrder[];
  setImOrders: (orders: IMOrder[] | ((prev: IMOrder[]) => IMOrder[])) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  imOrders: [],
  setImOrders: (orders) =>
    set((s) => ({
      imOrders: typeof orders === 'function' ? orders(s.imOrders) : orders,
    })),
}));
