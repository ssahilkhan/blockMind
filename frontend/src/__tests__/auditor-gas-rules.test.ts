import {
  repeatedStorageReadsRule,
  immutableCandidatesGasRule,
  constantCandidatesRule,
  customErrorsRule,
  eventOptimizationRule,
  uncheckedArithmeticRule,
  shortCircuitRule,
  memoryArrayRule,
  packedStorageRule,
} from '@/features/smart-contract-auditor/rules/gas-rules';
import type { AuditRuleContext } from '@/features/smart-contract-auditor/types';

function makeCtx(source: string): AuditRuleContext {
  return { sourceCode: source, sourceCodeLower: source.toLowerCase(), contractName: 'Test' };
}

describe('Gas Rules', () => {
  describe('repeatedStorageReadsRule', () => {
    it('should detect repeated storage reads', () => {
      const source = `
        private uint256 value;
        function set(uint256 x) public {
          value = x;
          uint256 a = value;
          uint256 b = value;
          uint256 c = value;
        }
      `;
      const opts = repeatedStorageReadsRule.check(makeCtx(source));
      expect(opts.some((o) => o.title.includes('value'))).toBe(true);
    });

    it('should not flag when no storage reads repeated', () => {
      const source = `uint256 private x; function get() public view returns (uint256) { return x; }`;
      const opts = repeatedStorageReadsRule.check(makeCtx(source));
      expect(opts.length).toBe(0);
    });
  });

  describe('immutableCandidatesGasRule', () => {
    it('should suggest immutable when constructor exists without immutable', () => {
      const source = `constructor() { } uint256 private val; address private owner;`;
      const opts = immutableCandidatesGasRule.check(makeCtx(source));
      expect(opts.length).toBeGreaterThan(0);
    });

    it('should not flag without constructor', () => {
      const source = `uint256 private val;`;
      const opts = immutableCandidatesGasRule.check(makeCtx(source));
      expect(opts.length).toBe(0);
    });

    it('should not flag when immutable already used', () => {
      const source = `constructor() { } uint256 private immutable val;`;
      const opts = immutableCandidatesGasRule.check(makeCtx(source));
      expect(opts.length).toBe(0);
    });
  });

  describe('constantCandidatesRule', () => {
    it('should suggest constant for fixed values', () => {
      const source = `public uint256 MAX = 1000;`;
      const opts = constantCandidatesRule.check(makeCtx(source));
      expect(opts.length).toBeGreaterThan(0);
    });

    it('should not flag when constant already used', () => {
      const source = `uint256 public constant MAX = 1000;`;
      const opts = constantCandidatesRule.check(makeCtx(source));
      expect(opts.length).toBe(0);
    });
  });

  describe('customErrorsRule', () => {
    it('should suggest custom errors when many require strings', () => {
      const source = `
        require(a > 0, "a must be positive");
        require(b > 0, "b must be positive");
        require(c > 0, "c must be positive");
        require(d > 0, "d must be positive");
      `;
      const opts = customErrorsRule.check(makeCtx(source));
      expect(opts.length).toBeGreaterThan(0);
    });

    it('should not flag when few require strings', () => {
      const source = `require(a > 0, "a must be positive"); require(b > 0, "b must be positive");`;
      const opts = customErrorsRule.check(makeCtx(source));
      expect(opts.length).toBe(0);
    });
  });

  describe('eventOptimizationRule', () => {
    it('should suggest indexed params for events with >3 params', () => {
      const source = `event Transfer(address from, address to, uint256 amount, uint256 fee);`;
      const opts = eventOptimizationRule.check(makeCtx(source));
      expect(opts.length).toBeGreaterThan(0);
    });

    it('should not flag events with <=3 params', () => {
      const source = `event Transfer(address from, address to, uint256 amount);`;
      const opts = eventOptimizationRule.check(makeCtx(source));
      expect(opts.length).toBe(0);
    });
  });

  describe('uncheckedArithmeticRule', () => {
    it('should suggest unchecked for increment loops', () => {
      const source = `for (uint i = 0; i < length; i++) { total += arr[i]; }`;
      const opts = uncheckedArithmeticRule.check(makeCtx(source));
      expect(opts.length).toBeGreaterThan(0);
    });

    it('should not flag when unchecked already used', () => {
      const source = `unchecked { i++; }`;
      const opts = uncheckedArithmeticRule.check(makeCtx(source));
      expect(opts.length).toBe(0);
    });
  });

  describe('shortCircuitRule', () => {
    it('should suggest reordering require conditions', () => {
      const source = `require(a > 0 && b > 0, "msg");`;
      const opts = shortCircuitRule.check(makeCtx(source));
      expect(opts.length).toBeGreaterThan(0);
    });

    it('should not flag simple requires', () => {
      const source = `require(cheapCheck(), "msg");`;
      const opts = shortCircuitRule.check(makeCtx(source));
      expect(opts.length).toBe(0);
    });
  });

  describe('memoryArrayRule', () => {
    it('should suggest memory arrays when storage arrays used with push', () => {
      const source = `uint256[] public values; function add(uint256 v) public { values.push(v); }`;
      const opts = memoryArrayRule.check(makeCtx(source));
      expect(opts.length).toBeGreaterThan(0);
    });

    it('should not flag without push', () => {
      const source = `uint256[] public values;`;
      const opts = memoryArrayRule.check(makeCtx(source));
      expect(opts.length).toBe(0);
    });
  });

  describe('packedStorageRule', () => {
    it('should suggest packing when many small variables', () => {
      const source = `
        uint8 public a;
        uint16 public b;
        uint32 public c;
      `;
      const opts = packedStorageRule.check(makeCtx(source));
      expect(opts.length).toBeGreaterThan(0);
    });

    it('should not flag when few small variables', () => {
      const source = `uint8 public a; uint256 public b;`;
      const opts = packedStorageRule.check(makeCtx(source));
      expect(opts.length).toBe(0);
    });
  });
});
