"use client";

import { Shield, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import type { TransactionAnalysis } from "../types";
import { RiskScoreCard } from "./risk-score-card";

interface TransactionRiskCardProps {
  analysis: TransactionAnalysis;
}

export function TransactionRiskCard({ analysis }: TransactionRiskCardProps) {
  const { details } = analysis;

  const statusColor =
    details.status === "success"
      ? "text-green-600 bg-green-500/10"
      : details.status === "failed"
        ? "text-red-600 bg-red-500/10"
        : "text-yellow-600 bg-yellow-500/10";

  return (
    <div className="space-y-4">
      <RiskScoreCard
        score={analysis.score}
        title="Transaction Risk Score"
        subtitle={analysis.hash}
      />

      <div className="rounded-lg border p-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Status</span>
          <span className={`rounded-full px-2 py-0.5 font-medium ${statusColor}`}>
            {details.status}
          </span>
        </div>

        {details.from && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">From:</span>
            <code className="truncate font-mono">{details.from}</code>
            {details.to && <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />}
            {details.to && <code className="truncate font-mono">{details.to}</code>}
          </div>
        )}

        {details.value !== "0" && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Value</span>
            <span className="font-medium">{details.value} ETH</span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Events</span>
          <span>{details.eventCount}</span>
        </div>

        {details.gasAnomaly && (
          <Warning text="Gas usage is abnormally high for this transaction." />
        )}
        {details.largeTransfer && (
          <Warning text="This transaction involves a large value transfer." />
        )}
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground">Findings</h4>
        {analysis.findings.map((f) => (
          <FindingItem key={f.id} finding={f} />
        ))}
      </div>
    </div>
  );
}

function Warning({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-1.5 rounded-md bg-yellow-500/10 p-2 text-xs text-yellow-600">
      <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
      {text}
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
