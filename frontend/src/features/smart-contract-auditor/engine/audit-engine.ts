import type {
  AuditReport,
  AuditFinding,
  AuditScore,
  AuditSummary,
  AuditRecommendation,
  AuditRule,
  AuditRuleContext,
  AuditConfig,
  AuditSeverity,
  AuditCategory,
  AuditMetadata,
  AuditStatus,
  GasOptimization,
  AuditAISummary,
} from '../types';
import { GRADE_THRESHOLDS, DEFAULT_AUDIT_CONFIG } from '../types';

let reportCounter = 0;

function generateReportId(): string {
  reportCounter += 1;
  return `audit-${Date.now()}-${reportCounter}`;
}

function generateFindingId(): string {
  return `finding-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function generateOptimizationId(): string {
  return `gas-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function generateRecommendationId(): string {
  return `rec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export class AuditEngine {
  private rules: AuditRule[] = [];
  private gasRules: Array<{
    id: string;
    name: string;
    check: (ctx: AuditRuleContext) => GasOptimization[];
  }> = [];

  registerRule(rule: AuditRule): void {
    this.rules.push(rule);
  }

  registerRules(rules: AuditRule[]): void {
    this.rules.push(...rules);
  }

  registerGasRule(rule: { id: string; name: string; check: (ctx: AuditRuleContext) => GasOptimization[] }): void {
    this.gasRules.push(rule);
  }

  getRules(): AuditRule[] {
    return [...this.rules];
  }

  getGasRules(): Array<{ id: string; name: string }> {
    return this.gasRules.map((r) => ({ id: r.id, name: r.name }));
  }

  createContext(
    sourceCode: string,
    contractName: string,
    abi?: unknown[],
    chainId?: number,
    compilerVersion?: string,
  ): AuditRuleContext {
    return {
      sourceCode,
      sourceCodeLower: sourceCode.toLowerCase(),
      abi,
      contractName,
      chainId,
      compilerVersion,
    };
  }

  executeRules(context: AuditRuleContext, config: AuditConfig = DEFAULT_AUDIT_CONFIG): AuditFinding[] {
    const findings: AuditFinding[] = [];
    const enabledRules = this.rules.filter(
      (r) => r.enabled && config.enabledCategories.includes(r.category),
    );

    for (const rule of enabledRules) {
      try {
        const ruleFindings = rule.analyze(context);
        findings.push(...ruleFindings);
      } catch {
        // Skip failed rules
      }
    }

    return findings;
  }

  executeGasRules(context: AuditRuleContext): GasOptimization[] {
    const optimizations: GasOptimization[] = [];

    for (const rule of this.gasRules) {
      try {
        const results = rule.check(context);
        optimizations.push(...results);
      } catch {
        // Skip failed rules
      }
    }

    return optimizations;
  }

  calculateScore(findings: AuditFinding[], gasOptimizations: GasOptimization[]): AuditScore {
    let penalty = 0;

    for (const finding of findings) {
      switch (finding.severity) {
        case 'critical': penalty += 25; break;
        case 'high': penalty += 15; break;
        case 'medium': penalty += 8; break;
        case 'low': penalty += 3; break;
        case 'informational': penalty += 1; break;
      }
    }

    for (const opt of gasOptimizations) {
      switch (opt.severity) {
        case 'high': penalty += 5; break;
        case 'medium': penalty += 3; break;
        case 'low': penalty += 1; break;
      }
    }

    const securityScore = Math.max(0, 100 - this.calculateCategoryPenalty(findings, 'security'));
    const gasScore = Math.max(0, 100 - this.calculateCategoryPenalty(findings, 'gas') - gasOptimizations.length * 2);
    const qualityScore = Math.max(0, 100 - this.calculateCategoryPenalty(findings, 'quality'));
    const documentationScore = Math.max(0, 100 - this.calculateCategoryPenalty(findings, 'documentation'));

    const overall = Math.max(0, Math.min(100, 100 - penalty));
    const grade = this.scoreToGrade(overall);

    return {
      overall,
      security: Math.min(100, securityScore),
      gasEfficiency: Math.min(100, gasScore),
      codeQuality: Math.min(100, qualityScore),
      documentation: Math.min(100, documentationScore),
      grade,
    };
  }

  private calculateCategoryPenalty(findings: AuditFinding[], area: string): number {
    let penalty = 0;
    const categoryMap: Record<string, AuditCategory[]> = {
      security: ['access-control', 'reentrancy', 'arithmetic', 'unchecked-return', 'external-calls', 'upgradeability', 'oracle-usage', 'flash-loan', 'front-running'],
      gas: ['gas-optimization'],
      quality: ['code-quality', 'best-practice'],
      documentation: ['documentation', 'event-coverage'],
    };

    const categories = categoryMap[area] ?? [];
    const relevantFindings = findings.filter((f) => categories.includes(f.category));

    for (const finding of relevantFindings) {
      switch (finding.severity) {
        case 'critical': penalty += 30; break;
        case 'high': penalty += 20; break;
        case 'medium': penalty += 10; break;
        case 'low': penalty += 3; break;
        case 'informational': penalty += 1; break;
      }
    }

    return penalty;
  }

  private scoreToGrade(score: number): AuditScore['grade'] {
    for (const threshold of GRADE_THRESHOLDS) {
      if (score >= threshold.min) return threshold.grade;
    }
    return 'F';
  }

  buildSummary(findings: AuditFinding[], gasOptimizations: GasOptimization[]): AuditSummary {
    const severityCounts: Record<AuditSeverity, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      informational: 0,
    };

    for (const finding of findings) {
      severityCounts[finding.severity]++;
    }

    const estimatedSavings = gasOptimizations.length > 0
      ? `${gasOptimizations.length} optimizations available`
      : 'No optimizations found';

    return {
      totalFindings: findings.length,
      criticalCount: severityCounts.critical,
      highCount: severityCounts.high,
      mediumCount: severityCounts.medium,
      lowCount: severityCounts.low,
      informationalCount: severityCounts.informational,
      totalGasOptimizations: gasOptimizations.length,
      estimatedGasSavings: estimatedSavings,
    };
  }

  generateRecommendations(findings: AuditFinding[], gasOptimizations: GasOptimization[]): AuditRecommendation[] {
    const recommendations: AuditRecommendation[] = [];

    const severityPriority: Record<AuditSeverity, AuditRecommendation['priority']> = {
      critical: 'critical',
      high: 'high',
      medium: 'medium',
      low: 'low',
      informational: 'low',
    };

    for (const finding of findings) {
      if (finding.severity === 'critical' || finding.severity === 'high') {
        recommendations.push({
          id: generateRecommendationId(),
          priority: severityPriority[finding.severity],
          title: finding.title,
          description: finding.recommendation,
          category: finding.category,
        });
      }
    }

    for (const opt of gasOptimizations) {
      if (opt.severity === 'high' || opt.severity === 'medium') {
        recommendations.push({
          id: generateRecommendationId(),
          priority: opt.severity === 'high' ? 'high' : 'medium',
          title: opt.title,
          description: `Gas optimization: ${opt.description}`,
          category: 'gas-optimization',
        });
      }
    }

    const seen = new Set<string>();
    return recommendations.filter((r) => {
      const key = `${r.title}:${r.category}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async runAudit(
    sourceCode: string,
    contractName: string,
    config: AuditConfig = DEFAULT_AUDIT_CONFIG,
    abi?: unknown[],
    chainId?: number,
    compilerVersion?: string,
  ): Promise<AuditReport> {
    const startedAt = new Date();
    const context = this.createContext(sourceCode, contractName, abi, chainId, compilerVersion);

    const findings = this.executeRules(context, config);
    const gasOptimizations = config.includeGasOptimization ? this.executeGasRules(context) : [];
    const score = this.calculateScore(findings, gasOptimizations);
    const summary = this.buildSummary(findings, gasOptimizations);
    const recommendations = this.generateRecommendations(findings, gasOptimizations);

    const metadata: AuditMetadata = {
      rulesExecuted: this.rules.filter((r) => r.enabled).length,
      rulesTotal: this.rules.length,
      executionTimeMs: Date.now() - startedAt.getTime(),
      chainId,
      auditorVersion: '0.16.0',
    };

    return {
      id: generateReportId(),
      contractName,
      sourceCode,
      chainId,
      compilerVersion,
      findings,
      gasOptimizations,
      score,
      summary,
      recommendations,
      status: 'completed' as AuditStatus,
      startedAt,
      completedAt: new Date(),
      metadata,
    };
  }

  resetReportCounter(): void {
    reportCounter = 0;
  }
}

export const auditEngine = new AuditEngine();
