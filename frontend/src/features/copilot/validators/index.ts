import { z } from "zod";

export const copilotContextSchema = z.object({
  workspace: z.enum(["contract", "transaction", "wallet", "token", "event", "portfolio", "global"]),
  contractAddress: z.string().optional(),
  contractSource: z.string().optional(),
  transactionHash: z.string().optional(),
  transactionData: z
    .object({
      to: z.string().optional(),
      value: z.string().optional(),
      data: z.string().optional(),
      gasPrice: z.string().optional(),
    })
    .optional(),
  walletAddress: z.string().optional(),
  tokenAddress: z.string().optional(),
  eventName: z.string().optional(),
  blockNumber: z.number().optional(),
  chainId: z.number().optional(),
});

export const copilotSuggestionSchema = z.object({
  id: z.string(),
  workspace: z.enum(["contract", "transaction", "wallet", "token", "event", "portfolio", "global"]),
  category: z.enum(["security", "gas", "best-practice", "optimization", "documentation", "review"]),
  severity: z.enum(["info", "suggestion", "warning", "critical"]),
  title: z.string(),
  description: z.string(),
  details: z.string().optional(),
  source: z.string(),
  timestamp: z.number(),
});

export const copilotMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.number(),
  workspace: z.enum(["contract", "transaction", "wallet", "token", "event", "portfolio", "global"]).optional(),
  suggestionIds: z.array(z.string()).optional(),
});

export const copilotConversationSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  title: z.string(),
  messages: z.array(copilotMessageSchema),
  isPinned: z.boolean(),
  isBookmarked: z.boolean(),
  tags: z.array(z.string()),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const quickActionSchema = z.object({
  type: z.enum(["explain", "optimize", "review", "summarize", "document", "audit", "fix"]),
  workspace: z.enum(["contract", "transaction", "wallet", "token", "event", "portfolio", "global"]),
});
