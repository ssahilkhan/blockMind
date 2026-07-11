import { create } from "zustand";
import type { RecentEvent } from "@/types/events";

interface EventStoreState {
  recentEvents: RecentEvent[];
  addRecentEvent: (event: RecentEvent) => void;
}

export const useEventStore = create<EventStoreState>((set) => ({
  recentEvents: [],
  addRecentEvent: (event) =>
    set((state) => {
      const key = `${event.transactionHash}-${event.contract}`;
      const filtered = state.recentEvents.filter(
        (e) => `${e.transactionHash}-${e.contract}` !== key,
      );
      return { recentEvents: [event, ...filtered].slice(0, 50) };
    }),
}));
