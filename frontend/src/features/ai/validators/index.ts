import { z } from "zod";

export const aiMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(10000),
  mode: z.enum(["transaction", "contract", "wallet", "token", "event"]).optional(),
});

export const conversationTitleSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").max(100),
});

export const providerConfigSchema = z.object({
  id: z.enum(["openai", "anthropic", "openrouter", "ollama"]),
  apiKey: z.string().optional(),
  baseUrl: z.string().url().optional(),
  model: z.string().optional(),
});

export const transactionHashInputSchema = z.object({
  hash: z
    .string()
    .min(66, "Transaction hash must be 66 characters (0x + 64 hex)")
    .max(66)
    .regex(/^0x[0-9a-fA-F]{64}$/, "Invalid transaction hash format"),
});

export const contractAddressInputSchema = z.object({
  address: z
    .string()
    .min(42, "Address must be 42 characters (0x + 40 hex)")
    .max(42)
    .regex(/^0x[0-9a-fA-F]{40}$/, "Invalid address format"),
});

export const walletAddressInputSchema = z.object({
  address: z
    .string()
    .min(42, "Address must be 42 characters (0x + 40 hex)")
    .max(42)
    .regex(/^0x[0-9a-fA-F]{40}$/, "Invalid address format"),
});

export type AIMessageInput = z.infer<typeof aiMessageSchema>;
export type ConversationTitleInput = z.infer<typeof conversationTitleSchema>;
export type ProviderConfigInput = z.infer<typeof providerConfigSchema>;
export type TransactionHashInput = z.infer<typeof transactionHashInputSchema>;
export type ContractAddressInput = z.infer<typeof contractAddressInputSchema>;
export type WalletAddressInput = z.infer<typeof walletAddressInputSchema>;
