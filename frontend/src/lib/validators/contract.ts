import { z } from "zod";

const ETH_ADDRESS = /^0x[0-9a-fA-F]{40}$/;
const TX_HASH = /^0x[0-9a-fA-F]{64}$/;
const PRIVATE_KEY = /^0x[0-9a-fA-F]{64}$/;

export const compileSchema = z.object({
  source: z.string().min(1, "Source code is required"),
});

export type CompileInput = z.infer<typeof compileSchema>;

export const deploySchema = z.object({
  privateKey: z
    .string()
    .min(1, "Private key is required")
    .regex(PRIVATE_KEY, "Invalid private key format"),
  constructorArgs: z.string().optional(),
});

export type DeployInput = z.infer<typeof deploySchema>;

export const interactSchema = z.object({
  address: z
    .string()
    .min(1, "Contract address is required")
    .regex(ETH_ADDRESS, "Invalid Ethereum address"),
  abi: z.string().min(1, "ABI JSON is required"),
});

export type InteractInput = z.infer<typeof interactSchema>;

export const readFunctionSchema = z.object({
  args: z.string().optional(),
});

export type ReadFunctionInput = z.infer<typeof readFunctionSchema>;

export const writeFunctionSchema = z.object({
  args: z.string().optional(),
  privateKey: z
    .string()
    .min(1, "Private key is required")
    .regex(PRIVATE_KEY, "Invalid private key format"),
  value: z.string().optional(),
});

export type WriteFunctionInput = z.infer<typeof writeFunctionSchema>;

export const encodeSchema = z.object({
  functionName: z.string().min(1, "Function name is required"),
  args: z.string().optional(),
});

export type EncodeInput = z.infer<typeof encodeSchema>;

export const decodeSchema = z.object({
  data: z
    .string()
    .min(1, "Calldata is required")
    .regex(/^0x[0-9a-fA-F]+$/, "Must be a hex string starting with 0x"),
});

export type DecodeInput = z.infer<typeof decodeSchema>;

export const eventDecodeSchema = z.object({
  txHash: z
    .string()
    .min(1, "Transaction hash is required")
    .regex(TX_HASH, "Invalid transaction hash format"),
});

export type EventDecodeInput = z.infer<typeof eventDecodeSchema>;
