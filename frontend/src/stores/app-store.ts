import { create } from "zustand";
import type { AppState } from "@/types";

export const useAppStore = create<AppState>((set) => ({
  currentNetwork: null,
  backendHealth: "healthy",
  sidebarCollapsed: false,
  setCurrentNetwork: (network) => set({ currentNetwork: network }),
  setBackendHealth: (health) => set({ backendHealth: health }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
