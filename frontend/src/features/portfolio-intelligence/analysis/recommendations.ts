import type {
  PortfolioRecommendation,
  PortfolioInsight,
  PortfolioHealth,
  ActivitySummary,
  AssetDistribution,
  PortfolioTrend,
} from "../types";

let recommendationCounter = 0;

function recId(): string {
  recommendationCounter++;
  return `rec-${recommendationCounter}`;
}

function insightId(): string {
  return `insight-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function addUnique(arr: PortfolioRecommendation[], rec: PortfolioRecommendation): void {
  if (!arr.some((r) => r.title === rec.title)) {
    arr.push(rec);
  }
}

export function generatePortfolioRecommendations(
  health: PortfolioHealth,
  activity: ActivitySummary,
  distribution: AssetDistribution[],
  trends: PortfolioTrend[],
): PortfolioRecommendation[] {
  const recs: PortfolioRecommendation[] = [];

  if (health.diversificationScore < 30) {
    addUnique(recs, {
      id: recId(),
      category: "optimization",
      priority: "high",
      title: "Improve Portfolio Diversification",
      description:
        "Your portfolio is heavily concentrated in a few assets. Consider diversifying across different token types and protocols to reduce risk.",
      action: "Explore new token categories and distribute holdings.",
    });
  }

  if (health.activityScore < 20) {
    addUnique(recs, {
      id: recId(),
      category: "insight",
      priority: "medium",
      title: "Review Inactive Assets",
      description:
        "This wallet shows low activity. Consider whether dormant assets should be moved, staked, or deployed.",
      action: "Review all holdings and consider activating unused assets.",
    });
  }

  if (activity.totalTransactions === 0) {
    addUnique(recs, {
      id: recId(),
      category: "action",
      priority: "low",
      title: "No Transaction History Detected",
      description: "This wallet has no recorded transactions. It may be newly created or unused.",
    });
  }

  if (activity.uniqueContracts > 20) {
    addUnique(recs, {
      id: recId(),
      category: "security",
      priority: "medium",
      title: "High Contract Interaction Count",
      description: `This wallet has interacted with ${activity.uniqueContracts} unique contracts. Review these for potential approval risks.`,
      action: "Audit and revoke unnecessary token approvals.",
    });
  }

  const dominantAsset = distribution.find((d) => d.percentage > 60);
  if (dominantAsset) {
    addUnique(recs, {
      id: recId(),
      category: "optimization",
      priority: "medium",
      title: `Single Asset Dominance: ${dominantAsset.label}`,
      description: `${dominantAsset.label} makes up ${dominantAsset.percentage}% of your portfolio. This concentration increases risk.`,
      action: "Consider rebalancing to reduce single-asset exposure.",
    });
  }

  const latestTrend = trends[0];
  if (latestTrend) {
    if (latestTrend.direction === "down" && latestTrend.dataPoints.length >= 2) {
      addUnique(recs, {
        id: recId(),
        category: "insight",
        priority: "medium",
        title: "Declining Activity Trend",
        description: `Activity has been trending downward over the ${latestTrend.timeframe} period. This could indicate reduced engagement.`,
      });
    }

    if (latestTrend.gasSpendingTrend === "up") {
      addUnique(recs, {
        id: recId(),
        category: "optimization",
        priority: "low",
        title: "Rising Gas Spending",
        description: "Gas usage is increasing. Consider batching transactions or timing them during low-usage periods.",
        action: "Monitor gas prices and schedule transactions off-peak.",
      });
    }

    if (latestTrend.newTokensReceived > 3) {
      addUnique(recs, {
        id: recId(),
        category: "security",
        priority: "medium",
        title: "Multiple New Tokens Received",
        description: `${latestTrend.newTokensReceived} new tokens were recently received. Verify these are legitimate.`,
        action: "Check token metadata and legitimacy before interacting.",
      });
    }
  }

  if (health.riskScore < 40) {
    addUnique(recs, {
      id: recId(),
      category: "security",
      priority: "high",
      title: "Elevated Portfolio Risk",
      description: "Portfolio risk assessment indicates elevated exposure. Review asset quality and revoke unused approvals.",
      action: "Run a full security scan on this portfolio.",
    });
  }

  return recs.slice(0, 10);
}

export function generatePortfolioInsights(
  health: PortfolioHealth,
  activity: ActivitySummary,
  distribution: AssetDistribution[],
  trends: PortfolioTrend[],
): PortfolioInsight[] {
  const insights: PortfolioInsight[] = [];

  insights.push({
    id: insightId(),
    category: "activity",
    title: "Portfolio Health Score",
    description: `Health score is ${health.score}/100 (${health.level}). ${health.summary}`,
    severity: health.score >= 70 ? "info" : health.score >= 40 ? "warning" : "alert",
    timestamp: Date.now(),
  });

  if (activity.totalTransactions > 0) {
    insights.push({
      id: insightId(),
      category: "activity",
      title: "Transaction Activity",
      description: `${activity.totalTransactions} transactions across ${activity.activeDays} active days. Average ${activity.avgDailyTransactions} tx/day.`,
      severity: "info",
      timestamp: Date.now(),
    });
  }

  if (distribution.length > 0) {
    const top = distribution[0];
    insights.push({
      id: insightId(),
      category: "allocation",
      title: "Largest Holding",
      description: `${top.label} is the largest holding at ${top.percentage}% (${top.count} items).`,
      severity: top.percentage > 60 ? "warning" : "info",
      timestamp: Date.now(),
    });
  }

  const latestTrend = trends[0];
  if (latestTrend) {
    const dirLabel = latestTrend.direction === "up" ? "increasing" : latestTrend.direction === "down" ? "decreasing" : "stable";
    insights.push({
      id: insightId(),
      category: "trend",
      title: `${latestTrend.timeframe.charAt(0).toUpperCase() + latestTrend.timeframe.slice(1)} Activity Trend`,
      description: `Activity is ${dirLabel}. ${latestTrend.transferFrequency} transfers/${latestTrend.timeframe}. Gas spending trend: ${latestTrend.gasSpendingTrend}.`,
      severity: latestTrend.direction === "down" ? "warning" : "info",
      timestamp: Date.now(),
    });
  }

  if (health.diversificationScore < 30) {
    insights.push({
      id: insightId(),
      category: "risk",
      title: "Low Diversification",
      description: "Portfolio is highly concentrated. This increases exposure to individual asset risk.",
      severity: "warning",
      timestamp: Date.now(),
    });
  }

  return insights;
}

export function resetRecommendationCounter(): void {
  recommendationCounter = 0;
}
