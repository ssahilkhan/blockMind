import {
  buildAuditSystemPrompt,
  buildAuditPrompt,
  parseAISummary,
} from '@/features/smart-contract-auditor/services/ai-summary';
import type { AuditReport } from '@/features/smart-contract-auditor/types';

function makeReport(overrides?: Partial<AuditReport>): AuditReport {
  return {
    id: 'report-1',
    contractName: 'Counter',
    sourceCode: 'pragma solidity ^0.8.19; contract Counter { uint256 public count; }',
    findings: [
      {
        id: 'f1', ruleId: 'r1', title: 'Missing access control',
        description: 'No owner checks', severity: 'critical', category: 'access-control',
        recommendation: 'Add owner', confidence: 1, source: 'static-analysis',
      },
      {
        id: 'f2', ruleId: 'r2', title: 'Unused import',
        description: 'Import not used', severity: 'informational', category: 'code-quality',
        recommendation: 'Remove', confidence: 0.8, source: 'static-analysis',
      },
    ],
    gasOptimizations: [
      {
        id: 'g1', ruleId: 'gr1', title: 'Use immutable',
        description: 'Could be immutable', currentCode: 'uint x;', suggestedCode: 'uint immutable x;',
        estimatedSavings: '~2100', severity: 'medium', category: 'storage',
      },
    ],
    score: { overall: 75, security: 70, gasEfficiency: 80, codeQuality: 85, documentation: 60, grade: 'C+' },
    summary: {
      totalFindings: 2, criticalCount: 1, highCount: 0, mediumCount: 0,
      lowCount: 0, informationalCount: 1, totalGasOptimizations: 1, estimatedGasSavings: '~2100',
    },
    recommendations: [
      {
        id: 'rec1', priority: 'critical', title: 'Add Access Control',
        description: 'Critical functions need checks', category: 'access-control',
      },
    ],
    status: 'completed',
    startedAt: new Date('2024-01-01'),
    metadata: { rulesExecuted: 10, rulesTotal: 10, executionTimeMs: 500, auditorVersion: '0.16.0' },
    ...overrides,
  };
}

describe('AI Summary Service', () => {
  describe('buildAuditSystemPrompt', () => {
    it('should return a non-empty string', () => {
      const prompt = buildAuditSystemPrompt();
      expect(prompt.length).toBeGreaterThan(0);
      expect(prompt).toContain('Solidity');
    });
  });

  describe('buildAuditPrompt', () => {
    it('should include contract name', () => {
      const report = makeReport();
      const prompt = buildAuditPrompt(report);
      expect(prompt).toContain('Counter');
    });

    it('should include source code', () => {
      const report = makeReport();
      const prompt = buildAuditPrompt(report);
      expect(prompt).toContain('pragma solidity');
    });

    it('should include findings', () => {
      const report = makeReport();
      const prompt = buildAuditPrompt(report);
      expect(prompt).toContain('Total findings: 2');
    });

    it('should include scoring', () => {
      const report = makeReport();
      const prompt = buildAuditPrompt(report);
      expect(prompt).toContain('Overall: 75/100');
    });

    it('should include gas optimizations', () => {
      const report = makeReport();
      const prompt = buildAuditPrompt(report);
      expect(prompt).toContain('Use immutable');
    });
  });

  describe('parseAISummary', () => {
    it('should parse well-structured content', () => {
      const content = `
## Executive Summary
The contract has no critical issues.

## Technical Summary
Minor code quality issues found.

## Beginner Explanation
This contract is safe.

## Developer Explanation
Review the access control patterns.

## Risks
- Reentrancy possible
- No pause mechanism

## Mitigations
- Use ReentrancyGuard
- Add pause functionality
      `;
      const summary = parseAISummary(content);
      expect(summary.executiveSummary).toContain('no critical issues');
      expect(summary.technicalSummary).toContain('Minor code quality');
      expect(summary.beginnerExplanation).toContain('safe');
      expect(summary.developerExplanation).toContain('access control');
      expect(summary.keyRisks).toContain('Reentrancy possible');
      expect(summary.mitigations).toContain('Use ReentrancyGuard');
    });

    it('should handle unstructured content', () => {
      const content = 'This is a generic analysis without sections.';
      const summary = parseAISummary(content);
      expect(summary.executiveSummary).toBeTruthy();
      expect(summary.beginnerExplanation).toBeTruthy();
    });

    it('should use default values when sections missing', () => {
      const content = '## Summary\nSome summary text here.';
      const summary = parseAISummary(content);
      expect(summary.executiveSummary).toContain('Some summary text');
      expect(summary.keyRisks.length).toBeGreaterThan(0);
    });
  });
});
