import { apiClient } from "@/lib/api-client";

export interface GasEstimate {
  gasEstimation: string;
  gasEstimationWei: string;
}

export interface BroadcastResult {
  transactionHash: string;
}

export interface TrackResult {
  status: "pending" | "confirmed" | "failed";
  confirmations?: number;
  blockNumber?: number;
  receipt?: {
    transactionHash: string;
    blockNumber: number;
    blockHash: string;
    from: string;
    to: string | null;
    status: "success" | "failed";
    gasUsed: string;
    gasPrice: string;
    contractAddress: string | null;
  };
  error?: string;
}

export const transactionApi = {
  buildAndSend: (params: {
    to?: string;
    value?: string;
    data?: string;
    nonce?: number;
    gasLimit?: string;
    gasPrice?: string;
    privateKey: string;
  }) =>
    apiClient<{ transactionHash: string }>("/transaction/send", {
      method: "POST",
      body: JSON.stringify(params),
    }),

  estimateGas: (params: {
    from: string;
    to?: string;
    value?: string;
    data?: string;
  }) =>
    apiClient<GasEstimate>("/transaction/estimate-gas", {
      method: "POST",
      body: JSON.stringify(params),
    }),

  broadcast: (signedTx: string) =>
    apiClient<BroadcastResult>("/transaction/broadcast", {
      method: "POST",
      body: JSON.stringify({ signedTx }),
    }),

  track: (hash: string) => apiClient<TrackResult>(`/transaction/track/${hash}`),
};
