export type InsightCategory =
  | "allocation"
  | "activity"
  | "trend"
  | "risk"
  | "recommendation";

export type HealthLevel = "strong" | "moderate" | "weak" | "inactive";

export type TrendDirection = "up" | "down" | "flat";

export type TimeFrame = "daily" | "weekly" | "monthly";

export type ExportFormat = "markdown" | "json" | "csv";

export interface PortfolioMetric {
  id: string;
  label: string;
  value: string | number;
  previousValue?: string | number;
  changePercent?: number;
  unit?: string;
}

export interface AssetDistribution {
  type: "native" | "erc20" | "erc721" | "erc1155";
  label: string;
  count: number;
  percentage: number;
  value?: string;
}

export interface TokenDistribution {
  address: string;
  name: string;
  symbol: string;
  balance: string;
  percentage: number;
  standard: string;
}

export interface ActivitySummary {
  totalTransactions: number;
  activeDays: number;
  avgDailyTransactions: number;
  mostActiveDay: string;
  lastActivityTimestamp: number | null;
  uniqueContracts: number;
  uniqueTokens: number;
  inboundTransfers: number;
  outboundTransfers: number;
  totalGasUsed: string;
}

export interface PortfolioHealth {
  score: number;
  level: HealthLevel;
  diversificationScore: number;
  activityScore: number;
  riskScore: number;
  summary: string;
  factors: HealthFactor[];
}

export interface HealthFactor {
  label: string;
  value: number;
  max: number;
  impact: "positive" | "negative" | "neutral";
}

export interface PortfolioTrend {
  timeframe: TimeFrame;
  direction: TrendDirection;
  dataPoints: TrendDataPoint[];
  transferFrequency: number;
  gasSpendingTrend: TrendDirection;
  newTokensReceived: number;
  newNFTsReceived: number;
}

export interface TrendDataPoint {
  label: string;
  transactions: number;
  gasUsed: number;
  transfers: number;
  date: string;
}

export interface PortfolioRecommendation {
  id: string;
  category: "security" | "optimization" | "insight" | "action";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  action?: string;
}

export interface PortfolioInsight {
  id: string;
  category: InsightCategory;
  title: string;
  description: string;
  severity: "info" | "warning" | "alert";
  timestamp: number;
  data?: Record<string, unknown>;
}

export interface PortfolioIntelligenceReport {
  address: string;
  generatedAt: number;
  health: PortfolioHealth;
  metrics: PortfolioMetric[];
  assetDistribution: AssetDistribution[];
  tokenDistribution: TokenDistribution[];
  activitySummary: ActivitySummary;
  trends: PortfolioTrend[];
  insights: PortfolioInsight[];
  recommendations: PortfolioRecommendation[];
}

export interface ActivityHeatmapEntry {
  day: string;
  hour: number;
  count: number;
}

export const HEALTH_COLORS: Record<HealthLevel, string> = {
  strong: "text-green-600 bg-green-500/10",
  moderate: "text-yellow-600 bg-yellow-500/10",
  weak: "text-orange-600 bg-orange-500/10",
  inactive: "text-red-600 bg-red-500/10",
};

export const HEALTH_BORDER_COLORS: Record<HealthLevel, string> = {
  strong: "border-green-500/30",
  moderate: "border-yellow-500/30",
  weak: "border-orange-500/30",
  inactive: "border-red-500/30",
};

export const TREND_COLORS: Record<TrendDirection, string> = {
  up: "text-green-600",
  down: "text-red-600",
  flat: "text-muted-foreground",
};

export const CHART_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
  "#ef4444",
  "#10b981",
  "#f97316",
  "#6366f1",
];

export const PRIORITY_COLORS: Record<PortfolioRecommendation["priority"], string> = {
  high: "text-red-600 bg-red-500/10",
  medium: "text-yellow-600 bg-yellow-500/10",
  low: "text-green-600 bg-green-500/10",
};
