/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { PortfolioHealthCard } from "@/features/portfolio-intelligence/components/portfolio-health-card";
import { MetricsGrid } from "@/features/portfolio-intelligence/components/metrics-grid";
import { ActivitySummaryCard } from "@/features/portfolio-intelligence/components/activity-summary-card";
import { RecommendationsPanel } from "@/features/portfolio-intelligence/components/recommendations-panel";
import { RecentInsightsPanel } from "@/features/portfolio-intelligence/components/recent-insights-panel";
import { ExportCard } from "@/features/portfolio-intelligence/components/export-card";
import type { PortfolioHealth, PortfolioMetric, ActivitySummary, PortfolioRecommendation, PortfolioInsight, PortfolioIntelligenceReport } from "@/features/portfolio-intelligence/types";

jest.mock("recharts", () => ({
  PieChart: () => null,
  Pie: () => null,
  Cell: () => null,
  BarChart: () => null,
  Bar: () => null,
  LineChart: () => null,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockHealth: PortfolioHealth = {
  score: 75,
  level: "strong",
  diversificationScore: 80,
  activityScore: 70,
  riskScore: 75,
  summary: "Well-diversified portfolio.",
  factors: [
    { label: "Diversification", value: 80, max: 100, impact: "positive" },
    { label: "Activity", value: 70, max: 100, impact: "positive" },
    { label: "Risk", value: 75, max: 100, impact: "positive" },
  ],
};

const mockMetrics: PortfolioMetric[] = [
  { id: "m1", label: "Native Balance", value: "2.5", unit: "ETH" },
  { id: "m2", label: "Token Count", value: 5 },
];

const mockActivity: ActivitySummary = {
  totalTransactions: 100,
  activeDays: 20,
  avgDailyTransactions: 5,
  mostActiveDay: "Mon",
  lastActivityTimestamp: null,
  uniqueContracts: 10,
  uniqueTokens: 5,
  inboundTransfers: 40,
  outboundTransfers: 60,
  totalGasUsed: "1000000",
};

const mockRecommendations: PortfolioRecommendation[] = [
  {
    id: "r1",
    category: "security",
    priority: "high",
    title: "Review Approvals",
    description: "Check unused approvals.",
    action: "Use a revocation tool.",
  },
  {
    id: "r2",
    category: "optimization",
    priority: "medium",
    title: "Diversify Holdings",
    description: "Spread risk across assets.",
  },
];

const mockInsights: PortfolioInsight[] = [
  {
    id: "i1",
    category: "activity",
    title: "Health Score",
    description: "Score is 75/100.",
    severity: "info",
    timestamp: Date.now(),
  },
  {
    id: "i2",
    category: "risk",
    title: "Concentration Warning",
    description: "Single asset dominates.",
    severity: "warning",
    timestamp: Date.now(),
  },
];

const mockReport: PortfolioIntelligenceReport = {
  address: "0x" + "a".repeat(40),
  generatedAt: Date.now(),
  health: mockHealth,
  metrics: mockMetrics,
  assetDistribution: [],
  tokenDistribution: [],
  activitySummary: mockActivity,
  trends: [],
  insights: mockInsights,
  recommendations: mockRecommendations,
};

describe("PortfolioHealthCard", () => {
  it("renders score and level", () => {
    render(<PortfolioHealthCard health={mockHealth} />);
    expect(screen.getByText("75")).toBeInTheDocument();
    expect(screen.getByText("STRONG")).toBeInTheDocument();
    expect(screen.getByText("/100")).toBeInTheDocument();
  });

  it("renders factors", () => {
    render(<PortfolioHealthCard health={mockHealth} />);
    expect(screen.getByText("Diversification")).toBeInTheDocument();
    expect(screen.getByText("Activity")).toBeInTheDocument();
    expect(screen.getByText("Risk")).toBeInTheDocument();
  });

  it("renders summary", () => {
    render(<PortfolioHealthCard health={mockHealth} />);
    expect(screen.getByText("Well-diversified portfolio.")).toBeInTheDocument();
  });
});

describe("MetricsGrid", () => {
  it("renders metrics", () => {
    render(<MetricsGrid metrics={mockMetrics} />);
    expect(screen.getByText("Native Balance")).toBeInTheDocument();
    expect(screen.getByText("2.5")).toBeInTheDocument();
    expect(screen.getByText("ETH")).toBeInTheDocument();
    expect(screen.getByText("Token Count")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<MetricsGrid metrics={[]} />);
    expect(screen.getByText("No metrics available.")).toBeInTheDocument();
  });
});

describe("ActivitySummaryCard", () => {
  it("renders activity stats", () => {
    render(<ActivitySummaryCard activity={mockActivity} />);
    expect(screen.getByText("Activity Summary")).toBeInTheDocument();
    expect(screen.getByText("Total Transactions")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Unique Contracts")).toBeInTheDocument();
  });
});

describe("RecommendationsPanel", () => {
  it("renders recommendations with priority", () => {
    render(<RecommendationsPanel recommendations={mockRecommendations} />);
    expect(screen.getByText("Recommendations (2)")).toBeInTheDocument();
    expect(screen.getByText("Review Approvals")).toBeInTheDocument();
    expect(screen.getByText("Diversify Holdings")).toBeInTheDocument();
    expect(screen.getByText("HIGH")).toBeInTheDocument();
    expect(screen.getByText("MEDIUM")).toBeInTheDocument();
  });

  it("shows action text", () => {
    render(<RecommendationsPanel recommendations={mockRecommendations} />);
    expect(screen.getByText("Action: Use a revocation tool.")).toBeInTheDocument();
  });

  it("shows safe state when empty", () => {
    render(<RecommendationsPanel recommendations={[]} />);
    expect(screen.getByText(/No recommendations/)).toBeInTheDocument();
  });
});

describe("RecentInsightsPanel", () => {
  it("renders insights", () => {
    render(<RecentInsightsPanel insights={mockInsights} />);
    expect(screen.getByText("Recent Insights (2)")).toBeInTheDocument();
    expect(screen.getByText("Health Score")).toBeInTheDocument();
    expect(screen.getByText("Concentration Warning")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<RecentInsightsPanel insights={[]} />);
    expect(screen.getByText("No insights generated yet.")).toBeInTheDocument();
  });
});

describe("ExportCard", () => {
  it("renders export buttons", () => {
    render(<ExportCard report={mockReport} />);
    expect(screen.getByText("Export Report")).toBeInTheDocument();
    expect(screen.getByText("Markdown")).toBeInTheDocument();
    expect(screen.getByText("JSON")).toBeInTheDocument();
    expect(screen.getByText("CSV")).toBeInTheDocument();
  });
});
