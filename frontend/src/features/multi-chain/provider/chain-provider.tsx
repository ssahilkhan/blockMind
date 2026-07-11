"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { networkApi } from "../services/network-api";
import { getChainById, getDefaultChain, getEnabledChains, getMainnets, getTestnets } from "../registry";
import { useAppStore } from "@/stores/app-store";
import type { ChainContextValue, ChainMetadata, ChainHealthState } from "../types";

export const ChainContext = createContext<ChainContextValue | null>(null);

const STORAGE_KEY = "blockmind:currentChainId";

function getStoredChainId(): number {
  if (typeof window === "undefined") return getDefaultChain().chainId;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && /^\d+$/.test(stored)) {
    const id = parseInt(stored, 10);
    if (getChainById(id)) return id;
  }
  return getDefaultChain().chainId;
}

export function ChainProvider({ children }: { children: ReactNode }) {
  const [currentChainId, setCurrentChainIdState] = useState<number>(getStoredChainId);
  const setCurrentNetwork = useAppStore((s) => s.setCurrentNetwork);
  const queryClient = useQueryClient();

  const currentChain = useMemo(
    () => getChainById(currentChainId) ?? getDefaultChain(),
    [currentChainId],
  );

  const { data: healthData } = useQuery({
    queryKey: ["network", "health", currentChainId],
    queryFn: () => networkApi.getChainHealth(currentChainId),
    refetchInterval: 30_000,
    staleTime: 15_000,
  });

  const switchMutation = useMutation({
    mutationFn: (chainId: number) => networkApi.switchChain(chainId),
    onSuccess: (_data, chainId) => {
      setCurrentChainIdState(chainId);
      localStorage.setItem(STORAGE_KEY, String(chainId));
      queryClient.invalidateQueries({ queryKey: ["network"] });
      queryClient.invalidateQueries({ queryKey: ["chain"] });
    },
  });

  const setCurrentChain = useCallback(
    (chainId: number) => {
      const chain = getChainById(chainId);
      if (!chain || chain.isEnabled === false) return;
      setCurrentChainIdState(chainId);
      localStorage.setItem(STORAGE_KEY, String(chainId));
      setCurrentNetwork({
        chainId: chain.chainId,
        name: chain.name,
        currency: chain.nativeCurrency.symbol,
      });
      queryClient.invalidateQueries({ queryKey: ["chain"] });
      queryClient.invalidateQueries({ queryKey: ["network"] });
    },
    [setCurrentNetwork, queryClient],
  );

  useEffect(() => {
    setCurrentNetwork({
      chainId: currentChain.chainId,
      name: currentChain.name,
      currency: currentChain.nativeCurrency.symbol,
    });
  }, [currentChain, setCurrentNetwork]);

  const value: ChainContextValue = useMemo(
    () => ({
      currentChain,
      currentChainId,
      setCurrentChain,
      health: healthData ?? null,
      allChains: getEnabledChains(),
      mainnets: getMainnets(),
      testnets: getTestnets(),
      isOnline: healthData?.connected ?? false,
    }),
    [currentChain, currentChainId, setCurrentChain, healthData],
  );

  return <ChainContext.Provider value={value}>{children}</ChainContext.Provider>;
}
