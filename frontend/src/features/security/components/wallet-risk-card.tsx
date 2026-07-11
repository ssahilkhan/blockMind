"use client";

import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import type { WalletAnalysis } from "../types";
import { RiskScoreCard } from "./risk-score-card";

interface WalletRiskCardProps {
  analysis: WalletAnalysis;
}

export function WalletRiskCard({ analysis }: WalletRiskCardProps) {
  return (
    <div className="space-y-4">
      <RiskScoreCard
        score={analysis.score}
        title="Wallet Risk Score"
        subtitle={analysis.address}
      />

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Tokens" value={analysis.summary.tokenCount} />
        <Stat label="NFTs" value={analysis.summary.nftCount} />
        <Stat label="Transactions" value={analysis.summary.transactionCount} />
        <Stat label="Contract Calls" value={analysis.summary.contractInteractions} />
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground">Findings</h4>
        {analysis.findings.map((f) => (
          <FindingItem key={f.id} finding={f} />
        ))}
        {analysis.findings.length === 0 && (
          <p className="text-xs text-muted-foreground">No issues found.</p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-muted/50 p-2 text-center">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function FindingItem({ finding }: { finding: { severity: string; title: string; description: string } }) {
  const icon =
    finding.severity === "critical" || finding.severity === "high" ? (
      <AlertTriangle className="h-3 w-3 text-orange-500" />
    ) : finding.severity === "medium" ? (
      <Shield className="h-3 w-3 text-yellow-500" />
    ) : (
      <CheckCircle className="h-3 w-3 text-green-500" />
    );

  return (
    <div className="rounded-md border p-2 space-y-0.5">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-xs font-medium">{finding.title}</span>
      </div>
      <p className="text-xs text-muted-foreground">{finding.description}</p>
    </div>
  );
}
