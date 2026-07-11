import { apiClient } from "@/lib/api-client";
import type { EventLog } from "@/types/api";

export interface EventRegistry {
  standard: string;
  events: { name: string; signature: string }[];
}

export const eventsApi = {
  getReceiptEvents: (txHash: string) =>
    apiClient<EventLog[]>(`/events/receipt/${txHash}`),

  getBlockEvents: (blockNumber: number) =>
    apiClient<EventLog[]>(`/events/block/${blockNumber}`),

  getRangeEvents: (from: number, to: number) =>
    apiClient<EventLog[]>(`/events/range?from=${from}&to=${to}`),

  searchEvents: (params: { contract?: string; event?: string; fromBlock?: number; toBlock?: number }) => {
    const query = new URLSearchParams();
    if (params.contract) query.set("contract", params.contract);
    if (params.event) query.set("event", params.event);
    if (params.fromBlock !== undefined) query.set("fromBlock", String(params.fromBlock));
    if (params.toBlock !== undefined) query.set("toBlock", String(params.toBlock));
    return apiClient<EventLog[]>(`/events/search?${query.toString()}`);
  },

  getRegistry: () => apiClient<EventRegistry[]>("/events/registry"),
};
