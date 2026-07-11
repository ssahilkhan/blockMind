import { create } from "zustand";
import type { AIContext } from "../types";

interface AIContextState {
  context: AIContext;
  setContext: (ctx: Partial<AIContext>) => void;
  clearContext: () => void;
}

const initialContext: AIContext = { type: null };

export const useAIContextStore = create<AIContextState>()((set) => ({
  context: initialContext,

  setContext: (ctx: Partial<AIContext>) => {
    set((state) => ({
      context: { ...state.context, ...ctx },
    }));
  },

  clearContext: () => set({ context: initialContext }),
}));
