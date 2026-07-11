import { z } from "zod";

export const securityAnalysisSchema = z.object({
  type: z.enum(["wallet", "contract", "transaction", "token"]),
  target: z.string().min(1, "Target address or hash is required"),
});

export const walletAnalysisSchema = z.object({
  address: z
    .string()
    .min(42, "Address must be 42 characters")
    .regex(/^0x[0-9a-fA-F]{40}$/, "Invalid address format"),
});

export const contractAnalysisSchema = z.object({
  address: z
    .string()
    .min(42, "Address must be 42 characters")
    .regex(/^0x[0-9a-fA-F]{40}$/, "Invalid address format"),
});

export const transactionAnalysisSchema = z.object({
  hash: z
    .string()
    .min(66, "Hash must be 66 characters")
    .regex(/^0x[0-9a-fA-F]{64}$/, "Invalid transaction hash"),
});

export const tokenAnalysisSchema = z.object({
  address: z
    .string()
    .min(42, "Address must be 42 characters")
    .regex(/^0x[0-9a-fA-F]{40}$/, "Invalid address format"),
});

export type SecurityAnalysisInput = z.infer<typeof securityAnalysisSchema>;
export type WalletAnalysisInput = z.infer<typeof walletAnalysisSchema>;
export type ContractAnalysisInput = z.infer<typeof contractAnalysisSchema>;
export type TransactionAnalysisInput = z.infer<typeof transactionAnalysisSchema>;
export type TokenAnalysisInput = z.infer<typeof tokenAnalysisSchema>;
