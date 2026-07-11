"use client";

import { useQuery } from "@tanstack/react-query";
import { healthApi, chainApi } from "@/services";
import { useAppStore } from "@/stores/app-store";
import { useEffect } from "react";
import { useChainContext } from "@/features/multi-chain";

export function useHealthPolling(intervalMs = 30_000) {
  const setBackendHealth = useAppStore((s) => s.setBackendHealth);

  const query = useQuery({
    queryKey: ["health"],
    queryFn: () => healthApi.getHealth(),
    refetchInterval: intervalMs,
    retry: true,
    staleTime: intervalMs / 2,
  });

  useEffect(() => {
    if (query.data) {
      setBackendHealth(query.data.status);
    } else if (query.isError) {
      setBackendHealth("unhealthy");
    }
  }, [query.data, query.isError, setBackendHealth]);

  return query;
}

export function useNetworkStatus() {
  const setCurrentNetwork = useAppStore((s) => s.setCurrentNetwork);
  const { currentChainId } = useChainContext();

  const query = useQuery({
    queryKey: ["chain", "network", currentChainId],
    queryFn: () => chainApi.getNetwork(),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (query.data) {
      setCurrentNetwork({
        chainId: query.data.chainId,
        name: query.data.name,
        currency: query.data.currency,
      });
    }
  }, [query.data, setCurrentNetwork]);

  return query;
}
