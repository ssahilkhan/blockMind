import type { GasOptimization, AuditRuleContext } from '../types';

function gid(): string {
  return `gas-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function makeOptimization(
  overrides: Partial<GasOptimization> & { title: string; description: string; currentCode: string; suggestedCode: string },
): GasOptimization {
  return {
    id: gid(),
    ruleId: 'gas-optimization',
    estimatedSavings: '~200 gas',
    severity: 'low',
    category: 'pattern',
    ...overrides,
  };
}

export const repeatedStorageReadsRule = {
  id: 'gas-repeated-storage',
  name: 'Repeated Storage Reads',
  check(ctx: AuditRuleContext): GasOptimization[] {
    const results: GasOptimization[] = [];
    const storageVars = new Map<string, number>();

    const stateVarPattern = ctx.sourceCode.match(/(?:private|internal|public)\s+\w+(?:\[\])?\s+(\w+)/g) ?? [];
    for (const decl of stateVarPattern) {
      const name = decl.split(/\s+/).pop();
      if (name) storageVars.set(name, 0);
    }

    const fnBlocks = ctx.sourceCode.match(/function\s+\w+[^{]*\{[\s\S]*?\n\s*\}/g) ?? [];
    for (const block of fnBlocks) {
      for (const [varName] of storageVars) {
        const regex = new RegExp(`\\b${varName}\\b`, 'g');
        const matches = block.match(regex) ?? [];
        if (matches.length > 2) {
          results.push(makeOptimization({
            ruleId: 'gas-repeated-storage',
            title: `Repeated Storage Read: ${varName}`,
            description: `Variable "${varName}" is read ${matches.length} times in a function. Each SLOAD costs ~2100 gas.`,
            currentCode: `// ${varName} read ${matches.length} times`,
            suggestedCode: `${varName} local = ${varName}; // cache in memory`,
            estimatedSavings: `~${(matches.length - 1) * 2100} gas per call`,
            severity: 'medium',
            category: 'storage',
          }));
        }
      }
    }

    return results;
  },
};

export const immutableCandidatesGasRule = {
  id: 'gas-immutable',
  name: 'Immutable Variable Candidates',
  check(ctx: AuditRuleContext): GasOptimization[] {
    const results: GasOptimization[] = [];
    const hasConstructor = ctx.sourceCode.includes('constructor');
    if (!hasConstructor) return results;

    const stateVars = ctx.sourceCode.match(/(?:address|uint\d*|bytes\d*|bool)\s+(?:private|internal|public)\s+(\w+)/g) ?? [];
    const hasImmutable = ctx.sourceCodeLower.includes('immutable');

    if (stateVars.length > 0 && !hasImmutable) {
      results.push(makeOptimization({
        ruleId: 'gas-immutable',
        title: 'Use Immutable for Constructor-Assigned Variables',
        description: `${stateVars.length} state variables could potentially be marked as immutable if they are only set in the constructor.`,
        currentCode: 'uint256 public someValue;',
        suggestedCode: 'uint256 public immutable someValue;',
        estimatedSavings: '~2100 gas per read (SLOAD -> IMMUTABLE)',
        severity: 'medium',
        category: 'storage',
      }));
    }

    return results;
  },
};

export const constantCandidatesRule = {
  id: 'gas-constant',
  name: 'Constant Variable Candidates',
  check(ctx: AuditRuleContext): GasOptimization[] {
    const results: GasOptimization[] = [];
    const constPattern = ctx.sourceCode.match(/(?:public|private|internal)\s+(?:uint\d*|bytes32|address|bool|string)\s+(\w+)\s*=/g) ?? [];

    const hasConstant = ctx.sourceCodeLower.includes('constant');

    if (constPattern.length > 0 && !hasConstant) {
      results.push(makeOptimization({
        ruleId: 'gas-constant',
        title: 'Use Constant for Fixed Values',
        description: `${constPattern.length} state variables are assigned at declaration and never modified. Mark them as constant.`,
        currentCode: 'uint256 public MAX_SUPPLY = 1000000;',
        suggestedCode: 'uint256 public constant MAX_SUPPLY = 1000000;',
        estimatedSavings: '~2100 gas per read (SLOAD -> PUSH32)',
        severity: 'low',
        category: 'storage',
      }));
    }

    return results;
  },
};

export const customErrorsRule = {
  id: 'gas-custom-errors',
  name: 'Custom Errors',
  check(ctx: AuditRuleContext): GasOptimization[] {
    const results: GasOptimization[] = [];
    const hasRequireWithMsg = (ctx.sourceCode.match(/require\s*\([^,]+,\s*"[^"]+"/g) ?? []).length;
    const hasCustomErrors = ctx.sourceCodeLower.includes('error ') && ctx.sourceCodeLower.includes('revert');

    if (hasRequireWithMsg > 3 && !hasCustomErrors) {
      results.push(makeOptimization({
        ruleId: 'gas-custom-errors',
        title: 'Use Custom Errors Instead of Require Strings',
        description: `Found ${hasRequireWithMsg} require statements with string messages. Custom errors are ~50 gas cheaper per revert.`,
        currentCode: 'require(msg.sender == owner, "Not authorized");',
        suggestedCode: 'error NotAuthorized(); if (msg.sender != owner) revert NotAuthorized();',
        estimatedSavings: `~${hasRequireWithMsg * 50} gas on reverts`,
        severity: 'medium',
        category: 'computation',
      }));
    }

    return results;
  },
};

export const eventOptimizationRule = {
  id: 'gas-events',
  name: 'Event Optimization',
  check(ctx: AuditRuleContext): GasOptimization[] {
    const results: GasOptimization[] = [];
    const events = ctx.sourceCode.match(/event\s+\w+\s*\([^)]+\)/g) ?? [];

    for (const eventSig of events) {
      const params = eventSig.match(/\(([^)]+)\)/)?.[1] ?? '';
      const paramParts = params.split(',').map((p) => p.trim());
      const hasIndexedCount = (eventSig.match(/indexed/g) ?? []).length;

      if (paramParts.length > 3 && hasIndexedCount < 3) {
        results.push(makeOptimization({
          ruleId: 'gas-events',
          title: `Event Could Use More Indexed Parameters`,
          description: `Event has ${paramParts.length} parameters but only ${hasIndexedCount} are indexed. Up to 3 parameters can be indexed for efficient log filtering.`,
          currentCode: eventSig.slice(0, 80),
          suggestedCode: '// Add indexed to first 3 parameters',
          estimatedSavings: 'Improves off-chain filtering efficiency',
          severity: 'low',
          category: 'pattern',
        }));
      }
    }

    return results;
  },
};

export const uncheckedArithmeticRule = {
  id: 'gas-unchecked',
  name: 'Unchecked Arithmetic',
  check(ctx: AuditRuleContext): GasOptimization[] {
    const results: GasOptimization[] = [];
    const hasUnchecked = ctx.sourceCodeLower.includes('unchecked');
    const hasIncrement = ctx.sourceCode.includes('i++') || ctx.sourceCode.includes('i += 1');

    if (hasIncrement && !hasUnchecked) {
      results.push(makeOptimization({
        ruleId: 'gas-unchecked',
        title: 'Use Unchecked for Safe Increment',
        description: 'Loop increments use checked arithmetic. For loop counters that cannot overflow, unchecked blocks save ~100 gas per iteration.',
        currentCode: 'for (uint i = 0; i < length; i++) { ... }',
        suggestedCode: 'for (uint i = 0; i < length; ) { ... unchecked { ++i; } }',
        estimatedSavings: '~100 gas per iteration',
        severity: 'low',
        category: 'computation',
      }));
    }

    return results;
  },
};

export const shortCircuitRule = {
  id: 'gas-shortcircuit',
  name: 'Require Short-Circuit',
  check(ctx: AuditRuleContext): GasOptimization[] {
    const results: GasOptimization[] = [];
    const complexRequires = (ctx.sourceCode.match(/require\s*\([^)]+&&[^)]+/g) ?? []).length;

    if (complexRequires > 0) {
      results.push(makeOptimization({
        ruleId: 'gas-shortcircuit',
        title: 'Reorder Require Conditions',
        description: `Found ${complexRequires} require statements with multiple conditions. Put the cheapest condition first for gas savings on failure.`,
        currentCode: 'require(expensiveCheck() && cheapCheck(), "msg");',
        suggestedCode: 'require(cheapCheck(), "msg"); require(expensiveCheck(), "msg");',
        estimatedSavings: '~200 gas on early revert',
        severity: 'low',
        category: 'computation',
      }));
    }

    return results;
  },
};

export const memoryArrayRule = {
  id: 'gas-memory-array',
  name: 'Memory vs Storage Arrays',
  check(ctx: AuditRuleContext): GasOptimization[] {
    const results: GasOptimization[] = [];
    const hasStorageArray = ctx.sourceCode.match(/(uint\d*|address|bytes)\[\]\s+(public|private|internal)\s+\w+/g) ?? [];
    const hasPush = ctx.sourceCode.includes('.push(');

    if (hasStorageArray.length > 0 && hasPush) {
      results.push(makeOptimization({
        ruleId: 'gas-memory-array',
        title: 'Consider Memory Arrays for Temporary Data',
        description: `Found ${hasStorageArray.length} storage arrays with push operations. For temporary calculations, memory arrays can be significantly cheaper.`,
        currentCode: 'uint256[] public values; // ... values.push(x);',
        suggestedCode: 'uint256[] memory temp = new uint256[](size); // use memory for temp',
        estimatedSavings: '~5000 gas per storage slot avoided',
        severity: 'medium',
        category: 'memory',
      }));
    }

    return results;
  },
};

export const packedStorageRule = {
  id: 'gas-packed-storage',
  name: 'Packed Storage',
  check(ctx: AuditRuleContext): GasOptimization[] {
    const results: GasOptimization[] = [];
    const smallVars = ctx.sourceCode.match(/(uint8|uint16|uint32|uint64|bool|address)\s+(?:private|internal|public)\s+\w+/g) ?? [];

    if (smallVars.length >= 3) {
      results.push(makeOptimization({
        ruleId: 'gas-packed-storage',
        title: 'Pack Small Variables Together',
        description: `${smallVars.length} small state variables detected. Solidity packs variables into 32-byte slots when possible.`,
        currentCode: 'uint8 a; uint256 b; uint8 c; // 3 slots',
        suggestedCode: 'uint256 b; uint8 a; uint8 c; // 2 slots (a and c packed)',
        estimatedSavings: '~2100 gas per avoided SLOAD/SSTORE',
        severity: 'low',
        category: 'storage',
      }));
    }

    return results;
  },
};
