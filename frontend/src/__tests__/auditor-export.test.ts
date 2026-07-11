import { exportAuditReport } from '@/features/smart-contract-auditor/services/export';
import type { AuditReport } from '@/features/smart-contract-auditor/types';

function makeReport(): AuditReport {
  return {
    id: 'r1', contractName: 'TestContract', sourceCode: 'pragma solidity ^0.8.19;',
    findings: [
      {
        id: 'f1', ruleId: 'r1', title: 'Critical Issue', description: 'Something bad',
        severity: 'critical', category: 'access-control', recommendation: 'Fix', confidence: 1, source: 'static-analysis',
      },
    ],
    gasOptimizations: [],
    score: { overall: 85, security: 80, gasEfficiency: 90, codeQuality: 85, documentation: 70, grade: 'B' },
    summary: {
      totalFindings: 1, criticalCount: 1, highCount: 0, mediumCount: 0,
      lowCount: 0, informationalCount: 0, totalGasOptimizations: 0, estimatedGasSavings: '0',
    },
    recommendations: [],
    status: 'completed',
    startedAt: new Date('2024-06-15'),
    metadata: { rulesExecuted: 10, rulesTotal: 10, executionTimeMs: 100, auditorVersion: '0.16.0' },
  };
}

describe('Export Service', () => {
  describe('exportAuditReport', () => {
    it('should export markdown format', () => {
      const result = exportAuditReport(makeReport(), 'markdown');
      expect(result.content).toContain('# Smart Contract Audit Report');
      expect(result.content).toContain('TestContract');
      expect(result.mimeType).toBe('text/markdown');
      expect(result.filename).toContain('TestContract');
      expect(result.filename).toContain('.md');
    });

    it('should export json format', () => {
      const result = exportAuditReport(makeReport(), 'json');
      const parsed = JSON.parse(result.content);
      expect(parsed.contract.name).toBe('TestContract');
      expect(parsed.score.overall).toBe(85);
      expect(parsed.findings).toHaveLength(1);
      expect(result.mimeType).toBe('application/json');
      expect(result.filename).toContain('.json');
    });

    it('should include findings in markdown', () => {
      const result = exportAuditReport(makeReport(), 'markdown');
      expect(result.content).toContain('Critical Issue');
      expect(result.content).toContain('Something bad');
    });

    it('should include scoring table in markdown', () => {
      const result = exportAuditReport(makeReport(), 'markdown');
      expect(result.content).toContain('| Security | 80/100 |');
      expect(result.content).toContain('| Gas Efficiency | 90/100 |');
    });

    it('should include metadata in JSON', () => {
      const result = exportAuditReport(makeReport(), 'json');
      const parsed = JSON.parse(result.content);
      expect(parsed.version).toBe('1.0');
      expect(parsed.metadata.auditorVersion).toBe('0.16.0');
      expect(parsed.disclaimer).toContain('educational');
    });

    it('should include recommendations when present', () => {
      const report = makeReport();
      report.recommendations = [
        {
          id: 'rec1', priority: 'critical', title: 'Add Access Control',
          description: 'Critical functions need checks', category: 'access-control',
        },
      ];
      const result = exportAuditReport(report, 'markdown');
      expect(result.content).toContain('Add Access Control');
    });
  });
});
