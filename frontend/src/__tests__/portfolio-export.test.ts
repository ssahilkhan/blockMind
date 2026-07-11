import { exportReportMarkdown, exportReportJSON, exportReportCSV } from "@/features/portfolio-intelligence/analysis/export";
import type { PortfolioIntelligenceReport } from "@/features/portfolio-intelligence/types";

const mockReport: PortfolioIntelligenceReport = {
  address: "0x" + "a".repeat(40),
  generatedAt: Date.now(),
  health: {
    score: 75,
    level: "strong",
    diversificationScore: 80,
    activityScore: 70,
    riskScore: 75,
    summary: "Well-diversified and active portfolio.",
    factors: [
      { label: "Diversification", value: 80, max: 100, impact: "positive" },
      { label: "Activity", value: 70, max: 100, impact: "positive" },
      { label: "Risk", value: 75, max: 100, impact: "positive" },
    ],
  },
  metrics: [
    { id: "m1", label: "Native Balance", value: "2.5", unit: "ETH" },
    { id: "m2", label: "Token Count", value: 5 },
    { id: "m3", label: "Transactions", value: 100 },
  ],
  assetDistribution: [
    { type: "native", label: "ETH", count: 1, percentage: 20 },
    { type: "erc20", label: "ERC-20 Tokens", count: 3, percentage: 60 },
    { type: "erc721", label: "NFTs", count: 1, percentage: 20 },
  ],
  tokenDistribution: [
    { address: "0x1", name: "USDC", symbol: "USDC", balance: "1000", percentage: 66.7, standard: "ERC20" },
    { address: "0x2", name: "DAI", symbol: "DAI", balance: "500", percentage: 33.3, standard: "ERC20" },
  ],
  activitySummary: {
    totalTransactions: 100,
    activeDays: 20,
    avgDailyTransactions: 5,
    mostActiveDay: "Mon",
    lastActivityTimestamp: Date.now(),
    uniqueContracts: 10,
    uniqueTokens: 5,
    inboundTransfers: 40,
    outboundTransfers: 60,
    totalGasUsed: "1000000",
  },
  trends: [
    {
      timeframe: "daily",
      direction: "up",
      dataPoints: [
        { label: "Mon", transactions: 5, gasUsed: 50000, transfers: 3, date: "2026-01-01" },
        { label: "Tue", transactions: 8, gasUsed: 60000, transfers: 5, date: "2026-01-02" },
      ],
      transferFrequency: 30,
      gasSpendingTrend: "flat",
      newTokensReceived: 2,
      newNFTsReceived: 1,
    },
  ],
  insights: [
    {
      id: "i1",
      category: "activity",
      title: "Portfolio Health Score",
      description: "Score 75/100",
      severity: "info",
      timestamp: Date.now(),
    },
  ],
  recommendations: [
    {
      id: "r1",
      category: "security",
      priority: "high",
      title: "Review Approvals",
      description: "Check and revoke unused approvals.",
      action: "Use a revocation tool.",
    },
  ],
};

describe("Export - exportReportMarkdown", () => {
  it("generates markdown with header", () => {
    const md = exportReportMarkdown(mockReport);
    expect(md).toContain("# Portfolio Intelligence Report");
    expect(md).toContain(mockReport.address);
  });

  it("includes health section", () => {
    const md = exportReportMarkdown(mockReport);
    expect(md).toContain("## Portfolio Health");
    expect(md).toContain("75/100");
  });

  it("includes recommendations", () => {
    const md = exportReportMarkdown(mockReport);
    expect(md).toContain("## Recommendations");
    expect(md).toContain("Review Approvals");
  });

  it("includes insights", () => {
    const md = exportReportMarkdown(mockReport);
    expect(md).toContain("## Insights");
  });
});

describe("Export - exportReportJSON", () => {
  it("generates valid JSON", () => {
    const json = exportReportJSON(mockReport);
    const parsed = JSON.parse(json);
    expect(parsed.address).toBe(mockReport.address);
    expect(parsed.health.score).toBe(75);
  });

  it("includes all report fields", () => {
    const json = exportReportJSON(mockReport);
    const parsed = JSON.parse(json);
    expect(parsed.metrics).toBeDefined();
    expect(parsed.assetDistribution).toBeDefined();
    expect(parsed.recommendations).toBeDefined();
  });
});

describe("Export - exportReportCSV", () => {
  it("generates CSV with headers", () => {
    const csv = exportReportCSV(mockReport);
    expect(csv).toContain("Section,Key,Value");
  });

  it("includes health data", () => {
    const csv = exportReportCSV(mockReport);
    expect(csv).toContain("Health,Score,75");
  });

  it("includes recommendations", () => {
    const csv = exportReportCSV(mockReport);
    expect(csv).toContain("Review Approvals");
  });
});
