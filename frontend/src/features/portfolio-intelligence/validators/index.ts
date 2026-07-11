import { z } from "zod";

export const portfolioInputSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
});

export const timeFrameSchema = z.enum(["daily", "weekly", "monthly"]);

export const exportFormatSchema = z.enum(["markdown", "json", "csv"]);

export const portfolioHealthSchema = z.object({
  score: z.number().min(0).max(100),
  level: z.enum(["strong", "moderate", "weak", "inactive"]),
  diversificationScore: z.number().min(0).max(100),
  activityScore: z.number().min(0).max(100),
  riskScore: z.number().min(0).max(100),
  summary: z.string(),
  factors: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
      max: z.number(),
      impact: z.enum(["positive", "negative", "neutral"]),
    }),
  ),
});

export const portfolioRecommendationSchema = z.object({
  id: z.string(),
  category: z.enum(["security", "optimization", "insight", "action"]),
  priority: z.enum(["high", "medium", "low"]),
  title: z.string(),
  description: z.string(),
  action: z.string().optional(),
});

export const portfolioInsightSchema = z.object({
  id: z.string(),
  category: z.enum(["allocation", "activity", "trend", "risk", "recommendation"]),
  title: z.string(),
  description: z.string(),
  severity: z.enum(["info", "warning", "alert"]),
  timestamp: z.number(),
  data: z.record(z.string(), z.unknown()).optional(),
});
