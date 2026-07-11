"use client";

import { useState, useCallback } from "react";
import { Download, FileText, FileJson } from "lucide-react";
import { auditEngine } from "../engine/audit-engine";
import { getAllSecurityRules, getAllGasRules } from "../rules";
import { downloadAuditReport } from "../services/export";
import { SourceCodeInput } from "./source-code-input";
import { AuditScoreCard } from "./audit-score-card";
import { FindingsTable } from "./findings-table";
import { SeverityDistribution } from "./severity-distribution";
import { RecommendationsPanel } from "./recommendations-panel";
import { GasOptimizationPanel } from "./gas-optimization-panel";
import { AISummaryPanel } from "./ai-summary-panel";
import type { AuditReport } from "../types";

export function AuditDashboard() {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runAudit = useCallback(async (sourceCode: string, contractName: string) => {
    setIsRunning(true);
    try {
      // Register all rules
      auditEngine.resetReportCounter();
      auditEngine.registerRules(getAllSecurityRules());
      for (const gasRule of getAllGasRules()) {
        auditEngine.registerGasRule(gasRule);
      }

      const result = await auditEngine.runAudit(sourceCode, contractName);
      setReport(result);
    } catch {
      // Handle error silently
    } finally {
      setIsRunning(false);
    }
  }, []);

  return (
    <div className="space-y-6">
      <SourceCodeInput onAudit={runAudit} isRunning={isRunning} />

      {report && (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-4">
              <AuditScoreCard score={report.score} />
              <SeverityDistribution summary={report.summary} />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Findings ({report.findings.length})</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadAuditReport(report, 'markdown')}
                    className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
                  >
                    <FileText className="h-3 w-3" />
                    Markdown
                  </button>
                  <button
                    onClick={() => downloadAuditReport(report, 'json')}
                    className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
                  >
                    <FileJson className="h-3 w-3" />
                    JSON
                  </button>
                </div>
              </div>
              <FindingsTable findings={report.findings} />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <RecommendationsPanel recommendations={report.recommendations} />
            <GasOptimizationPanel optimizations={report.gasOptimizations} />
          </div>

          <AISummaryPanel aiSummary={report.aiSummary} />
        </>
      )}
    </div>
  );
}
