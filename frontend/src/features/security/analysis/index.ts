import { walletApi } from "@/services/wallet";
import { contractApi } from "@/services/contract";
import { transactionApi } from "@/services/transaction";
import { tokenApi } from "@/services/token";
import { eventsApi } from "@/services/events";
import { analyzeWallet, type WalletData } from "./wallet";
import { analyzeContract, type ContractData } from "./contract";
import { analyzeTransaction, type TransactionData } from "./transaction";
import { analyzeToken, type TokenData } from "./token";
import { generateRecommendations } from "./recommendations";
import type { WalletAnalysis, ContractAnalysis, TransactionAnalysis, TokenAnalysis, AnalysisResult, AnalysisType } from "../types";

export async function analyzeWalletAddress(address: string): Promise<WalletAnalysis> {
  let balance = "0";
  let tokenCount = 0;
  let transactionCount = 0;

  try {
    const details = await walletApi.getDetails(address);
    balance = String(details.balance ?? "0");
    transactionCount = details.transactionCount ?? 0;
  } catch {
    // Use defaults
  }

  const walletData: WalletData = {
    address,
    balance,
    tokenCount,
    nftCount: 0,
    transactionCount,
    contractInteractions: Math.floor(transactionCount * 0.6),
    approvals: [],
    recentTransfers: [],
    inactiveDays: 0,
  };

  const score = analyzeWallet(walletData);
  const recommendations = generateRecommendations(score.findings, "wallet");

  return {
    address,
    score,
    summary: {
      tokenCount: walletData.tokenCount,
      nftCount: walletData.nftCount,
      transactionCount: walletData.transactionCount,
      contractInteractions: walletData.contractInteractions,
    },
    findings: score.findings,
    recommendations,
  };
}

export async function analyzeContractAddress(address: string): Promise<ContractAnalysis> {
  const contractData: ContractData = {
    address,
    solidityVersion: null,
    owner: null,
    isUpgradeable: false,
    isProxy: false,
    hasPause: false,
    hasMint: false,
    hasBurn: false,
    hasAccessControl: false,
    isVerified: false,
    bytecodeLength: 0,
  };

  try {
    const abiResult = await contractApi.validateAbi([]);
    contractData.isVerified = abiResult.valid;
  } catch {
    // Default to unverified
  }

  try {
    const events = await eventsApi.searchEvents({ contract: address });
    const eventNames = (events as unknown as Array<{ event: string }>).map((e) => e.event);
    contractData.hasMint = eventNames.some((n) => n.toLowerCase().includes("mint"));
    contractData.hasBurn = eventNames.some((n) => n.toLowerCase().includes("burn"));
    contractData.hasPause = eventNames.some((n) => n.toLowerCase().includes("pause"));
  } catch {
    // Use defaults
  }

  const score = analyzeContract(contractData);
  const recommendations = generateRecommendations(score.findings, "contract");

  return {
    address,
    score,
    features: {
      solidityVersion: contractData.solidityVersion,
      owner: contractData.owner,
      isUpgradeable: contractData.isUpgradeable,
      isProxy: contractData.isProxy,
      hasPause: contractData.hasPause,
      hasMint: contractData.hasMint,
      hasBurn: contractData.hasBurn,
      hasAccessControl: contractData.hasAccessControl,
      isVerified: contractData.isVerified,
    },
    findings: score.findings,
    recommendations,
  };
}

export async function analyzeTransactionHash(hash: string): Promise<TransactionAnalysis> {
  let status: "success" | "failed" | "pending" = "pending";
  let from = "";
  let to: string | null = null;
  let value = "0";
  let gasUsed = "0";
  let gasPrice = "0";

  try {
    const trackResult = await transactionApi.track(hash);
    status = trackResult.status === "confirmed" ? "success" : trackResult.status === "failed" ? "failed" : "pending";
    from = trackResult.receipt?.from ?? "";
    to = trackResult.receipt?.to ?? null;
    gasUsed = trackResult.receipt?.gasUsed ?? "0";
    gasPrice = trackResult.receipt?.gasPrice ?? "0";
  } catch {
    // Use defaults
  }

  const txData: TransactionData = {
    hash,
    status,
    from,
    to,
    value,
    gasUsed,
    gasPrice,
    isContractVerified: false,
    eventCount: 0,
    averageGasPrice: "20000000000",
  };

  try {
    const events = await eventsApi.getReceiptEvents(hash);
    txData.eventCount = (events as unknown as unknown[]).length;
  } catch {
    // Use default
  }

  const score = analyzeTransaction(txData);
  const recommendations = generateRecommendations(score.findings, "transaction");

  return {
    hash,
    score,
    details: {
      status: txData.status,
      isContractVerified: txData.isContractVerified,
      gasAnomaly: false,
      largeTransfer: parseFloat(txData.value) > 100,
      eventCount: txData.eventCount,
      from: txData.from,
      to: txData.to,
      value: txData.value,
    },
    findings: score.findings,
    recommendations,
  };
}

export async function analyzeTokenAddress(address: string): Promise<TokenAnalysis> {
  const tokenData: TokenData = {
    address,
    standard: "unknown",
    name: null,
    symbol: null,
    totalSupply: null,
    hasMintCapability: false,
    hasApprovalRisks: false,
    holderCount: 0,
    topHolderPercentage: 0,
    isVerified: false,
  };

  try {
    const metadata = await tokenApi.getMetadata(address);
    tokenData.name = metadata.name ?? null;
    tokenData.symbol = metadata.symbol ?? null;
    tokenData.totalSupply = metadata.totalSupply ?? null;
  } catch {
    // Use defaults
  }

  try {
    const standardResult = await tokenApi.detectStandard(address);
    tokenData.standard = standardResult.standard;
    tokenData.isVerified = true;
  } catch {
    // Use defaults
  }

  const score = analyzeToken(tokenData);
  const recommendations = generateRecommendations(score.findings, "token");

  return {
    address,
    score,
    details: {
      standard: tokenData.standard,
      name: tokenData.name,
      symbol: tokenData.symbol,
      totalSupply: tokenData.totalSupply,
      hasMintCapability: tokenData.hasMintCapability,
      hasApprovalRisks: tokenData.hasApprovalRisks,
      holderWarnings: [],
    },
    findings: score.findings,
    recommendations,
  };
}

export async function runAnalysis(
  type: AnalysisType,
  target: string,
): Promise<AnalysisResult> {
  switch (type) {
    case "wallet": {
      const data = await analyzeWalletAddress(target);
      return { type: "wallet", data };
    }
    case "contract": {
      const data = await analyzeContractAddress(target);
      return { type: "contract", data };
    }
    case "transaction": {
      const data = await analyzeTransactionHash(target);
      return { type: "transaction", data };
    }
    case "token": {
      const data = await analyzeTokenAddress(target);
      return { type: "token", data };
    }
  }
}
