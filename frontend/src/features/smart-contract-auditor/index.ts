export { AuditDashboard } from './components/audit-dashboard';
export { AuditScoreCard } from './components/audit-score-card';
export { FindingsTable } from './components/findings-table';
export { SeverityDistribution } from './components/severity-distribution';
export { RecommendationsPanel } from './components/recommendations-panel';
export { GasOptimizationPanel } from './components/gas-optimization-panel';
export { AISummaryPanel } from './components/ai-summary-panel';
export { SourceCodeInput } from './components/source-code-input';

export { auditEngine, AuditEngine } from './engine/audit-engine';

export { getAllSecurityRules, getAllGasRules, getRulesByCategory, getRulesBySeverity, getEnabledRules, getRuleById } from './rules';
export { ALL_SECURITY_RULES, ALL_GAS_RULES } from './rules';

export { buildAuditSystemPrompt, buildAuditPrompt, parseAISummary, generateAISummary } from './services/ai-summary';
export { exportAuditReport, downloadAuditReport } from './services/export';

export type {
  AuditReport,
  AuditFinding,
  AuditRule,
  AuditSeverity,
  AuditCategory,
  AuditScore,
  AuditSummary,
  AuditRecommendation,
  AuditAISummary,
  AuditMetadata,
  AuditConfig,
  AuditRuleContext,
  GasOptimization,
} from './types';

export type { AuditExportFormat } from './services/export';

export {
  SEVERITY_COLORS,
  SEVERITY_BG_COLORS,
  SEVERITY_BORDER_COLORS,
  CATEGORY_LABELS,
  SEVERITY_LABELS,
  GRADE_THRESHOLDS,
  DEFAULT_AUDIT_CONFIG,
} from './types';
