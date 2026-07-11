"use client";

import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import type { ContractAnalysis } from "../types";
import { RiskScoreCard } from "./risk-score-card";

interface ContractRiskCardProps {
  analysis: ContractAnalysis;
}

export function ContractRiskCard({ analysis }: ContractRiskCardProps) {
  const { features } = analysis;

  return (
    <div className="space-y-4">
      <RiskScoreCard
        score={analysis.score}
        title="Contract Risk Score"
        subtitle={analysis.address}
      />

      <div className="grid grid-cols-2 gap-2">
        <FeatureBadge label="Verified" active={features.isVerified} />
        <FeatureBadge label="Upgradeable" active={features.isUpgradeable} warning />
        <FeatureBadge label="Proxy" active={features.isProxy} warning />
        <FeatureBadge label="Pausable" active={features.hasPause} />
        <FeatureBadge label="Mintable" active={features.hasMint} warning />
        <FeatureBadge label="Burnable" active={features.hasBurn} />
        <FeatureBadge label="Access Control" active={features.hasAccessControl} />
        {features.solidityVersion && (
          <div className="rounded-md bg-muted/50 px-2 py-1 text-xs">
            <span className="text-muted-foreground">Solidity: </span>
            <span className="font-mono">{features.solidityVersion}</span>
          </div>
        )}
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

function FeatureBadge({
  label,
  active,
  warning,
}: {
  label: string;
  active: boolean;
  warning?: boolean;
}) {
  if (!active) return null;
  const color = warning
    ? "bg-yellow-500/10 text-yellow-600"
    : "bg-green-500/10 text-green-600";
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${color}`}>
      {label}
    </span>
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
