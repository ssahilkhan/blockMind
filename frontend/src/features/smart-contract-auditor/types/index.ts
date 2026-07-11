export type AuditSeverity = 'informational' | 'low' | 'medium' | 'high' | 'critical';

export type AuditCategory =
  | 'access-control'
  | 'reentrancy'
  | 'arithmetic'
  | 'unchecked-return'
  | 'external-calls'
  | 'gas-optimization'
  | 'code-quality'
  | 'event-coverage'
  | 'upgradeability'
  | 'oracle-usage'
  | 'flash-loan'
  | 'front-running'
  | 'documentation'
  | 'best-practice';

export type AuditStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface AuditFinding {
  id: string;
  ruleId: string;
  title: string;
  description: string;
  severity: AuditSeverity;
  category: AuditCategory;
  line?: number;
  codeSnippet?: string;
  recommendation: string;
  confidence: number;
  source: 'static-analysis' | 'ai-analysis' | 'manual';
}

export interface GasOptimization {
  id: string;
  ruleId: string;
  title: string;
  description: string;
  currentCode: string;
  suggestedCode: string;
  estimatedSavings: string;
  severity: 'low' | 'medium' | 'high';
  category: 'storage' | 'memory' | 'computation' | 'pattern';
}

export interface AuditScore {
  overall: number;
  security: number;
  gasEfficiency: number;
  codeQuality: number;
  documentation: number;
  grade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';
}

export interface AuditSummary {
  totalFindings: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  informationalCount: number;
  totalGasOptimizations: number;
  estimatedGasSavings: string;
}

export interface AuditRecommendation {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  category: AuditCategory;
}

export interface AuditReport {
  id: string;
  contractName: string;
  contractAddress?: string;
  sourceCode: string;
  chainId?: number;
  compilerVersion?: string;
  findings: AuditFinding[];
  gasOptimizations: GasOptimization[];
  score: AuditScore;
  summary: AuditSummary;
  recommendations: AuditRecommendation[];
  aiSummary?: AuditAISummary;
  status: AuditStatus;
  startedAt: Date;
  completedAt?: Date;
  metadata: AuditMetadata;
}

export interface AuditAISummary {
  executiveSummary: string;
  technicalSummary: string;
  beginnerExplanation: string;
  developerExplanation: string;
  keyRisks: string[];
  mitigations: string[];
}

export interface AuditMetadata {
  rulesExecuted: number;
  rulesTotal: number;
  executionTimeMs: number;
  chainId?: number;
  chainName?: string;
  auditorVersion: string;
}

export interface AuditRule {
  id: string;
  name: string;
  description: string;
  category: AuditCategory;
  severity: AuditSeverity;
  enabled: boolean;
  analyze: (context: AuditRuleContext) => AuditFinding[];
}

export interface AuditRuleContext {
  sourceCode: string;
  sourceCodeLower: string;
  abi?: unknown[];
  contractName: string;
  chainId?: number;
  compilerVersion?: string;
}

export interface AuditConfig {
  enabledCategories: AuditCategory[];
  includeGasOptimization: boolean;
  includeAI: boolean;
  aiProvider?: string;
  aiApiKey?: string;
}

export const SEVERITY_COLORS: Record<AuditSeverity, string> = {
  critical: 'text-red-600',
  high: 'text-orange-500',
  medium: 'text-yellow-500',
  low: 'text-blue-500',
  informational: 'text-gray-500',
};

export const SEVERITY_BG_COLORS: Record<AuditSeverity, string> = {
  critical: 'bg-red-500/10',
  high: 'bg-orange-500/10',
  medium: 'bg-yellow-500/10',
  low: 'bg-blue-500/10',
  informational: 'bg-gray-500/10',
};

export const SEVERITY_BORDER_COLORS: Record<AuditSeverity, string> = {
  critical: 'border-red-500',
  high: 'border-orange-500',
  medium: 'border-yellow-500',
  low: 'border-blue-500',
  informational: 'border-gray-500',
};

export const CATEGORY_LABELS: Record<AuditCategory, string> = {
  'access-control': 'Access Control',
  'reentrancy': 'Reentrancy',
  'arithmetic': 'Arithmetic',
  'unchecked-return': 'Unchecked Return',
  'external-calls': 'External Calls',
  'gas-optimization': 'Gas Optimization',
  'code-quality': 'Code Quality',
  'event-coverage': 'Event Coverage',
  'upgradeability': 'Upgradeability',
  'oracle-usage': 'Oracle Usage',
  'flash-loan': 'Flash Loan',
  'front-running': 'Front Running',
  'documentation': 'Documentation',
  'best-practice': 'Best Practice',
};

export const SEVERITY_LABELS: Record<AuditSeverity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  informational: 'Informational',
};

export const GRADE_THRESHOLDS: Array<{ min: number; grade: AuditScore['grade'] }> = [
  { min: 97, grade: 'A+' },
  { min: 93, grade: 'A' },
  { min: 90, grade: 'A-' },
  { min: 87, grade: 'B+' },
  { min: 83, grade: 'B' },
  { min: 80, grade: 'B-' },
  { min: 77, grade: 'C+' },
  { min: 73, grade: 'C' },
  { min: 70, grade: 'C-' },
  { min: 60, grade: 'D' },
  { min: 0, grade: 'F' },
];

export const DEFAULT_AUDIT_CONFIG: AuditConfig = {
  enabledCategories: [
    'access-control',
    'reentrancy',
    'arithmetic',
    'unchecked-return',
    'external-calls',
    'gas-optimization',
    'code-quality',
    'event-coverage',
    'upgradeability',
    'best-practice',
  ],
  includeGasOptimization: true,
  includeAI: true,
};
