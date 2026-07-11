import { z } from "zod";

const ETH_ADDRESS = /^0x[0-9a-fA-F]{40}$/;
const PRIVATE_KEY = /^0x[0-9a-fA-F]{64}$/;

export const tokenAddressSchema = z.object({
  address: z
    .string()
    .min(1, "Token address is required")
    .regex(ETH_ADDRESS, "Invalid Ethereum address"),
});

export type TokenAddressInput = z.infer<typeof tokenAddressSchema>;

export const balanceLookupSchema = z.object({
  tokenAddress: z
    .string()
    .min(1, "Token address is required")
    .regex(ETH_ADDRESS, "Invalid token address"),
  walletAddress: z
    .string()
    .min(1, "Wallet address is required")
    .regex(ETH_ADDRESS, "Invalid wallet address"),
  tokenId: z.string().optional(),
});

export type BalanceLookupInput = z.infer<typeof balanceLookupSchema>;

export const tokenTransferSchema = z.object({
  to: z
    .string()
    .min(1, "Recipient is required")
    .regex(ETH_ADDRESS, "Invalid recipient address"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(/^\d+$/, "Amount must be a whole number"),
  privateKey: z
    .string()
    .min(1, "Private key is required")
    .regex(PRIVATE_KEY, "Invalid private key format"),
  tokenId: z.string().optional(),
});

export type TokenTransferInput = z.infer<typeof tokenTransferSchema>;

export const approveSchema = z.object({
  spender: z
    .string()
    .min(1, "Spender address is required")
    .regex(ETH_ADDRESS, "Invalid spender address"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(/^\d+$/, "Amount must be a whole number"),
  privateKey: z
    .string()
    .min(1, "Private key is required")
    .regex(PRIVATE_KEY, "Invalid private key format"),
});

export type ApproveInput = z.infer<typeof approveSchema>;

export const allowanceSchema = z.object({
  owner: z
    .string()
    .min(1, "Owner address is required")
    .regex(ETH_ADDRESS, "Invalid owner address"),
  spender: z
    .string()
    .min(1, "Spender address is required")
    .regex(ETH_ADDRESS, "Invalid spender address"),
});

export type AllowanceInput = z.infer<typeof allowanceSchema>;

export const nftLookupSchema = z.object({
  tokenId: z
    .string()
    .min(1, "Token ID is required")
    .regex(/^\d+$/, "Token ID must be numeric"),
});

export type NftLookupInput = z.infer<typeof nftLookupSchema>;
