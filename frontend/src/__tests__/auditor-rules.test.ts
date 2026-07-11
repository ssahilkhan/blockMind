import {
  ownershipDetectionRule,
  accessControlRule,
  mintCapabilityRule,
  burnCapabilityRule,
  pauseCapabilityRule,
  upgradeabilityRule,
  externalCallReviewRule,
  eventCoverageRule,
  selfdestructRule,
  txOriginRule,
  blockTimestampRule,
  ecrecoverRule,
  receiveFallbackRule,
  duplicateFunctionRule,
} from '@/features/smart-contract-auditor/rules/security-rules';
import type { AuditRuleContext } from '@/features/smart-contract-auditor/types';

function makeContext(source: string, abi?: unknown[]): AuditRuleContext {
  return {
    sourceCode: source,
    sourceCodeLower: source.toLowerCase(),
    contractName: 'Test',
    abi,
  };
}

describe('Security Rules', () => {
  describe('ownershipDetectionRule', () => {
    it('should detect missing ownership', () => {
      const findings = ownershipDetectionRule.analyze(makeContext('contract Test { uint x; }'));
      expect(findings.length).toBeGreaterThan(0);
      expect(findings[0].category).toBe('access-control');
    });

    it('should not flag when Ownable is present', () => {
      const findings = ownershipDetectionRule.analyze(makeContext('contract Test is Ownable { }'));
      expect(findings.length).toBe(0);
    });
  });

  describe('accessControlRule', () => {
    it('should detect many public functions without modifiers', () => {
      const source = `
        function a() public { }
        function b() public { }
        function c() public { }
        function d() public { }
        function e() public { }
        function f() public { }
      `;
      const findings = accessControlRule.analyze(makeContext(source));
      expect(findings.some((f) => f.ruleId === 'security-access-control')).toBe(true);
    });
  });

  describe('mintCapabilityRule', () => {
    it('should detect mint without cap', () => {
      const findings = mintCapabilityRule.analyze(makeContext('function mint() public { }'));
      expect(findings.some((f) => f.severity === 'high')).toBe(true);
    });

    it('should not flag when cap exists', () => {
      const findings = mintCapabilityRule.analyze(makeContext('uint cap; function mint() public { }'));
      expect(findings.length).toBe(0);
    });
  });

  describe('selfdestructRule', () => {
    it('should detect selfdestruct', () => {
      const findings = selfdestructRule.analyze(makeContext('selfdestruct(owner)'));
      expect(findings.length).toBeGreaterThan(0);
      expect(findings[0].severity).toBe('critical');
    });

    it('should not flag when absent', () => {
      const findings = selfdestructRule.analyze(makeContext('function foo() public { }'));
      expect(findings.length).toBe(0);
    });
  });

  describe('txOriginRule', () => {
    it('should detect tx.origin', () => {
      const findings = txOriginRule.analyze(makeContext('require(msg.sender == tx.origin)'));
      expect(findings.length).toBeGreaterThan(0);
      expect(findings[0].severity).toBe('critical');
    });
  });

  describe('blockTimestampRule', () => {
    it('should detect block.timestamp', () => {
      const findings = blockTimestampRule.analyze(makeContext('uint t = block.timestamp'));
      expect(findings.length).toBeGreaterThan(0);
    });

    it('should detect block.number', () => {
      const findings = blockTimestampRule.analyze(makeContext('uint b = block.number'));
      expect(findings.length).toBeGreaterThan(0);
    });
  });

  describe('ecrecoverRule', () => {
    it('should detect ecrecover', () => {
      const findings = ecrecoverRule.analyze(makeContext('ecrecover(hash, v, r, s)'));
      expect(findings.length).toBeGreaterThan(0);
      expect(findings[0].severity).toBe('medium');
    });
  });

  describe('externalCallReviewRule', () => {
    it('should detect external calls without reentrancy guard', () => {
      const findings = externalCallReviewRule.analyze(makeContext('target.call{value: 1}("")'));
      expect(findings.some((f) => f.category === 'reentrancy')).toBe(true);
    });

    it('should detect delegatecall', () => {
      const findings = externalCallReviewRule.analyze(makeContext('target.delegatecall(data)'));
      expect(findings.some((f) => f.title.includes('Delegatecall'))).toBe(true);
    });

    it('should detect assembly', () => {
      const findings = externalCallReviewRule.analyze(makeContext('assembly { mstore(0, 0) }'));
      expect(findings.some((f) => f.title.includes('Assembly'))).toBe(true);
    });
  });

  describe('eventCoverageRule', () => {
    it('should detect no events in contract with functions', () => {
      const source = `
        function a() public { }
        function b() public { }
        function c() public { }
      `;
      const findings = eventCoverageRule.analyze(makeContext(source));
      expect(findings.some((f) => f.title.includes('No Events'))).toBe(true);
    });
  });

  describe('pauseCapabilityRule', () => {
    it('should detect pause without unpause', () => {
      const findings = pauseCapabilityRule.analyze(makeContext('function pause() public { }'));
      expect(findings.some((f) => f.title.includes('Pause Without Unpause'))).toBe(true);
    });
  });

  describe('upgradeabilityRule', () => {
    it('should detect proxy pattern', () => {
      const findings = upgradeabilityRule.analyze(makeContext('delegatecall(data)'));
      expect(findings.some((f) => f.title.includes('Upgradeability'))).toBe(true);
    });

    it('should detect proxy without initialize', () => {
      const findings = upgradeabilityRule.analyze(makeContext('delegatecall(data)'));
      expect(findings.some((f) => f.title.includes('Initialize'))).toBe(true);
    });
  });

  describe('receiveFallbackRule', () => {
    it('should detect payable without receive', () => {
      const findings = receiveFallbackRule.analyze(makeContext('function deposit() public payable { }'));
      expect(findings.some((f) => f.title.includes('Payable Without'))).toBe(true);
    });
  });

  describe('duplicateFunctionRule', () => {
    it('should detect duplicate function names in ABI', () => {
      const abi = [
        { type: 'function', name: 'foo', inputs: [], outputs: [] },
        { type: 'function', name: 'foo', inputs: [{ name: 'x', type: 'uint256' }], outputs: [] },
      ];
      const findings = duplicateFunctionRule.analyze(makeContext('contract T {}', abi));
      expect(findings.some((f) => f.title.includes('Duplicate'))).toBe(true);
    });

    it('should not flag when no duplicates', () => {
      const abi = [
        { type: 'function', name: 'foo', inputs: [], outputs: [] },
        { type: 'function', name: 'bar', inputs: [], outputs: [] },
      ];
      const findings = duplicateFunctionRule.analyze(makeContext('contract T {}', abi));
      expect(findings.length).toBe(0);
    });
  });

  describe('burnCapabilityRule', () => {
    it('should detect burn functionality', () => {
      const findings = burnCapabilityRule.analyze(makeContext('function burn() public { }'));
      expect(findings.length).toBeGreaterThan(0);
      expect(findings[0].severity).toBe('informational');
    });
  });
});
