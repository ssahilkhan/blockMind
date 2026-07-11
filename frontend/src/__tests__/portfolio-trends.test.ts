import { generateTrends, generateHeatmapData } from "@/features/portfolio-intelligence/analysis/trends";
import { generatePortfolioRecommendations, generatePortfolioInsights } from "@/features/portfolio-intelligence/analysis/recommendations";
import { resetRecommendationCounter } from "@/features/portfolio-intelligence/analysis/recommendations";

const mockHealth = {
  score: 60,
  level: "moderate" as const,
  diversificationScore: 50,
  activityScore: 60,
  riskScore: 70,
  summary: "test portfolio",
  factors: [
    { label: "Diversification", value: 50, max: 100, impact: "neutral" as const },
    { label: "Activity", value: 60, max: 100, impact: "positive" as const },
    { label: "Risk", value: 70, max: 100, impact: "positive" as const },
  ],
};

const mockActivity = {
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

const mockDistribution = [
  { type: "native" as const, label: "ETH", count: 1, percentage: 20 },
  { type: "erc20" as const, label: "ERC-20", count: 3, percentage: 60 },
  { type: "erc721" as const, label: "NFTs", count: 1, percentage: 20 },
];

describe("Trend Engine - generateTrends", () => {
  it("returns daily, weekly, monthly trends", () => {
    const trends = generateTrends(50);
    expect(trends.length).toBe(3);
    expect(trends.map((t) => t.timeframe)).toEqual(["daily", "weekly", "monthly"]);
  });

  it("each trend has data points", () => {
    const trends = generateTrends(10);
    for (const trend of trends) {
      expect(trend.dataPoints.length).toBeGreaterThan(0);
      expect(["up", "down", "flat"]).toContain(trend.direction);
      expect(typeof trend.transferFrequency).toBe("number");
    }
  });

  it("returns zero-activity trends for zero transactions", () => {
    const trends = generateTrends(0);
    expect(trends[0].transferFrequency).toBe(0);
  });
});

describe("Trend Engine - generateHeatmapData", () => {
  it("generates 7 days x 24 hours entries", () => {
    const data = generateHeatmapData(10);
    expect(data.length).toBe(7 * 24);
  });

  it("returns zeros for no activity", () => {
    const data = generateHeatmapData(0);
    expect(data.every((d) => d.count === 0)).toBe(true);
  });
});

describe("Recommendations Engine", () => {
  beforeEach(() => {
    resetRecommendationCounter();
  });

  it("generates recommendations for low diversification", () => {
    const recs = generatePortfolioRecommendations(
      { ...mockHealth, diversificationScore: 10 },
      mockActivity,
      [{ type: "native", label: "ETH", count: 1, percentage: 100 }],
      [],
    );
    expect(recs.some((r) => r.title.includes("Diversification"))).toBe(true);
  });

  it("generates recommendations for high contract interactions", () => {
    const recs = generatePortfolioRecommendations(
      mockHealth,
      { ...mockActivity, uniqueContracts: 25 },
      [],
      [],
    );
    expect(recs.some((r) => r.title.includes("Contract"))).toBe(true);
  });

  it("generates no-transaction recommendation for zero tx", () => {
    const recs = generatePortfolioRecommendations(
      mockHealth,
      { ...mockActivity, totalTransactions: 0 },
      [],
      [],
    );
    expect(recs.some((r) => r.title.includes("No Transaction"))).toBe(true);
  });

  it("detects dominant asset", () => {
    const recs = generatePortfolioRecommendations(
      mockHealth,
      mockActivity,
      [{ type: "erc20", label: "USDC", count: 1, percentage: 80 }],
      [],
    );
    expect(recs.some((r) => r.title.includes("Dominance"))).toBe(true);
  });

  it("detects declining trend", () => {
    const recs = generatePortfolioRecommendations(
      mockHealth,
      mockActivity,
      [],
      [{
        timeframe: "daily",
        direction: "down",
        dataPoints: [
          { label: "Mon", transactions: 10, gasUsed: 50000, transfers: 5, date: "2026-01-01" },
          { label: "Tue", transactions: 2, gasUsed: 10000, transfers: 1, date: "2026-01-02" },
        ],
        transferFrequency: 5,
        gasSpendingTrend: "flat",
        newTokensReceived: 0,
        newNFTsReceived: 0,
      }],
    );
    expect(recs.some((r) => r.title.includes("Declining"))).toBe(true);
  });

  it("detects rising gas spending", () => {
    const recs = generatePortfolioRecommendations(
      mockHealth,
      mockActivity,
      [],
      [{
        timeframe: "daily",
        direction: "flat",
        dataPoints: [],
        transferFrequency: 5,
        gasSpendingTrend: "up",
        newTokensReceived: 0,
        newNFTsReceived: 0,
      }],
    );
    expect(recs.some((r) => r.title.includes("Gas"))).toBe(true);
  });

  it("detects multiple new tokens", () => {
    const recs = generatePortfolioRecommendations(
      mockHealth,
      mockActivity,
      [],
      [{
        timeframe: "daily",
        direction: "flat",
        dataPoints: [],
        transferFrequency: 5,
        gasSpendingTrend: "flat",
        newTokensReceived: 5,
        newNFTsReceived: 0,
      }],
    );
    expect(recs.some((r) => r.title.includes("New Tokens"))).toBe(true);
  });

  it("limits recommendations to 10", () => {
    const recs = generatePortfolioRecommendations(
      { ...mockHealth, diversificationScore: 5, activityScore: 5, riskScore: 5 },
      { ...mockActivity, uniqueContracts: 50, totalTransactions: 0 },
      [{ type: "erc20", label: "X", count: 1, percentage: 90 }],
      [{
        timeframe: "daily",
        direction: "down",
        dataPoints: [
          { label: "a", transactions: 10, gasUsed: 50000, transfers: 5, date: "2026-01-01" },
          { label: "b", transactions: 1, gasUsed: 10000, transfers: 0, date: "2026-01-02" },
        ],
        transferFrequency: 5,
        gasSpendingTrend: "up",
        newTokensReceived: 5,
        newNFTsReceived: 0,
      }],
    );
    expect(recs.length).toBeLessThanOrEqual(10);
  });
});

describe("Insights Engine", () => {
  it("generates portfolio health insight", () => {
    const insights = generatePortfolioInsights(mockHealth, mockActivity, mockDistribution, []);
    expect(insights.some((i) => i.title === "Portfolio Health Score")).toBe(true);
  });

  it("generates transaction activity insight", () => {
    const insights = generatePortfolioInsights(mockHealth, mockActivity, mockDistribution, []);
    expect(insights.some((i) => i.title === "Transaction Activity")).toBe(true);
  });

  it("generates largest holding insight", () => {
    const insights = generatePortfolioInsights(mockHealth, mockActivity, mockDistribution, []);
    expect(insights.some((i) => i.title === "Largest Holding")).toBe(true);
  });

  it("flags low diversification as warning", () => {
    const insights = generatePortfolioInsights(
      { ...mockHealth, diversificationScore: 10 },
      mockActivity,
      mockDistribution,
      [],
    );
    expect(insights.some((i) => i.title === "Low Diversification" && i.severity === "warning")).toBe(true);
  });
});
