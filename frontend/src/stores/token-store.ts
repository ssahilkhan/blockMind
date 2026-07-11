import { create } from "zustand";
import type { RecentToken, RecentTransfer } from "@/types/token";

interface TokenStoreState {
  recentTokens: RecentToken[];
  recentTransfers: RecentTransfer[];
  addRecentToken: (token: RecentToken) => void;
  addRecentTransfer: (transfer: RecentTransfer) => void;
}

export const useTokenStore = create<TokenStoreState>((set) => ({
  recentTokens: [],
  recentTransfers: [],
  addRecentToken: (token) =>
    set((state) => {
      const filtered = state.recentTokens.filter(
        (t) => t.address.toLowerCase() !== token.address.toLowerCase(),
      );
      return { recentTokens: [token, ...filtered].slice(0, 20) };
    }),
  addRecentTransfer: (transfer) =>
    set((state) => ({
      recentTransfers: [transfer, ...state.recentTransfers].slice(0, 20),
    })),
}));
