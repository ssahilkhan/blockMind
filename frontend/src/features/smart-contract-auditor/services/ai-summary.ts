import type { AuditReport, AuditAISummary } from '../types';
import { SEVERITY_LABELS, CATEGORY_LABELS } from '../types';

function buildFindingsSection(report: AuditReport): string {
  const lines: string[] = [];
  lines.push(`Total findings: ${report.summary.totalFindings}`);
  lines.push(`- Critical: ${report.summary.criticalCount}`);
  lines.push(`- High: ${report.summary.highCount}`);
  lines.push(`- Medium: ${report.summary.mediumCount}`);
  lines.push(`- Low: ${report.summary.lowCount}`);
  lines.push(`- Informational: ${report.summary.informationalCount}`);
  lines.push('');

  if (report.findings.length > 0) {
    lines.push('Key findings:');
    for (const f of report.findings.filter((x) => x.severity === 'critical' || x.severity === 'high')) {
      lines.push(`- [${SEVERITY_LABELS[f.severity]}] ${f.title}: ${f.description}`);
    }
  }

  return lines.join('\n');
}

export function buildAuditSystemPrompt(): string {
  return [
    'You are an expert Solidity smart contract auditor.',
    'Analyze the provided smart contract source code and findings.',
    'Provide clear, actionable security guidance.',
    'Distinguish between informational observations and verified security issues.',
    'Never claim a contract is "100% secure".',
    'Focus on practical, developer-friendly explanations.',
    'Reference specific line numbers and code patterns when possible.',
  ].join('\n');
}

export function buildAuditPrompt(report: AuditReport): string {
  const sections: string[] = [];

  sections.push(`# Smart Contract Audit Request`);
  sections.push(`Contract: ${report.contractName}`);
  if (report.chainId) sections.push(`Chain: ${report.chainId}`);
  sections.push('');

  sections.push('## Source Code');
  sections.push('```solidity');
  sections.push(report.sourceCode.slice(0, 4000));
  sections.push('```');
  sections.push('');

  sections.push('## Static Analysis Results');
  sections.push(buildFindingsSection(report));
  sections.push('');

  if (report.gasOptimizations.length > 0) {
    sections.push('## Gas Optimization Findings');
    for (const opt of report.gasOptimizations) {
      sections.push(`- ${opt.title}: ${opt.description}`);
    }
    sections.push('');
  }

  sections.push('## Scoring');
  sections.push(`Overall: ${report.score.overall}/100 (${report.score.grade})`);
  sections.push(`Security: ${report.score.security}/100`);
  sections.push(`Gas Efficiency: ${report.score.gasEfficiency}/100`);
  sections.push(`Code Quality: ${report.score.codeQuality}/100`);
  sections.push('');

  sections.push('Please provide:');
  sections.push('1. An executive summary (2-3 paragraphs)');
  sections.push('2. A technical summary of key security concerns');
  sections.push('3. A beginner-friendly explanation');
  sections.push('4. A developer-focused explanation');
  sections.push('5. Key risks and their mitigations');

  return sections.join('\n');
}

export function parseAISummary(content: string): AuditAISummary {
  const sections = content.split(/##\s+/);
  let executiveSummary = '';
  let technicalSummary = '';
  let beginnerExplanation = '';
  let developerExplanation = '';
  const keyRisks: string[] = [];
  const mitigations: string[] = [];

  for (const section of sections) {
    const lower = section.toLowerCase();
    if (lower.startsWith('executive') || lower.startsWith('summary')) {
      executiveSummary = section.replace(/^#?[^\n]*\n/, '').trim();
    } else if (lower.startsWith('technical')) {
      technicalSummary = section.replace(/^#?[^\n]*\n/, '').trim();
    } else if (lower.startsWith('beginner') || lower.startsWith('simple')) {
      beginnerExplanation = section.replace(/^#?[^\n]*\n/, '').trim();
    } else if (lower.startsWith('developer') || lower.startsWith('advanced')) {
      developerExplanation = section.replace(/^#?[^\n]*\n/, '').trim();
    } else if (lower.startsWith('risk')) {
      const riskLines = section.split('\n').filter((l) => l.startsWith('-') || l.startsWith('*'));
      keyRisks.push(...riskLines.map((l) => l.replace(/^[-*]\s*/, '')));
    } else if (lower.startsWith('mitigation')) {
      const mitLines = section.split('\n').filter((l) => l.startsWith('-') || l.startsWith('*'));
      mitigations.push(...mitLines.map((l) => l.replace(/^[-*]\s*/, '')));
    }
  }

  if (!executiveSummary) executiveSummary = content.slice(0, 500);
  if (!technicalSummary) technicalSummary = content.slice(0, 800);
  if (!beginnerExplanation) beginnerExplanation = 'This contract has been analyzed for common security issues.';
  if (!developerExplanation) developerExplanation = 'Review the findings below for specific code-level issues.';

  return {
    executiveSummary,
    technicalSummary,
    beginnerExplanation,
    developerExplanation,
    keyRisks: keyRisks.length > 0 ? keyRisks : ['No critical risks identified'],
    mitigations: mitigations.length > 0 ? mitigations : ['Follow standard security practices'],
  };
}

export async function generateAISummary(
  report: AuditReport,
  sendMessage: (messages: Array<{ role: string; content: string }>) => Promise<{ content: string }>,
): Promise<AuditAISummary> {
  const systemPrompt = buildAuditSystemPrompt();
  const userPrompt = buildAuditPrompt(report);

  const response = await sendMessage([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  return parseAISummary(response.content);
}
