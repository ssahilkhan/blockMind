import type { AuditReport, AuditFinding, GasOptimization, AuditRecommendation } from '../types';
import { SEVERITY_LABELS, CATEGORY_LABELS } from '../types';
import { downloadFile } from '@/features/ai/services/export';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function buildMarkdownReport(report: AuditReport): string {
  const lines: string[] = [];

  lines.push(`# Smart Contract Audit Report`);
  lines.push('');
  lines.push(`**Contract:** ${report.contractName}`);
  if (report.contractAddress) lines.push(`**Address:** ${report.contractAddress}`);
  if (report.chainId) lines.push(`**Chain ID:** ${report.chainId}`);
  if (report.compilerVersion) lines.push(`**Compiler:** ${report.compilerVersion}`);
  lines.push(`**Date:** ${formatDate(report.startedAt)}`);
  lines.push(`**Auditor Version:** ${report.metadata.auditorVersion}`);
  lines.push('');

  lines.push('## Score');
  lines.push('');
  lines.push(`| Metric | Score |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Overall | ${report.score.overall}/100 (${report.score.grade}) |`);
  lines.push(`| Security | ${report.score.security}/100 |`);
  lines.push(`| Gas Efficiency | ${report.score.gasEfficiency}/100 |`);
  lines.push(`| Code Quality | ${report.score.codeQuality}/100 |`);
  lines.push(`| Documentation | ${report.score.documentation}/100 |`);
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Total Findings:** ${report.summary.totalFindings}`);
  lines.push(`- **Critical:** ${report.summary.criticalCount}`);
  lines.push(`- **High:** ${report.summary.highCount}`);
  lines.push(`- **Medium:** ${report.summary.mediumCount}`);
  lines.push(`- **Low:** ${report.summary.lowCount}`);
  lines.push(`- **Informational:** ${report.summary.informationalCount}`);
  lines.push(`- **Gas Optimizations:** ${report.summary.totalGasOptimizations}`);
  lines.push('');

  if (report.findings.length > 0) {
    lines.push('## Findings');
    lines.push('');
    for (const finding of report.findings) {
      lines.push(`### ${SEVERITY_LABELS[finding.severity]}: ${finding.title}`);
      lines.push('');
      lines.push(`**Category:** ${CATEGORY_LABELS[finding.category]}`);
      lines.push(`**Confidence:** ${(finding.confidence * 100).toFixed(0)}%`);
      if (finding.line) lines.push(`**Line:** ${finding.line}`);
      lines.push('');
      lines.push(finding.description);
      lines.push('');
      lines.push(`**Recommendation:** ${finding.recommendation}`);
      lines.push('');
      lines.push('---');
      lines.push('');
    }
  }

  if (report.gasOptimizations.length > 0) {
    lines.push('## Gas Optimizations');
    lines.push('');
    for (const opt of report.gasOptimizations) {
      lines.push(`### ${opt.title}`);
      lines.push('');
      lines.push(opt.description);
      lines.push('');
      lines.push('**Current:**');
      lines.push('```solidity');
      lines.push(opt.currentCode);
      lines.push('```');
      lines.push('');
      lines.push('**Suggested:**');
      lines.push('```solidity');
      lines.push(opt.suggestedCode);
      lines.push('```');
      lines.push('');
      lines.push(`*Estimated savings: ${opt.estimatedSavings}*`);
      lines.push('');
    }
  }

  if (report.recommendations.length > 0) {
    lines.push('## Recommendations');
    lines.push('');
    for (const rec of report.recommendations) {
      lines.push(`- **[${rec.priority.toUpperCase()}]** ${rec.title}: ${rec.description}`);
    }
    lines.push('');
  }

  if (report.aiSummary) {
    lines.push('## AI Analysis');
    lines.push('');
    lines.push('### Executive Summary');
    lines.push(report.aiSummary.executiveSummary);
    lines.push('');
    lines.push('### Technical Summary');
    lines.push(report.aiSummary.technicalSummary);
    lines.push('');
    lines.push('### Beginner Explanation');
    lines.push(report.aiSummary.beginnerExplanation);
    lines.push('');
    lines.push('### Developer Explanation');
    lines.push(report.aiSummary.developerExplanation);
    lines.push('');
    lines.push('### Key Risks');
    for (const risk of report.aiSummary.keyRisks) {
      lines.push(`- ${risk}`);
    }
    lines.push('');
    lines.push('### Mitigations');
    for (const mit of report.aiSummary.mitigations) {
      lines.push(`- ${mit}`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('*This report is for educational and developmental guidance purposes only.*');
  lines.push('*It does not constitute a formal security certification.*');

  return lines.join('\n');
}

function buildJSONReport(report: AuditReport): string {
  return JSON.stringify({
    version: '1.0',
    generatedAt: report.completedAt?.toISOString() ?? report.startedAt.toISOString(),
    contract: {
      name: report.contractName,
      address: report.contractAddress,
      chainId: report.chainId,
      compilerVersion: report.compilerVersion,
    },
    score: report.score,
    summary: report.summary,
    findings: report.findings.map((f) => ({
      id: f.id,
      title: f.title,
      description: f.description,
      severity: f.severity,
      category: f.category,
      recommendation: f.recommendation,
      confidence: f.confidence,
      source: f.source,
    })),
    gasOptimizations: report.gasOptimizations.map((o) => ({
      title: o.title,
      description: o.description,
      currentCode: o.currentCode,
      suggestedCode: o.suggestedCode,
      estimatedSavings: o.estimatedSavings,
    })),
    recommendations: report.recommendations,
    aiSummary: report.aiSummary,
    metadata: report.metadata,
    disclaimer: 'This report is for educational and developmental guidance purposes only. It does not constitute a formal security certification.',
  }, null, 2);
}

export type AuditExportFormat = 'markdown' | 'json';

export interface AuditExportResult {
  content: string;
  mimeType: string;
  filename: string;
}

export function exportAuditReport(report: AuditReport, format: AuditExportFormat): AuditExportResult {
  const baseName = `audit-${report.contractName}-${formatDate(report.startedAt)}`;

  switch (format) {
    case 'markdown':
      return {
        content: buildMarkdownReport(report),
        mimeType: 'text/markdown',
        filename: `${baseName}.md`,
      };
    case 'json':
      return {
        content: buildJSONReport(report),
        mimeType: 'application/json',
        filename: `${baseName}.json`,
      };
  }
}

export function downloadAuditReport(report: AuditReport, format: AuditExportFormat): void {
  const result = exportAuditReport(report, format);
  downloadFile(result.content, result.filename, result.mimeType);
}
