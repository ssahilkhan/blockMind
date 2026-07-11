import { buildPortfolioSummaryPayloads, buildPortfolioSummaryMessages } from "@/features/portfolio-intelligence/analysis/ai-summary";
import type { PortfolioHealth, PortfolioMetric, AssetDistribution, ActivitySummary, PortfolioTrend } from "@/features/portfolio-intelligence/types";

const mockHealth: PortfolioHealth = {
  score: 75,
  level: "strong",
  diversificationScore: 80,
  activityScore: 70,
  riskScore: 75,
  summary: "Well-diversified portfolio.",
  factors: [
    { label: "Diversification", value: 80, max: 100, impact: "positive" },
  ],
};

const mockMetrics: PortfolioMetric[] = [
  { id: "m1", label: "Native Balance", value: "2.5", unit: "ETH" },
];

const mockDistribution: AssetDistribution[] = [
  { type: "native", label: "ETH", count: 1, percentage: 100 },
];

const mockActivity: ActivitySummary = {
  totalTransactions: 50,
  activeDays: 15,
  avgDailyTransactions: 3.33,
  mostActiveDay: "Mon",
  lastActivityTimestamp: null,
  uniqueContracts: 10,
  uniqueTokens: 5,
  inboundTransfers: 20,
  outboundTransfers: 30,
  totalGasUsed: "500000",
};

const mockTrends: PortfolioTrend[] = [
  {
    timeframe: "daily",
    direction: "up",
    dataPoints: [],
    transferFrequency: 10,
    gasSpendingTrend: "flat",
    newTokensReceived: 2,
    newNFTsReceived: 1,
  },
];

describe("AI Summary - buildPortfolioSummaryPayloads", () => {
  it("generates context payloads for all sections", () => {
    const payloads = buildPortfolioSummaryPayloads(mockHealth, mockMetrics, mockDistribution, mockActivity, mockTrends);
    expect(payloads.length).toBe(5);
    expect(payloads.some((p) => p.label === "Portfolio Health")).toBe(true);
    expect(payloads.some((p) => p.label === "Portfolio Metrics")).toBe(true);
    expect(payloads.some((p) => p.label === "Asset Distribution")).toBe(true);
    expect(payloads.some((p) => p.label === "Activity Summary")).toBe(true);
    expect(payloads.some((p) => p.label === "Trends")).toBe(true);
  });

  it("includes health score in payload", () => {
    const payloads = buildPortfolioSummaryPayloads(mockHealth, mockMetrics, mockDistribution, mockActivity, mockTrends);
    const healthPayload = payloads.find((p) => p.label === "Portfolio Health");
    expect(healthPayload?.data).toContain("75/100");
  });
});

describe("AI Summary - buildPortfolioSummaryMessages", () => {
  it("returns system and user messages", () => {
    const messages = buildPortfolioSummaryMessages("beginner", [
      { label: "Health", data: "Score: 75" },
    ]);
    expect(messages.length).toBe(2);
    expect(messages[0].role).toBe("system");
    expect(messages[1].role).toBe("user");
  });

  it("includes beginner instructions", () => {
    const messages = buildPortfolioSummaryMessages("beginner", []);
    expect(messages[0].content).toContain("simple terms");
  });

  it("includes developer instructions", () => {
    const messages = buildPortfolioSummaryMessages("developer", []);
    expect(messages[0].content).toContain("DeFi terminology");
  });

  it("includes data in user message", () => {
    const messages = buildPortfolioSummaryMessages("beginner", [
      { label: "Health", data: "Score: 75/100" },
    ]);
    expect(messages[1].content).toContain("Score: 75/100");
  });
});
