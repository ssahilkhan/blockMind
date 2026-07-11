"use client";

import { useContext } from "react";
import { ChainContext } from "../provider/chain-provider";
import type { ChainContextValue } from "../types";

export function useChainContext(): ChainContextValue {
  const ctx = useContext(ChainContext);
  if (!ctx) {
    throw new Error("useChainContext must be used within a ChainProvider");
  }
  return ctx;
}

export function useCurrentChain() {
  const { currentChain, currentChainId } = useChainContext();
  return { chain: currentChain, chainId: currentChainId };
}

export function useChainHealth() {
  const { health, isOnline } = useChainContext();
  return { health, isOnline };
}

export function useSwitchChain() {
  const { setCurrentChain } = useChainContext();
  return { switchChain: setCurrentChain };
}
