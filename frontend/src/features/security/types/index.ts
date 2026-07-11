export type RiskLevel = "low" | "medium" | "high" | "critical";

export type AnalysisType = "wallet" | "contract" | "transaction" | "token";

export interface RiskFinding {
  id: string;
  category: string;
  severity: RiskLevel;
  title: string;
  description: string;
  explanation: string;
  recommendation: string;
}

export interface RiskScore {
  score: number;
  level: RiskLevel;
  findings: RiskFinding[];
}

export interface WalletAnalysis {
  address: string;
  score: RiskScore;
  summary: {
    tokenCount: number;
    nftCount: number;
    transactionCount: number;
    contractInteractions: number;
  };
  findings: RiskFinding[];
  recommendations: string[];
}

export interface ContractAnalysis {
  address: string;
  score: RiskScore;
  features: {
    solidityVersion: string | null;
    owner: string | null;
    isUpgradeable: boolean;
    isProxy: boolean;
    hasPause: boolean;
    hasMint: boolean;
    hasBurn: boolean;
    hasAccessControl: boolean;
    isVerified: boolean;
  };
  findings: RiskFinding[];
  recommendations: string[];
}

export interface TransactionAnalysis {
  hash: string;
  score: RiskScore;
  details: {
    status: "success" | "failed" | "pending";
    isContractVerified: boolean;
    gasAnomaly: boolean;
    largeTransfer: boolean;
    eventCount: number;
    from: string;
    to: string | null;
    value: string;
  };
  findings: RiskFinding[];
  recommendations: string[];
}

export interface TokenAnalysis {
  address: string;
  score: RiskScore;
  details: {
    standard: string;
    name: string | null;
    symbol: string | null;
    totalSupply: string | null;
    hasMintCapability: boolean;
    hasApprovalRisks: boolean;
    holderWarnings: string[];
  };
  findings: RiskFinding[];
  recommendations: string[];
}

export interface SecurityTimelineEntry {
  id: string;
  timestamp: number;
  type: AnalysisType;
  targetAddress: string;
  score: number;
  level: RiskLevel;
  summary: string;
}

export type AnalysisResult =
  | { type: "wallet"; data: WalletAnalysis }
  | { type: "contract"; data: ContractAnalysis }
  | { type: "transaction"; data: TransactionAnalysis }
  | { type: "token"; data: TokenAnalysis };

export const RISK_COLORS: Record<RiskLevel, string> = {
  low: "text-green-600 bg-green-500/10",
  medium: "text-yellow-600 bg-yellow-500/10",
  high: "text-orange-600 bg-orange-500/10",
  critical: "text-red-600 bg-red-500/10",
};

export const RISK_BORDER_COLORS: Record<RiskLevel, string> = {
  low: "border-green-500/30",
  medium: "border-yellow-500/30",
  high: "border-orange-500/30",
  critical: "border-red-500/30",
};
