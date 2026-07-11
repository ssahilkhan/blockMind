import type { AILevel, ContextPayload } from "@/features/ai/types";
import type {
  PortfolioHealth,
  ActivitySummary,
  AssetDistribution,
  PortfolioTrend,
  PortfolioMetric,
} from "../types";

function formatMetricList(metrics: PortfolioMetric[]): string {
  return metrics
    .map((m) => `- ${m.label}: ${m.value}${m.unit ? ` ${m.unit}` : ""}`)
    .join("\n");
}

function formatDistribution(dist: AssetDistribution[]): string {
  if (dist.length === 0) return "No assets found.";
  return dist.map((d) => `- ${d.label}: ${d.count} (${d.percentage}%)`).join("\n");
}

function formatTrends(trends: PortfolioTrend[]): string {
  return trends
    .map(
      (t) =>
        `- ${t.timeframe}: ${t.direction} trend, ${t.transferFrequency} transfers, ` +
        `${t.newTokensReceived} new tokens, ${t.newNFTsReceived} new NFTs`,
    )
    .join("\n");
}

function buildPortfolioSystemPrompt(level: AILevel): string {
  const levelInstructions =
    level === "beginner"
      ? "Explain portfolio metrics in simple terms. Use analogies like a savings account or shopping cart. Avoid technical jargon."
      : "Use precise blockchain and DeFi terminology. Include gas, nonce, token standards, and on-chain metrics. Be concise and technical.";

  return (
    `You are BlockMind AI, an expert blockchain portfolio analyst. ` +
    `Your purpose is to help users understand their blockchain portfolio, activity patterns, and what actions they should consider.\n\n` +
    `${levelInstructions}\n\n` +
    `Rules:\n` +
    `- Only analyze data provided. Do not invent metrics.\n` +
    `- If data is incomplete, acknowledge it.\n` +
    `- Be concise and structured. Use bullet points.\n` +
    `- Always end with actionable insights when possible.\n`
  );
}

export function buildPortfolioSummaryPayloads(
  health: PortfolioHealth,
  metrics: PortfolioMetric[],
  distribution: AssetDistribution[],
  activity: ActivitySummary,
  trends: PortfolioTrend[],
): ContextPayload[] {
  return [
    {
      label: "Portfolio Health",
      data: `Score: ${health.score}/100 (${health.level})\n${health.summary}\nFactors:\n${health.factors.map((f) => `- ${f.label}: ${f.value}/${f.max} (${f.impact})`).join("\n")}`,
    },
    {
      label: "Portfolio Metrics",
      data: formatMetricList(metrics),
    },
    {
      label: "Asset Distribution",
      data: formatDistribution(distribution),
    },
    {
      label: "Activity Summary",
      data: [
        `Total Transactions: ${activity.totalTransactions}`,
        `Active Days: ${activity.activeDays}`,
        `Avg Daily Transactions: ${activity.avgDailyTransactions}`,
        `Unique Contracts: ${activity.uniqueContracts}`,
        `Unique Tokens: ${activity.uniqueTokens}`,
        `Inbound Transfers: ${activity.inboundTransfers}`,
        `Outbound Transfers: ${activity.outboundTransfers}`,
      ].join("\n"),
    },
    {
      label: "Trends",
      data: formatTrends(trends),
    },
  ];
}

export function buildPortfolioSummaryMessages(
  level: AILevel,
  contextPayloads: ContextPayload[],
): Array<{ role: string; content: string }> {
  const system = buildPortfolioSystemPrompt(level);
  const dataBlock =
    "\n\nHere is the portfolio data to analyze:\n\n" +
    contextPayloads.map((p) => `--- ${p.label} ---\n${p.data}`).join("\n\n");

  return [
    { role: "system", content: system },
    {
      role: "user",
      content:
        `Analyze this portfolio and provide:\n` +
        `1. A brief overall assessment\n` +
        `2. Key strengths and concerns\n` +
        `3. What changed recently\n` +
        `4. Recommended actions\n\n` +
        `${dataBlock}`,
    },
  ];
}

export { buildPortfolioSystemPrompt };
