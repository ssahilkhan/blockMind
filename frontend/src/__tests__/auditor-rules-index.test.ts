import {
  getAllSecurityRules,
  getAllGasRules,
  getRulesByCategory,
  getRulesBySeverity,
  getEnabledRules,
  getRuleById,
  getGasRuleById,
} from '@/features/smart-contract-auditor/rules';

describe('Rule Registry', () => {
  describe('getAllSecurityRules', () => {
    it('should return all security rules', () => {
      const rules = getAllSecurityRules();
      expect(rules.length).toBe(17);
    });

    it('should return a copy (not original array)', () => {
      const rules1 = getAllSecurityRules();
      const rules2 = getAllSecurityRules();
      expect(rules1).not.toBe(rules2);
      expect(rules1.length).toBe(rules2.length);
    });
  });

  describe('getAllGasRules', () => {
    it('should return all gas rules', () => {
      const rules = getAllGasRules();
      expect(rules.length).toBe(9);
    });
  });

  describe('getRulesByCategory', () => {
    it('should filter by access-control', () => {
      const rules = getRulesByCategory('access-control');
      expect(rules.length).toBeGreaterThan(0);
      expect(rules.every((r) => r.category === 'access-control')).toBe(true);
    });

    it('should return empty for unmatched category', () => {
      const rules = getRulesByCategory('flash-loan');
      expect(rules.length).toBe(0);
    });
  });

  describe('getRulesBySeverity', () => {
    it('should filter by critical', () => {
      const rules = getRulesBySeverity('critical');
      expect(rules.every((r) => r.severity === 'critical')).toBe(true);
    });

    it('should filter by informational', () => {
      const rules = getRulesBySeverity('informational');
      expect(rules.every((r) => r.severity === 'informational')).toBe(true);
    });
  });

  describe('getEnabledRules', () => {
    it('should return only enabled rules', () => {
      const rules = getEnabledRules();
      expect(rules.every((r) => r.enabled)).toBe(true);
    });
  });

  describe('getRuleById', () => {
    it('should find a known rule', () => {
      const rule = getRuleById('security-ownership');
      expect(rule).toBeDefined();
      expect(rule!.id).toBe('security-ownership');
    });

    it('should return undefined for unknown id', () => {
      const rule = getRuleById('nonexistent');
      expect(rule).toBeUndefined();
    });
  });

  describe('getGasRuleById', () => {
    it('should find a known gas rule', () => {
      const rule = getGasRuleById('gas-repeated-storage');
      expect(rule).toBeDefined();
      expect(rule!.id).toBe('gas-repeated-storage');
    });

    it('should return undefined for unknown id', () => {
      const rule = getGasRuleById('nonexistent');
      expect(rule).toBeUndefined();
    });
  });
});
