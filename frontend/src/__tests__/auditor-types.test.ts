import {
  SEVERITY_COLORS,
  SEVERITY_BG_COLORS,
  SEVERITY_BORDER_COLORS,
  CATEGORY_LABELS,
  SEVERITY_LABELS,
  GRADE_THRESHOLDS,
  DEFAULT_AUDIT_CONFIG,
} from '@/features/smart-contract-auditor/types';
import type { AuditSeverity, AuditCategory } from '@/features/smart-contract-auditor/types';

describe('Audit Types', () => {
  describe('SEVERITY_COLORS', () => {
    it('should have colors for all severities', () => {
      const severities: AuditSeverity[] = ['critical', 'high', 'medium', 'low', 'informational'];
      for (const sev of severities) {
        expect(SEVERITY_COLORS[sev]).toBeTruthy();
        expect(SEVERITY_BG_COLORS[sev]).toBeTruthy();
        expect(SEVERITY_BORDER_COLORS[sev]).toBeTruthy();
      }
    });
  });

  describe('SEVERITY_LABELS', () => {
    it('should have labels for all severities', () => {
      expect(SEVERITY_LABELS.critical).toBe('Critical');
      expect(SEVERITY_LABELS.informational).toBe('Informational');
    });
  });

  describe('CATEGORY_LABELS', () => {
    it('should have labels for all categories', () => {
      const categories: AuditCategory[] = [
        'access-control', 'reentrancy', 'arithmetic', 'unchecked-return',
        'external-calls', 'gas-optimization', 'code-quality', 'event-coverage',
        'upgradeability', 'oracle-usage', 'flash-loan', 'front-running',
        'documentation', 'best-practice',
      ];
      for (const cat of categories) {
        expect(CATEGORY_LABELS[cat]).toBeTruthy();
        expect(typeof CATEGORY_LABELS[cat]).toBe('string');
      }
    });
  });

  describe('GRADE_THRESHOLDS', () => {
    it('should cover full range', () => {
      expect(GRADE_THRESHOLDS[0].grade).toBe('A+');
      expect(GRADE_THRESHOLDS[GRADE_THRESHOLDS.length - 1].grade).toBe('F');
      expect(GRADE_THRESHOLDS[GRADE_THRESHOLDS.length - 1].min).toBe(0);
    });

    it('should be in descending order', () => {
      for (let i = 1; i < GRADE_THRESHOLDS.length; i++) {
        expect(GRADE_THRESHOLDS[i].min).toBeLessThan(GRADE_THRESHOLDS[i - 1].min);
      }
    });
  });

  describe('DEFAULT_AUDIT_CONFIG', () => {
    it('should enable core categories', () => {
      expect(DEFAULT_AUDIT_CONFIG.enabledCategories).toContain('access-control');
      expect(DEFAULT_AUDIT_CONFIG.enabledCategories).toContain('reentrancy');
      expect(DEFAULT_AUDIT_CONFIG.includeGasOptimization).toBe(true);
    });
  });
});
