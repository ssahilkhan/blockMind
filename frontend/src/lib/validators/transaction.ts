import { z } from "zod";

const ETH_ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;
const PRIVATE_KEY_REGEX = /^0x[0-9a-fA-F]{64}$/;

export const buildTransactionSchema = z.object({
  from: z
    .string()
    .min(1, "From address is required")
    .regex(ETH_ADDRESS_REGEX, "Invalid Ethereum address"),
  to: z
    .string()
    .min(1, "To address is required")
    .regex(ETH_ADDRESS_REGEX, "Invalid Ethereum address"),
  value: z
    .string()
    .min(1, "Value is required")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, "Must be a valid amount"),
  data: z.string().optional(),
  gasLimit: z.string().optional(),
  gasPrice: z.string().optional(),
  privateKey: z
    .string()
    .min(1, "Private key is required")
    .regex(PRIVATE_KEY_REGEX, "Invalid private key format"),
});

export type BuildTransactionInput = z.infer<typeof buildTransactionSchema>;

export const estimateGasSchema = z.object({
  from: z
    .string()
    .min(1, "From address is required")
    .regex(ETH_ADDRESS_REGEX, "Invalid Ethereum address"),
  to: z
    .string()
    .min(1, "To address is required")
    .regex(ETH_ADDRESS_REGEX, "Invalid Ethereum address"),
  value: z.string().optional(),
  data: z.string().optional(),
});

export type EstimateGasInput = z.infer<typeof estimateGasSchema>;

export const trackTxSchema = z.object({
  hash: z
    .string()
    .min(1, "Transaction hash is required")
    .regex(/^0x[0-9a-fA-F]{64}$/, "Invalid transaction hash format"),
});

export type TrackTxInput = z.infer<typeof trackTxSchema>;
