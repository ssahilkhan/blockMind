"use client";

import { useState, useCallback } from "react";
import { Shield, Search, Loader2, Wallet, FileCode2, ArrowRightLeft, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WalletRiskCard } from "./wallet-risk-card";
import { ContractRiskCard } from "./contract-risk-card";
import { TransactionRiskCard } from "./transaction-risk-card";
import { RecommendationPanel } from "./recommendation-panel";
import { SecurityTimeline } from "./security-timeline";
import { runAnalysis } from "../analysis";
import type {
  AnalysisType,
  AnalysisResult,
  SecurityTimelineEntry,
  WalletAnalysis,
  ContractAnalysis,
  TransactionAnalysis,
  TokenAnalysis,
} from "../types";

const ANALYSIS_TYPES: Array<{ id: AnalysisType; label: string; icon: React.ElementType; placeholder: string }> = [
  { id: "wallet", label: "Wallet", icon: Wallet, placeholder: "0x..." },
  { id: "contract", label: "Contract", icon: FileCode2, placeholder: "0x..." },
  { id: "transaction", label: "Transaction", icon: ArrowRightLeft, placeholder: "0x..." },
  { id: "token", label: "Token", icon: Coins, placeholder: "0x..." },
];

export function SecurityDashboard() {
  const [analysisType, setAnalysisType] = useState<AnalysisType>("wallet");
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<SecurityTimelineEntry[]>([]);

  const handleAnalyze = useCallback(async () => {
    if (!target.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await runAnalysis(analysisType, target.trim());
      setResult(analysisResult);

      const entry: SecurityTimelineEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: analysisType,
        targetAddress: target.trim(),
        score: getScoreFromResult(analysisResult),
        level: getLevelFromResult(analysisResult),
        summary: getSummaryFromResult(analysisResult),
      };
      setTimeline((prev) => [entry, ...prev].slice(0, 20));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed.");
    } finally {
      setLoading(false);
    }
  }, [analysisType, target]);

  const findings = result ? getFindingsFromResult(result) : [];
  const recommendations = result ? getRecommendationsFromResult(result) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold">Security Intelligence</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {ANALYSIS_TYPES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setAnalysisType(id); setResult(null); setTarget(""); }}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              analysisType === id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Icon className="h-3 w-3" />
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder={ANALYSIS_TYPES.find((t) => t.id === analysisType)?.placeholder}
          className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAnalyze();
          }}
        />
        <Button onClick={handleAnalyze} disabled={loading || !target.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Analyze
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {result && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-4">
                {result.type === "wallet" && <WalletRiskCard analysis={result.data as WalletAnalysis} />}
                {result.type === "contract" && <ContractRiskCard analysis={result.data as ContractAnalysis} />}
                {result.type === "transaction" && <TransactionRiskCard analysis={result.data as TransactionAnalysis} />}
                {result.type === "token" && <TokenRiskDisplay analysis={result.data as TokenAnalysis} />}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <RecommendationPanel recommendations={recommendations} findings={findings} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <SecurityTimeline entries={timeline} />
    </div>
  );
}

function TokenRiskDisplay({ analysis }: { analysis: TokenAnalysis }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {analysis.score.score}/100
        </div>
        <div>
          <p className="text-sm font-semibold">Token Risk Score</p>
          <p className="text-xs text-muted-foreground">{analysis.address}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md bg-muted/50 p-2">
          <span className="text-muted-foreground">Standard: </span>
          <span className="font-medium">{analysis.details.standard}</span>
        </div>
        {analysis.details.name && (
          <div className="rounded-md bg-muted/50 p-2">
            <span className="text-muted-foreground">Name: </span>
            <span className="font-medium">{analysis.details.name}</span>
          </div>
        )}
        {analysis.details.totalSupply && (
          <div className="rounded-md bg-muted/50 p-2">
            <span className="text-muted-foreground">Supply: </span>
            <span className="font-medium">{analysis.details.totalSupply}</span>
          </div>
        )}
        {analysis.details.hasMintCapability && (
          <div className="rounded-md bg-yellow-500/10 p-2 text-yellow-600">
            Mint capability detected
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground">Findings</h4>
        {analysis.findings.map((f) => (
          <div key={f.id} className="rounded-md border p-2 space-y-0.5">
            <span className="text-xs font-medium">{f.title}</span>
            <p className="text-xs text-muted-foreground">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function getScoreFromResult(result: AnalysisResult): number {
  return result.data.score.score;
}

function getLevelFromResult(result: AnalysisResult): "low" | "medium" | "high" | "critical" {
  return result.data.score.level;
}

function getFindingsFromResult(result: AnalysisResult) {
  return result.data.findings;
}

function getRecommendationsFromResult(result: AnalysisResult) {
  return result.data.recommendations;
}

function getSummaryFromResult(result: AnalysisResult): string {
  const score = result.data.score.score;
  const level = result.data.score.level;
  const findingCount = result.data.findings.length;
  return `${result.type} analysis: score ${score}/100 (${level}), ${findingCount} finding(s)`;
}
