import { auditEngine } from '@/features/smart-contract-auditor/engine/audit-engine';
import {
  AuditDashboard,
  AuditScoreCard,
  FindingsTable,
  SeverityDistribution,
  RecommendationsPanel,
  GasOptimizationPanel,
  AISummaryPanel,
  SourceCodeInput,
  getAllSecurityRules,
  getAllGasRules,
  getRulesByCategory,
  getRulesBySeverity,
  getEnabledRules,
  getRuleById,
  buildAuditSystemPrompt,
  buildAuditPrompt,
  parseAISummary,
  exportAuditReport,
  SEVERITY_COLORS,
  SEVERITY_LABELS,
  CATEGORY_LABELS,
  GRADE_THRESHOLDS,
  DEFAULT_AUDIT_CONFIG,
} from '@/features/smart-contract-auditor';

describe('Smart Contract Auditor barrel export', () => {
  it('should export AuditDashboard', () => {
    expect(AuditDashboard).toBeDefined();
  });

  it('should export UI components', () => {
    expect(AuditScoreCard).toBeDefined();
    expect(FindingsTable).toBeDefined();
    expect(SeverityDistribution).toBeDefined();
    expect(RecommendationsPanel).toBeDefined();
    expect(GasOptimizationPanel).toBeDefined();
    expect(AISummaryPanel).toBeDefined();
    expect(SourceCodeInput).toBeDefined();
  });

  it('should export AuditEngine singleton', () => {
    expect(auditEngine).toBeDefined();
  });

  it('should export rule registry functions', () => {
    expect(typeof getAllSecurityRules).toBe('function');
    expect(typeof getAllGasRules).toBe('function');
    expect(typeof getRulesByCategory).toBe('function');
    expect(typeof getRulesBySeverity).toBe('function');
    expect(typeof getEnabledRules).toBe('function');
    expect(typeof getRuleById).toBe('function');
  });

  it('should export AI summary services', () => {
    expect(typeof buildAuditSystemPrompt).toBe('function');
    expect(typeof buildAuditPrompt).toBe('function');
    expect(typeof parseAISummary).toBe('function');
  });

  it('should export export service', () => {
    expect(typeof exportAuditReport).toBe('function');
  });

  it('should export type constants', () => {
    expect(SEVERITY_COLORS.critical).toBeTruthy();
    expect(SEVERITY_LABELS.critical).toBe('Critical');
    expect(CATEGORY_LABELS['access-control']).toBe('Access Control');
    expect(GRADE_THRESHOLDS.length).toBeGreaterThan(0);
    expect(DEFAULT_AUDIT_CONFIG.includeGasOptimization).toBe(true);
  });
});
