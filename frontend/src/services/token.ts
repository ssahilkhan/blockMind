import { apiClient } from "@/lib/api-client";
import type { TokenMetadata } from "@/types/api";

export interface TransferResult {
  transactionHash: string;
}

export interface ApprovalResult {
  success: boolean;
}

export interface AllowanceResult {
  allowance: string;
}

export const tokenApi = {
  detectStandard: (address: string) =>
    apiClient<{ standard: string }>(`/token/${address}/type`),

  getMetadata: (address: string) =>
    apiClient<TokenMetadata>(`/token/${address}`),

  getBalance: (tokenAddress: string, walletAddress: string) =>
    apiClient<{ balance: string }>(`/token/${tokenAddress}/balance/${walletAddress}`),

  transfer: (params: {
    tokenAddress: string;
    to: string;
    amount: string;
    privateKey: string;
    standard?: string;
  }) =>
    apiClient<TransferResult>("/token/transfer", {
      method: "POST",
      body: JSON.stringify(params),
    }),

  approve: (params: {
    tokenAddress: string;
    spender: string;
    amount: string;
    privateKey: string;
    standard?: string;
  }) =>
    apiClient<ApprovalResult>("/token/approve", {
      method: "POST",
      body: JSON.stringify(params),
    }),

  getNFTMetadata: (address: string, tokenId: string) =>
    apiClient<{ name: string; description: string; image: string }>(
      `/token/${address}/token/${tokenId}`,
    ),
};
