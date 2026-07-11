import { z } from "zod";

const ETH_ADDRESS = /^0x[0-9a-fA-F]{40}$/;
const TX_HASH = /^0x[0-9a-fA-F]{64}$/;

export const eventSearchSchema = z.object({
  contract: z.string().optional(),
  event: z.string().optional(),
  txHash: z.string().optional(),
  wallet: z.string().optional(),
});

export type EventSearchInput = z.infer<typeof eventSearchSchema>;

export const blockRangeSchema = z
  .object({
    fromBlock: z
      .string()
      .min(1, "From block is required")
      .regex(/^\d+$/, "Must be a number"),
    toBlock: z
      .string()
      .min(1, "To block is required")
      .regex(/^\d+$/, "Must be a number"),
  })
  .refine(
    (data) => {
      const from = parseInt(data.fromBlock, 10);
      const to = parseInt(data.toBlock, 10);
      return to >= from;
    },
    { message: "To block must be >= From block" },
  )
  .refine(
    (data) => {
      const from = parseInt(data.fromBlock, 10);
      const to = parseInt(data.toBlock, 10);
      return to - from <= 100;
    },
    { message: "Block range cannot exceed 100 blocks" },
  );

export type BlockRangeInput = z.infer<typeof blockRangeSchema>;

export const txHashSearchSchema = z.object({
  txHash: z
    .string()
    .min(1, "Transaction hash is required")
    .regex(TX_HASH, "Invalid transaction hash format"),
});

export type TxHashSearchInput = z.infer<typeof txHashSearchSchema>;
