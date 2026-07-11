import { analyzeWallet, type WalletData } from "@/features/security/analysis/wallet";
import { analyzeContract, type ContractData } from "@/features/security/analysis/contract";
import { analyzeTransaction, type TransactionData } from "@/features/security/analysis/transaction";
import { analyzeToken, type TokenData } from "@/features/security/analysis/token";
import { generateRecommendations } from "@/features/security/analysis/recommendations";
import type { RiskFinding } from "@/features/security/types";

describe("Wallet Risk Analyzer", () => {
  const baseWallet: WalletData = {
    address: "0x" + "a".repeat(40),
    balance: "1.0",
    tokenCount: 5,
    nftCount: 2,
    transactionCount: 100,
    contractInteractions: 10,
    approvals: [],
    recentTransfers: [],
    inactiveDays: 0,
  };

  it("gives high score for clean wallet", () => {
    const result = analyzeWallet(baseWallet);
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.level).toBe("low");
  });

  it("penalizes unlimited approvals", () => {
    const result = analyzeWallet({
      ...baseWallet,
      approvals: [{ spender: "0x" + "b".repeat(40), amount: "115792089237316195423570985008687907853269984665640564039457584007913129639935", unlimited: true }],
    });
    expect(result.score).toBeLessThanOrEqual(80);
    expect(result.findings.some((f) => f.title.includes("Unlimited"))).toBe(true);
  });

  it("penalizes excessive approvals", () => {
    const approvals = Array.from({ length: 15 }, (_, i) => ({
      spender: "0x" + i.toString(16).padStart(40, "a"),
      amount: "100",
      unlimited: false,
    }));
    const result = analyzeWallet({ ...baseWallet, approvals });
    expect(result.findings.some((f) => f.title.includes("Excessive"))).toBe(true);
  });

  it("penalizes inactive wallets", () => {
    const result = analyzeWallet({ ...baseWallet, inactiveDays: 365 });
    expect(result.findings.some((f) => f.title.includes("Inactive"))).toBe(true);
  });

  it("handles empty wallet", () => {
    const result = analyzeWallet({
      ...baseWallet,
      balance: "0",
      transactionCount: 0,
    });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});

describe("Contract Risk Analyzer", () => {
  const baseContract: ContractData = {
    address: "0x" + "b".repeat(40),
    solidityVersion: "0.8.20",
    owner: "0x" + "c".repeat(40),
    isUpgradeable: false,
    isProxy: false,
    hasPause: false,
    hasMint: false,
    hasBurn: false,
    hasAccessControl: true,
    isVerified: true,
    bytecodeLength: 1000,
  };

  it("gives high score for safe contract", () => {
    const result = analyzeContract(baseContract);
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.level).toBe("low");
  });

  it("penalizes unverified contracts", () => {
    const result = analyzeContract({ ...baseContract, isVerified: false });
    expect(result.score).toBeLessThanOrEqual(80);
    expect(result.findings.some((f) => f.title.includes("Not Verified"))).toBe(true);
  });

  it("flags upgradeable contracts", () => {
    const result = analyzeContract({ ...baseContract, isUpgradeable: true });
    expect(result.findings.some((f) => f.title.includes("Upgradeable"))).toBe(true);
  });

  it("flags mint without access control as critical", () => {
    const result = analyzeContract({
      ...baseContract,
      hasMint: true,
      hasAccessControl: false,
    });
    expect(result.findings.some((f) => f.severity === "critical")).toBe(true);
  });

  it("flags no access control", () => {
    const result = analyzeContract({ ...baseContract, hasAccessControl: false });
    expect(result.findings.some((f) => f.title.includes("No Access Control"))).toBe(true);
  });

  it("flags old solidity versions", () => {
    const result = analyzeContract({ ...baseContract, solidityVersion: "0.4.26" });
    expect(result.findings.some((f) => f.title.includes("Outdated"))).toBe(true);
  });
});

describe("Transaction Risk Analyzer", () => {
  const baseTx: TransactionData = {
    hash: "0x" + "a".repeat(64),
    status: "success",
    from: "0x" + "b".repeat(40),
    to: "0x" + "c".repeat(40),
    value: "0.5",
    gasUsed: "21000",
    gasPrice: "20000000000",
    isContractVerified: true,
    eventCount: 2,
    averageGasPrice: "20000000000",
  };

  it("gives high score for clean tx", () => {
    const result = analyzeTransaction(baseTx);
    expect(result.score).toBeGreaterThanOrEqual(80);
  });

  it("penalizes failed transactions", () => {
    const result = analyzeTransaction({ ...baseTx, status: "failed" });
    expect(result.score).toBeLessThanOrEqual(80);
    expect(result.findings.some((f) => f.title.includes("Failed"))).toBe(true);
  });

  it("flags unverified contract interaction", () => {
    const result = analyzeTransaction({ ...baseTx, isContractVerified: false });
    expect(result.findings.some((f) => f.title.includes("Unverified"))).toBe(true);
  });

  it("flags large transfers", () => {
    const result = analyzeTransaction({ ...baseTx, value: "500" });
    expect(result.findings.some((f) => f.title.includes("Large"))).toBe(true);
  });

  it("flags high gas usage", () => {
    const result = analyzeTransaction({
      ...baseTx,
      gasUsed: "1000000",
      averageGasPrice: "21000",
    });
    expect(result.findings.some((f) => f.title.includes("Gas"))).toBe(true);
  });
});

describe("Token Risk Analyzer", () => {
  const baseToken: TokenData = {
    address: "0x" + "d".repeat(40),
    standard: "ERC20",
    name: "Test Token",
    symbol: "TST",
    totalSupply: "1000000",
    hasMintCapability: false,
    hasApprovalRisks: false,
    holderCount: 1000,
    topHolderPercentage: 15,
    isVerified: true,
  };

  it("gives high score for safe token", () => {
    const result = analyzeToken(baseToken);
    expect(result.score).toBeGreaterThanOrEqual(80);
  });

  it("penalizes unverified tokens", () => {
    const result = analyzeToken({ ...baseToken, isVerified: false });
    expect(result.score).toBeLessThanOrEqual(80);
    expect(result.findings.some((f) => f.title.includes("Not Verified"))).toBe(true);
  });

  it("flags mint capability", () => {
    const result = analyzeToken({ ...baseToken, hasMintCapability: true });
    expect(result.findings.some((f) => f.title.includes("Mint"))).toBe(true);
  });

  it("flags high concentration", () => {
    const result = analyzeToken({ ...baseToken, topHolderPercentage: 60 });
    expect(result.findings.some((f) => f.title.includes("Concentration"))).toBe(true);
  });

  it("flags low holder count", () => {
    const result = analyzeToken({ ...baseToken, holderCount: 5 });
    expect(result.findings.some((f) => f.title.includes("Low Holder"))).toBe(true);
  });
});

describe("Recommendation Engine", () => {
  const mockFindings: RiskFinding[] = [
    {
      id: "f1",
      category: "approval",
      severity: "high",
      title: "Unlimited Approvals",
      description: "test",
      explanation: "test",
      recommendation: "Revoke unlimited approvals.",
    },
    {
      id: "f2",
      category: "verification",
      severity: "medium",
      title: "Not Verified",
      description: "test",
      explanation: "test",
      recommendation: "Verify the contract.",
    },
  ];

  it("includes high/critical finding recommendations", () => {
    const recs = generateRecommendations(mockFindings, "wallet");
    expect(recs.some((r) => r.includes("Revoke unlimited"))).toBe(true);
  });

  it("adds category-based recommendations", () => {
    const recs = generateRecommendations(mockFindings, "wallet");
    expect(recs.some((r) => r.includes("approvals"))).toBe(true);
    expect(recs.some((r) => r.includes("verified"))).toBe(true);
  });

  it("adds type-specific recommendations", () => {
    const recs = generateRecommendations(mockFindings, "wallet");
    expect(recs.some((r) => r.includes("hardware wallet"))).toBe(true);
  });

  it("deduplicates recommendations", () => {
    const recs = generateRecommendations(mockFindings, "contract");
    const unique = [...new Set(recs)];
    expect(recs.length).toBe(unique.length);
  });
});
