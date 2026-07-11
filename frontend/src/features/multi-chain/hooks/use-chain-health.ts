"use client";

import { useQuery } from "@tanstack/react-query";
import { networkApi } from "../services/network-api";
import type { ChainHealthState } from "../types";

export function useChainHealthPolling(intervalMs = 30_000) {
  return useQuery({
    queryKey: ["network", "health"],
    queryFn: () => networkApi.getHealth(),
    refetchInterval: intervalMs,
    staleTime: intervalMs / 2,
  });
}

export function useSingleChainHealth(chainId: number, intervalMs = 15_000) {
  return useQuery({
    queryKey: ["network", "health", chainId],
    queryFn: () => networkApi.getChainHealth(chainId),
    refetchInterval: intervalMs,
    staleTime: intervalMs / 2,
  });
}
