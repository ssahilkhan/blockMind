import { walletApi } from "@/services/wallet";
import { portfolioApi } from "@/services/portfolio";
import type { PortfolioSummary, PortfolioAsset } from "@/types/api";
import type {
  PortfolioMetric,
  AssetDistribution,
  TokenDistribution,
  ActivitySummary,
  PortfolioHealth,
  HealthFactor,
} from "../types";

function id(): string {
  return crypto.randomUUID();
}

function parseNumber(val: string | number | undefined): number {
  if (val === undefined || val === null) return 0;
  const n = typeof val === "number" ? val : parseFloat(val);
  return isNaN(n) ? 0 : n;
}

function calcPercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 10000) / 100;
}

export async function gatherPortfolioData(address: string): Promise<{
  summary: PortfolioSummary;
  assets: PortfolioAsset[];
  walletDetails: { balance: string; transactionCount: number; nonce: number };
}> {
  let summary: PortfolioSummary = { address, nativeBalance: "0", tokenCount: 0, nftCount: 0 };
  let assets: PortfolioAsset[] = [];
  let walletDetails = { balance: "0", transactionCount: 0, nonce: 0 };

  try {
    summary = await portfolioApi.getPortfolio(address);
  } catch {
    try {
      summary = await portfolioApi.getSummary(address);
    } catch {
      // Use defaults
    }
  }

  try {
    assets = await portfolioApi.getAssets(address);
  } catch {
    // Use empty
  }

  try {
    const details = await walletApi.getDetails(address);
    walletDetails = {
      balance: details.balance ?? "0",
      transactionCount: details.transactionCount ?? 0,
      nonce: details.nonce ?? 0,
    };
  } catch {
    // Use defaults
  }

  return { summary, assets, walletDetails };
}

export function buildMetrics(
  summary: PortfolioSummary,
  walletDetails: { balance: string; transactionCount: number; nonce: number },
): PortfolioMetric[] {
  return [
    {
      id: id(),
      label: "Native Balance",
      value: summary.nativeBalance ?? walletDetails.balance,
      unit: "ETH",
    },
    {
      id: id(),
      label: "Token Count",
      value: summary.tokenCount,
    },
    {
      id: id(),
      label: "NFT Count",
      value: summary.nftCount,
    },
    {
      id: id(),
      label: "Transactions",
      value: walletDetails.transactionCount,
    },
    {
      id: id(),
      label: "Nonce",
      value: walletDetails.nonce,
    },
  ];
}

export function buildAssetDistribution(
  assets: PortfolioAsset[],
  summary: PortfolioSummary,
): AssetDistribution[] {
  const counts: Record<string, number> = {};
  for (const asset of assets) {
    const key = asset.type;
    counts[key] = (counts[key] ?? 0) + 1;
  }

  const nativeBalance = parseNumber(summary.nativeBalance ?? "0");
  if (nativeBalance > 0 && counts["native"] === undefined) {
    counts["native"] = 1;
  }

  const totalAssets = Object.values(counts).reduce((a, b) => a + b, 0);

  const labels: Record<string, string> = {
    native: "Native ETH",
    erc20: "ERC-20 Tokens",
    erc721: "NFTs (ERC-721)",
    erc1155: "Multi-Token (ERC-1155)",
  };

  return Object.entries(counts)
    .map(([type, count]) => ({
      type: type as AssetDistribution["type"],
      label: labels[type] ?? type,
      count,
      percentage: calcPercentage(count, totalAssets),
    }))
    .sort((a, b) => b.count - a.count);
}

export function buildTokenDistribution(assets: PortfolioAsset[]): TokenDistribution[] {
  const tokens = assets.filter((a) => a.type === "erc20" || a.type === "erc721" || a.type === "erc1155");
  const totalBalance = tokens.reduce((sum, t) => sum + parseNumber(t.balance), 0);

  return tokens
    .map((token) => ({
      address: token.address ?? "",
      name: token.name,
      symbol: token.symbol,
      balance: token.balance,
      percentage: calcPercentage(parseNumber(token.balance), totalBalance),
      standard: token.type.toUpperCase(),
    }))
    .sort((a, b) => parseNumber(b.balance) - parseNumber(a.balance));
}

export function buildActivitySummary(
  walletDetails: { transactionCount: number },
  assets: PortfolioAsset[],
): ActivitySummary {
  const uniqueContracts = new Set(
    assets
      .filter((a) => a.address)
      .map((a) => a.address!.toLowerCase()),
  ).size;

  const erc20Count = assets.filter((a) => a.type === "erc20").length;
  const nftCount = assets.filter((a) => a.type === "erc721" || a.type === "erc1155").length;

  return {
    totalTransactions: walletDetails.transactionCount,
    activeDays: Math.min(walletDetails.transactionCount, 30),
    avgDailyTransactions: walletDetails.transactionCount > 0
      ? Math.round((walletDetails.transactionCount / 30) * 100) / 100
      : 0,
    mostActiveDay: "N/A",
    lastActivityTimestamp: null,
    uniqueContracts,
    uniqueTokens: erc20Count,
    inboundTransfers: 0,
    outboundTransfers: 0,
    totalGasUsed: "0",
  };
}

function computeDiversification(assets: PortfolioAsset[]): number {
  if (assets.length === 0) return 0;
  const types = new Set(assets.map((a) => a.type));
  const typeScore = Math.min(types.size * 25, 60);

  const balances = assets.map((a) => parseNumber(a.balance)).filter((b) => b > 0);
  if (balances.length === 0) return typeScore;

  const total = balances.reduce((a, b) => a + b, 0);
  if (total === 0) return typeScore;

  const proportions = balances.map((b) => b / total);
  const hhi = proportions.reduce((sum, p) => sum + p * p, 0);
  const concentrationPenalty = Math.round(hhi * 40);

  return Math.min(100, Math.max(0, typeScore + 40 - concentrationPenalty));
}

function computeActivityScore(txCount: number): number {
  if (txCount === 0) return 10;
  if (txCount < 5) return 30;
  if (txCount < 20) return 50;
  if (txCount < 100) return 70;
  if (txCount < 500) return 85;
  return 100;
}

function computeRiskScore(assets: PortfolioAsset[]): number {
  const uniqueTokens = assets.filter((a) => a.type !== "native").length;
  if (uniqueTokens > 20) return 30;
  if (uniqueTokens > 10) return 50;
  if (uniqueTokens > 5) return 70;
  return 90;
}

function healthLevelFromScore(score: number): PortfolioHealth["level"] {
  if (score >= 75) return "strong";
  if (score >= 50) return "moderate";
  if (score >= 25) return "weak";
  return "inactive";
}

export function computeHealth(
  assets: PortfolioAsset[],
  txCount: number,
): PortfolioHealth {
  const diversification = computeDiversification(assets);
  const activity = computeActivityScore(txCount);
  const risk = computeRiskScore(assets);

  const score = Math.round(diversification * 0.4 + activity * 0.35 + risk * 0.25);
  const level = healthLevelFromScore(score);

  const factors: HealthFactor[] = [
    { label: "Diversification", value: diversification, max: 100, impact: diversification >= 60 ? "positive" : diversification >= 30 ? "neutral" : "negative" },
    { label: "Activity", value: activity, max: 100, impact: activity >= 50 ? "positive" : activity >= 20 ? "neutral" : "negative" },
    { label: "Risk", value: risk, max: 100, impact: risk >= 70 ? "positive" : risk >= 40 ? "neutral" : "negative" },
  ];

  const summaryParts: string[] = [];
  if (diversification >= 60) summaryParts.push("well-diversified");
  else if (diversification >= 30) summaryParts.push("moderately diversified");
  else summaryParts.push("concentrated");

  if (activity >= 50) summaryParts.push("active");
  else if (activity >= 20) summaryParts.push("somewhat active");
  else summaryParts.push("inactive");

  const summary = `Portfolio is ${summaryParts.join(" and ")} with a health score of ${score}/100.`;

  return { score, level, diversificationScore: diversification, activityScore: activity, riskScore: risk, summary, factors };
}
