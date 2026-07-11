import { buildMetrics, buildAssetDistribution, buildTokenDistribution, buildActivitySummary, computeHealth } from "@/features/portfolio-intelligence/analysis/portfolio";
import type { PortfolioSummary, PortfolioAsset } from "@/types/api";

const mockAddress = "0x" + "a".repeat(40);

const mockSummary: PortfolioSummary = {
  address: mockAddress,
  nativeBalance: "2.5",
  tokenCount: 5,
  nftCount: 2,
};

const mockAssets: PortfolioAsset[] = [
  { type: "native", name: "Ether", symbol: "ETH", balance: "2.5" },
  { type: "erc20", name: "USDC", symbol: "USDC", balance: "1000", address: "0x" + "1".repeat(40) },
  { type: "erc20", name: "DAI", symbol: "DAI", balance: "500", address: "0x" + "2".repeat(40) },
  { type: "erc721", name: "CryptoPunk", symbol: "PUNK", balance: "1", address: "0x" + "3".repeat(40) },
  { type: "erc1155", name: "Sandbox", symbol: "SAND", balance: "10", address: "0x" + "4".repeat(40) },
];

const mockWalletDetails = {
  balance: "2.5",
  transactionCount: 50,
  nonce: 12,
};

describe("Portfolio Analysis - buildMetrics", () => {
  it("returns metrics from summary and wallet details", () => {
    const metrics = buildMetrics(mockSummary, mockWalletDetails);
    expect(metrics.length).toBeGreaterThanOrEqual(4);
    expect(metrics.some((m) => m.label === "Native Balance")).toBe(true);
    expect(metrics.some((m) => m.label === "Token Count")).toBe(true);
    expect(metrics.some((m) => m.label === "NFT Count")).toBe(true);
    expect(metrics.some((m) => m.label === "Transactions")).toBe(true);
  });

  it("handles empty summary", () => {
    const empty = { address: mockAddress, nativeBalance: "0", tokenCount: 0, nftCount: 0 };
    const metrics = buildMetrics(empty, { balance: "0", transactionCount: 0, nonce: 0 });
    expect(metrics.some((m) => m.label === "Native Balance" && m.value === "0")).toBe(true);
  });
});

describe("Portfolio Analysis - buildAssetDistribution", () => {
  it("distributes assets by type", () => {
    const dist = buildAssetDistribution(mockAssets, mockSummary);
    expect(dist.length).toBeGreaterThan(0);
    const native = dist.find((d) => d.type === "native");
    expect(native).toBeDefined();
    expect(native!.count).toBe(1);
  });

  it("calculates percentages", () => {
    const dist = buildAssetDistribution(mockAssets, mockSummary);
    const totalPct = dist.reduce((sum, d) => sum + d.percentage, 0);
    expect(totalPct).toBeGreaterThan(0);
  });

  it("returns empty for no assets", () => {
    const dist = buildAssetDistribution([], { address: mockAddress, nativeBalance: "0", tokenCount: 0, nftCount: 0 });
    expect(dist.length).toBe(0);
  });
});

describe("Portfolio Analysis - buildTokenDistribution", () => {
  it("returns token-only distribution", () => {
    const tokens = buildTokenDistribution(mockAssets);
    expect(tokens.length).toBe(4);
    expect(tokens.every((t) => t.standard.startsWith("ERC"))).toBe(true);
  });

  it("sorts by balance descending", () => {
    const tokens = buildTokenDistribution(mockAssets);
    for (let i = 1; i < tokens.length; i++) {
      expect(parseFloat(tokens[i - 1].balance)).toBeGreaterThanOrEqual(parseFloat(tokens[i].balance));
    }
  });
});

describe("Portfolio Analysis - buildActivitySummary", () => {
  it("builds activity from wallet details", () => {
    const activity = buildActivitySummary(mockWalletDetails, mockAssets);
    expect(activity.totalTransactions).toBe(50);
    expect(activity.uniqueContracts).toBeGreaterThan(0);
    expect(activity.uniqueTokens).toBe(2);
  });

  it("handles zero transactions", () => {
    const activity = buildActivitySummary({ transactionCount: 0 }, []);
    expect(activity.totalTransactions).toBe(0);
    expect(activity.avgDailyTransactions).toBe(0);
  });
});

describe("Portfolio Analysis - computeHealth", () => {
  it("returns healthy score for diversified portfolio", () => {
    const health = computeHealth(mockAssets, 50);
    expect(health.score).toBeGreaterThanOrEqual(0);
    expect(health.score).toBeLessThanOrEqual(100);
    expect(["strong", "moderate", "weak", "inactive"]).toContain(health.level);
    expect(health.factors.length).toBe(3);
  });

  it("returns low score for empty portfolio", () => {
    const health = computeHealth([], 0);
    expect(health.score).toBeLessThan(50);
  });

  it("diversification increases with more types", () => {
    const diverse = computeHealth(mockAssets, 10);
    const concentrated = computeHealth([mockAssets[0]], 10);
    expect(diverse.diversificationScore).toBeGreaterThanOrEqual(concentrated.diversificationScore);
  });
});
