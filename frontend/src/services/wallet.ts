import { apiClient } from "@/lib/api-client";
import type { CreatedWallet, WalletDetails, BalanceResult } from "@/types/api";

export interface VerificationResult {
  valid: boolean;
  recoveredAddress: string;
}

export interface SignatureResult {
  signature: string;
}

export const walletApi = {
  createWallet: () => apiClient<CreatedWallet>("/wallet/create", { method: "POST" }),

  importFromPrivateKey: (privateKey: string) =>
    apiClient<{ address: string; publicKey: string }>("/wallet/import", {
      method: "POST",
      body: JSON.stringify({ privateKey }),
    }),

  importFromMnemonic: (mnemonic: string) =>
    apiClient<{ address: string; publicKey: string; privateKey: string; path: string }>(
      "/wallet/import-mnemonic",
      { method: "POST", body: JSON.stringify({ mnemonic }) },
    ),

  validateAddress: (address: string) =>
    apiClient<{ valid: boolean; checksum: boolean }>(
      `/wallet/validate/${address}`,
    ),

  getDetails: (address: string) =>
    apiClient<WalletDetails>(`/wallet/${address}`),

  getBalance: (address: string) =>
    apiClient<BalanceResult>(`/wallet/${address}/balance`),

  signMessage: (message: string) =>
    apiClient<SignatureResult>("/wallet/sign", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  verifySignature: (message: string, signature: string, address: string) =>
    apiClient<VerificationResult>("/wallet/verify", {
      method: "POST",
      body: JSON.stringify({ message, signature, address }),
    }),
};
