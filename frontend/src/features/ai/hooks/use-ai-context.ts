"use client";

import { useEffect } from "react";
import { useAIContextStore } from "../stores/context-store";

export function useWalletContext(address: string | null) {
  const setContext = useAIContextStore((s) => s.setContext);
  useEffect(() => {
    if (address) {
      setContext({ type: "wallet", walletAddress: address });
    }
  }, [address, setContext]);
}

export function useTransactionContext(hash: string | null) {
  const setContext = useAIContextStore((s) => s.setContext);
  useEffect(() => {
    if (hash) {
      setContext({ type: "transaction", transactionHash: hash });
    }
  }, [hash, setContext]);
}

export function useContractContext(address: string | null) {
  const setContext = useAIContextStore((s) => s.setContext);
  useEffect(() => {
    if (address) {
      setContext({ type: "contract", contractAddress: address });
    }
  }, [address, setContext]);
}

export function useTokenContext(address: string | null) {
  const setContext = useAIContextStore((s) => s.setContext);
  useEffect(() => {
    if (address) {
      setContext({ type: "token", tokenAddress: address });
    }
  }, [address, setContext]);
}

export function useEventContext(blockNumber: number | null) {
  const setContext = useAIContextStore((s) => s.setContext);
  useEffect(() => {
    if (blockNumber) {
      setContext({ type: "event", blockNumber });
    }
  }, [blockNumber, setContext]);
}
