import { apiClient } from "@/lib/api-client";
import type { ContractCompileResult, EventLog } from "@/types/api";

export interface DeployResult {
  contractAddress: string;
  transactionHash: string;
}

export interface ReadResult {
  result: unknown;
}

export interface WriteResult {
  transactionHash: string;
}

export const contractApi = {
  compile: (sourceCode: string, contractName?: string) =>
    apiClient<ContractCompileResult[]>("/contract/compile", {
      method: "POST",
      body: JSON.stringify({ sourceCode, contractName }),
    }),

  deploy: (params: {
    abi: unknown[];
    bytecode: string;
    args?: unknown[];
    privateKey: string;
  }) =>
    apiClient<DeployResult>("/contract/deploy", {
      method: "POST",
      body: JSON.stringify(params),
    }),

  read: (params: {
    contractAddress: string;
    abi: unknown[];
    functionName: string;
    args?: unknown[];
  }) =>
    apiClient<ReadResult>("/contract/read", {
      method: "POST",
      body: JSON.stringify(params),
    }),

  write: (params: {
    contractAddress: string;
    abi: unknown[];
    functionName: string;
    args?: unknown[];
    privateKey: string;
  }) =>
    apiClient<WriteResult>("/contract/write", {
      method: "POST",
      body: JSON.stringify(params),
    }),

  encode: (params: { abi: unknown[]; functionName: string; args?: unknown[] }) =>
    apiClient<{ encoded: string }>("/contract/encode", {
      method: "POST",
      body: JSON.stringify(params),
    }),

  decode: (params: { abi: unknown[]; data: string }) =>
    apiClient<{ decoded: unknown }>("/contract/decode", {
      method: "POST",
      body: JSON.stringify(params),
    }),

  validateAbi: (abi: unknown[]) =>
    apiClient<{ valid: boolean; errors?: string[] }>("/contract/abi/validate", {
      method: "POST",
      body: JSON.stringify({ abi }),
    }),

  decodeEvents: (txHash: string) =>
    apiClient<EventLog[]>(`/contract/events/${txHash}`),
};
