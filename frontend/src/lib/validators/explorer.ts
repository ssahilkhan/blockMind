import { z } from "zod";

export const searchSchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .refine(
      (val) => {
        const trimmed = val.trim();
        if (/^\d+$/.test(trimmed)) return true;
        if (/^0x[0-9a-fA-F]+$/.test(trimmed)) return true;
        return false;
      },
      "Enter a block number, block hash, or transaction hash",
    ),
});

export type SearchInput = z.infer<typeof searchSchema>;
