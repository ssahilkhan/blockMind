import { AuditEngine } from '@/features/smart-contract-auditor/engine/audit-engine';
import { getAllSecurityRules, getAllGasRules } from '@/features/smart-contract-auditor/rules';
import { DEFAULT_AUDIT_CONFIG } from '@/features/smart-contract-auditor/types';
import type { AuditConfig } from '@/features/smart-contract-auditor/types';

describe('AuditEngine', () => {
  let engine: AuditEngine;

  beforeEach(() => {
    engine = new AuditEngine();
    engine.resetReportCounter();
  });

  const sampleContract = `
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.19;

    contract Counter {
        uint256 public count;
        address public owner;

        constructor() {
            owner = msg.sender;
        }

        function increment() public {
            count++;
        }

        function decrement() public {
            require(count > 0, "Count is zero");
            count--;
        }

        function getCount() public view returns (uint256) {
            return count;
        }
    }
  `;

  describe('registerRule', () => {
    it('should register a rule', () => {
      const rule = {
        id: 'test-rule',
        name: 'Test Rule',
        description: 'Test',
        category: 'code-quality' as const,
        severity: 'low' as const,
        enabled: true,
        analyze: () => [],
      };
      engine.registerRule(rule);
      expect(engine.getRules()).toHaveLength(1);
    });

    it('should register multiple rules', () => {
      const rules = getAllSecurityRules();
      engine.registerRules(rules);
      expect(engine.getRules()).toHaveLength(rules.length);
    });
  });

  describe('createContext', () => {
    it('should create a context from source code', () => {
      const ctx = engine.createContext(sampleContract, 'Counter');
      expect(ctx.sourceCode).toBe(sampleContract);
      expect(ctx.sourceCodeLower).toBe(sampleContract.toLowerCase());
      expect(ctx.contractName).toBe('Counter');
    });
  });

  describe('executeRules', () => {
    it('should run all enabled rules and return findings', () => {
      engine.registerRules(getAllSecurityRules());
      const ctx = engine.createContext(sampleContract, 'Counter');
      const findings = engine.executeRules(ctx, DEFAULT_AUDIT_CONFIG);
      expect(Array.isArray(findings)).toBe(true);
      expect(findings.length).toBeGreaterThan(0);
      for (const f of findings) {
        expect(f.id).toBeTruthy();
        expect(f.ruleId).toBeTruthy();
        expect(f.title).toBeTruthy();
        expect(f.severity).toBeDefined();
        expect(f.category).toBeDefined();
      }
    });

    it('should filter by enabled categories', () => {
      engine.registerRules(getAllSecurityRules());
      const ctx = engine.createContext(sampleContract, 'Counter');
      const config: AuditConfig = {
        enabledCategories: ['access-control'],
        includeGasOptimization: false,
        includeAI: false,
      };
      const findings = engine.executeRules(ctx, config);
      for (const f of findings) {
        expect(f.category).toBe('access-control');
      }
    });
  });

  describe('executeGasRules', () => {
    it('should run gas optimization rules', () => {
      const gasRules = getAllGasRules();
      for (const rule of gasRules) {
        engine.registerGasRule(rule);
      }
      const ctx = engine.createContext(sampleContract, 'Counter');
      const opts = engine.executeGasRules(ctx);
      expect(Array.isArray(opts)).toBe(true);
    });
  });

  describe('calculateScore', () => {
    it('should return a score object', () => {
      const score = engine.calculateScore([], []);
      expect(score.overall).toBe(100);
      expect(score.grade).toBe('A+');
    });

    it('should penalize critical findings', () => {
      const findings = [{
        id: '1', ruleId: 'r', title: 't', description: 'd',
        severity: 'critical' as const, category: 'access-control' as const,
        recommendation: 'r', confidence: 1, source: 'static-analysis' as const,
      }];
      const score = engine.calculateScore(findings, []);
      expect(score.overall).toBeLessThan(100);
    });

    it('should penalize gas optimizations', () => {
      const opts = [{
        id: '1', ruleId: 'r', title: 't', description: 'd',
        currentCode: 'a', suggestedCode: 'b', estimatedSavings: '100',
        severity: 'high' as const, category: 'storage' as const,
      }];
      const score = engine.calculateScore([], opts);
      expect(score.overall).toBeLessThan(100);
    });
  });

  describe('buildSummary', () => {
    it('should count severities correctly', () => {
      const findings = [
        { id: '1', ruleId: 'r', title: 't', description: 'd', severity: 'critical' as const, category: 'access-control' as const, recommendation: 'r', confidence: 1, source: 'static-analysis' as const },
        { id: '2', ruleId: 'r', title: 't', description: 'd', severity: 'high' as const, category: 'access-control' as const, recommendation: 'r', confidence: 1, source: 'static-analysis' as const },
        { id: '3', ruleId: 'r', title: 't', description: 'd', severity: 'medium' as const, category: 'access-control' as const, recommendation: 'r', confidence: 1, source: 'static-analysis' as const },
      ];
      const summary = engine.buildSummary(findings, []);
      expect(summary.totalFindings).toBe(3);
      expect(summary.criticalCount).toBe(1);
      expect(summary.highCount).toBe(1);
      expect(summary.mediumCount).toBe(1);
    });
  });

  describe('generateRecommendations', () => {
    it('should generate recommendations from critical/high findings', () => {
      const findings = [
        { id: '1', ruleId: 'r', title: 'Critical Issue', description: 'd', severity: 'critical' as const, category: 'access-control' as const, recommendation: 'Fix this', confidence: 1, source: 'static-analysis' as const },
        { id: '2', ruleId: 'r', title: 'Info Issue', description: 'd', severity: 'informational' as const, category: 'code-quality' as const, recommendation: 'Consider', confidence: 1, source: 'static-analysis' as const },
      ];
      const recs = engine.generateRecommendations(findings, []);
      expect(recs.length).toBeGreaterThanOrEqual(1);
      expect(recs[0].priority).toBe('critical');
    });
  });

  describe('runAudit', () => {
    it('should produce a complete audit report', async () => {
      engine.registerRules(getAllSecurityRules());
      const gasRules = getAllGasRules();
      for (const r of gasRules) engine.registerGasRule(r);

      const report = await engine.runAudit(sampleContract, 'Counter', DEFAULT_AUDIT_CONFIG);
      expect(report.id).toBeTruthy();
      expect(report.contractName).toBe('Counter');
      expect(report.findings).toBeDefined();
      expect(report.gasOptimizations).toBeDefined();
      expect(report.score).toBeDefined();
      expect(report.summary).toBeDefined();
      expect(report.recommendations).toBeDefined();
      expect(report.status).toBe('completed');
      expect(report.completedAt).toBeDefined();
      expect(report.metadata.auditorVersion).toBe('0.16.0');
    });
  });
});
