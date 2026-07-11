import type { AuditRule, AuditFinding, AuditRuleContext } from '../types';

function fid(): string {
  return `f-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function makeFinding(
  overrides: Partial<AuditFinding> & { title: string; ruleId: string; description: string },
): AuditFinding {
  return {
    id: fid(),
    severity: 'medium',
    category: 'best-practice',
    recommendation: 'Review and address this finding.',
    confidence: 0.8,
    source: 'static-analysis',
    ...overrides,
  };
}

export const ownershipDetectionRule: AuditRule = {
  id: 'security-ownership',
  name: 'Ownership Detection',
  description: 'Checks if contract has ownership pattern',
  category: 'access-control',
  severity: 'medium',
  enabled: true,
  analyze(ctx: AuditRuleContext): AuditFinding[] {
    const findings: AuditFinding[] = [];
    const hasOwnable = ctx.sourceCodeLower.includes('ownable') || ctx.sourceCodeLower.includes('isowner');
    const hasOwner = ctx.sourceCodeLower.includes('owner') && ctx.sourceCodeLower.includes('mapping') && ctx.sourceCodeLower.includes('address');
    const hasOwnerFn = ctx.sourceCodeLower.includes('function') && (ctx.sourceCodeLower.includes('transferownership') || ctx.sourceCodeLower.includes('renounceownership'));

    if (!hasOwnable && !hasOwner && !hasOwnerFn) {
      findings.push(makeFinding({
        ruleId: 'security-ownership',
        title: 'No Ownership Pattern Detected',
        description: 'Contract does not appear to implement an ownership pattern. Critical functions may lack proper access control.',
        severity: 'medium',
        category: 'access-control',
        recommendation: 'Consider implementing OpenZeppelin Ownable or AccessControl to manage privileged operations.',
        confidence: 0.7,
      }));
    }

    return findings;
  },
};

export const accessControlRule: AuditRule = {
  id: 'security-access-control',
  name: 'Access Control Checks',
  description: 'Verifies access control on sensitive functions',
  category: 'access-control',
  severity: 'high',
  enabled: true,
  analyze(ctx: AuditRuleContext): AuditFinding[] {
    const findings: AuditFinding[] = [];
    const publicFunctions = ctx.sourceCode.match(/function\s+\w+\s*\([^)]*\)\s*public/gi) ?? [];
    const onlyOwner = (ctx.sourceCode.match(/onlyOwner|onlyRole|modifier\s+only/gi) ?? []).length;

    if (publicFunctions.length > 5 && onlyOwner === 0) {
      findings.push(makeFinding({
        ruleId: 'security-access-control',
        title: 'No Access Control Modifiers Found',
        description: `Found ${publicFunctions.length} public functions but no access control modifiers (onlyOwner, onlyRole, etc.). Sensitive operations may be unprotected.`,
        severity: 'high',
        category: 'access-control',
        recommendation: 'Apply appropriate access control modifiers (onlyOwner, role-based, or custom) to sensitive functions.',
        confidence: 0.85,
      }));
    }

    const mintFunctions = ctx.sourceCode.match(/function\s+mint\s*\(/gi) ?? [];
    const hasAccessOnMint = ctx.sourceCodeLower.includes('mint') &&
      (ctx.sourceCodeLower.includes('onlyowner') || ctx.sourceCodeLower.includes('onlyrole') || ctx.sourceCodeLower.includes('require'));

    if (mintFunctions.length > 0 && !hasAccessOnMint) {
      findings.push(makeFinding({
        ruleId: 'security-access-control',
        title: 'Mint Function May Lack Access Control',
        description: 'A mint function was detected but no clear access control modifier was found protecting it.',
        severity: 'critical',
        category: 'access-control',
        recommendation: 'Ensure mint functions are protected by appropriate access control to prevent unauthorized token minting.',
        confidence: 0.9,
      }));
    }

    return findings;
  },
};

export const mintCapabilityRule: AuditRule = {
  id: 'security-mint',
  name: 'Mint Capability',
  description: 'Detects mint capability and its implications',
  category: 'access-control',
  severity: 'medium',
  enabled: true,
  analyze(ctx: AuditRuleContext): AuditFinding[] {
    const findings: AuditFinding[] = [];
    const hasMint = ctx.sourceCodeLower.includes('function') && ctx.sourceCodeLower.includes('mint');

    if (hasMint) {
      const hasCap = ctx.sourceCodeLower.includes('cap') || ctx.sourceCodeLower.includes('maxsupply') || ctx.sourceCodeLower.includes('totalSupply');
      if (!hasCap) {
        findings.push(makeFinding({
          ruleId: 'security-mint',
          title: 'Mint Function Without Supply Cap',
          description: 'Contract has a mint function but no visible supply cap. This could lead to unlimited token inflation.',
          severity: 'high',
          category: 'access-control',
          recommendation: 'Implement a supply cap (using OpenZeppelin ERC20Capped or a manual check) to prevent unlimited minting.',
          confidence: 0.85,
        }));
      }
    }

    return findings;
  },
};

export const burnCapabilityRule: AuditRule = {
  id: 'security-burn',
  name: 'Burn Capability',
  description: 'Detects burn functionality',
  category: 'code-quality',
  severity: 'informational',
  enabled: true,
  analyze(ctx: AuditRuleContext): AuditFinding[] {
    const findings: AuditFinding[] = [];
    const hasBurn = ctx.sourceCodeLower.includes('function') && ctx.sourceCodeLower.includes('burn');

    if (hasBurn) {
      findings.push(makeFinding({
        ruleId: 'security-burn',
        title: 'Burn Functionality Detected',
        description: 'Contract includes burn functionality. Ensure proper access controls and that burn events are emitted.',
        severity: 'informational',
        category: 'code-quality',
        recommendation: 'Verify burn access controls and ensure Burn/Transfer events are emitted correctly.',
        confidence: 0.9,
      }));
    }

    return findings;
  },
};

export const pauseCapabilityRule: AuditRule = {
  id: 'security-pause',
  name: 'Pause Capability',
  description: 'Detects pause/unpause functionality',
  category: 'code-quality',
  severity: 'low',
  enabled: true,
  analyze(ctx: AuditRuleContext): AuditFinding[] {
    const findings: AuditFinding[] = [];
    const hasPause = ctx.sourceCodeLower.includes('pause') && ctx.sourceCodeLower.includes('function');
    const hasUnpause = ctx.sourceCodeLower.includes('unpause');

    if (hasPause) {
      findings.push(makeFinding({
        ruleId: 'security-pause',
        title: 'Pause Mechanism Detected',
        description: 'Contract implements pause functionality. Centralized pause capability is a trust assumption users must be aware of.',
        severity: 'low',
        category: 'code-quality',
        recommendation: 'Ensure pause is protected by access control. Document the pause mechanism and its implications for users.',
        confidence: 0.9,
      }));

      if (!hasUnpause) {
        findings.push(makeFinding({
          ruleId: 'security-pause',
          title: 'Pause Without Unpause',
          description: 'Contract has pause functionality but no unpause function detected. Contract may become permanently paused.',
          severity: 'medium',
          category: 'code-quality',
          recommendation: 'Implement an unpause function with appropriate access control.',
          confidence: 0.8,
        }));
      }
    }

    return findings;
  },
};

export const upgradeabilityRule: AuditRule = {
  id: 'security-upgradeability',
  name: 'Upgradeability Detection',
  description: 'Detects proxy patterns and upgradeability',
  category: 'upgradeability',
  severity: 'medium',
  enabled: true,
  analyze(ctx: AuditRuleContext): AuditFinding[] {
    const findings: AuditFinding[] = [];
    const hasProxy = ctx.sourceCodeLower.includes('proxy') || ctx.sourceCodeLower.includes('delegatecall') || ctx.sourceCodeLower.includes('upgradeable');
    const hasStorage = ctx.sourceCodeLower.includes('storage') && ctx.sourceCodeLower.includes('layout');

    if (hasProxy) {
      findings.push(makeFinding({
        ruleId: 'security-upgradeability',
        title: 'Upgradeability Pattern Detected',
        description: 'Contract uses proxy/upgradeable pattern. Ensure storage layout is consistent across upgrades and initialize() is protected.',
        severity: 'medium',
        category: 'upgradeability',
        recommendation: 'Use OpenZeppelin Upgrades plugin, protect initialize() with initializer modifier, and validate storage layout compatibility.',
        confidence: 0.85,
      }));

      const hasInitialize = ctx.sourceCodeLower.includes('initialize');
      if (!hasInitialize) {
        findings.push(makeFinding({
          ruleId: 'security-upgradeability',
          title: 'Proxy Pattern Without Initialize',
          description: 'Contract uses delegatecall/proxy but no initialize function was found. Proxy contracts should use initialize instead of constructors.',
          severity: 'high',
          category: 'upgradeability',
          recommendation: 'Implement an initialize function with the initializer modifier to set initial state.',
          confidence: 0.8,
        }));
      }
    }

    return findings;
  },
};

export const externalCallReviewRule: AuditRule = {
  id: 'security-external-calls',
  name: 'External Call Review',
  description: 'Reviews external calls for safety',
  category: 'external-calls',
  severity: 'medium',
  enabled: true,
  analyze(ctx: AuditRuleContext): AuditFinding[] {
    const findings: AuditFinding[] = [];
    const hasCall = ctx.sourceCodeLower.includes('.call{') || ctx.sourceCodeLower.includes('.call(');
    const hasDelegatecall = ctx.sourceCodeLower.includes('delegatecall');
    const hasStaticcall = ctx.sourceCodeLower.includes('staticcall');

    if (hasCall && !ctx.sourceCodeLower.includes('reentrancyguard') && !ctx.sourceCodeLower.includes('nonreentrant')) {
      findings.push(makeFinding({
        ruleId: 'security-external-calls',
        title: 'External Call Without Reentrancy Guard',
        description: 'Contract makes external calls but does not use ReentrancyGuard. This could be vulnerable to reentrancy attacks.',
        severity: 'high',
        category: 'reentrancy',
        recommendation: 'Apply ReentrancyGuard from OpenZeppelin to functions that make external calls and transfer value.',
        confidence: 0.85,
      }));
    }

    if (hasDelegatecall) {
      findings.push(makeFinding({
        ruleId: 'security-external-calls',
        title: 'Delegatecall Usage',
        description: 'Contract uses delegatecall. This executes code in the context of the calling contract, which can lead to storage corruption if not carefully managed.',
        severity: 'medium',
        category: 'external-calls',
        recommendation: 'Ensure delegatecall targets are trusted and storage layouts are compatible. Consider using a well-tested proxy pattern.',
        confidence: 0.8,
      }));
    }

    const hasAssembly = ctx.sourceCodeLower.includes('assembly');
    if (hasAssembly) {
      findings.push(makeFinding({
        ruleId: 'security-external-calls',
        title: 'Inline Assembly Detected',
        description: 'Contract uses inline assembly. Assembly code bypasses Solidity safety checks and is harder to audit.',
        severity: 'low',
        category: 'code-quality',
        recommendation: 'Minimize assembly usage and add thorough comments explaining assembly blocks. Consider using Yul optimizations carefully.',
        confidence: 0.9,
      }));
    }

    return findings;
  },
};

export const eventCoverageRule: AuditRule = {
  id: 'security-events',
  name: 'Event Coverage',
  description: 'Checks for event emissions on state changes',
  category: 'event-coverage',
  severity: 'medium',
  enabled: true,
  analyze(ctx: AuditRuleContext): AuditFinding[] {
    const findings: AuditFinding[] = [];
    const eventDefinitions = (ctx.sourceCode.match(/event\s+\w+/gi) ?? []).length;
    const emitStatements = (ctx.sourceCode.match(/emit\s+\w+/gi) ?? []).length;
    const stateChangingFns = (ctx.sourceCode.match(/function\s+\w+[^}]*\b(public|external)\b[^}]*\{/gi) ?? []).length;

    if (eventDefinitions === 0 && stateChangingFns > 2) {
      findings.push(makeFinding({
        ruleId: 'security-events',
        title: 'No Events Defined',
        description: 'Contract defines no events but has state-changing functions. Events are essential for off-chain monitoring and indexing.',
        severity: 'medium',
        category: 'event-coverage',
        recommendation: 'Define events for all significant state changes (transfers, ownership changes, configuration updates) and emit them.',
        confidence: 0.9,
      }));
    } else if (eventDefinitions > 0 && emitStatements < eventDefinitions / 2) {
      findings.push(makeFinding({
        ruleId: 'security-events',
        title: 'Insufficient Event Emissions',
        description: `Contract defines ${eventDefinitions} events but only emits ${emitStatements}. Many defined events may not be used.`,
        severity: 'low',
        category: 'event-coverage',
        recommendation: 'Ensure all defined events are emitted at the appropriate points in the contract logic.',
        confidence: 0.7,
      }));
    }

    return findings;
  },
};

export const selfdestructRule: AuditRule = {
  id: 'security-selfdestruct',
  name: 'Selfdestruct Detection',
  description: 'Detects selfdestruct/suicide opcode usage',
  category: 'access-control',
  severity: 'critical',
  enabled: true,
  analyze(ctx: AuditRuleContext): AuditFinding[] {
    const findings: AuditFinding[] = [];
    const hasSelfdestruct = ctx.sourceCodeLower.includes('selfdestruct') || ctx.sourceCodeLower.includes('suicide');

    if (hasSelfdestruct) {
      findings.push(makeFinding({
        ruleId: 'security-selfdestruct',
        title: 'Selfdestruct Detected',
        description: 'Contract contains selfdestruct/suicide. This can permanently destroy the contract and send remaining funds to an address. Deprecated in EIP-6049.',
        severity: 'critical',
        category: 'access-control',
        recommendation: 'Remove selfdestruct unless absolutely necessary. If required, protect with strict access control and time locks. Note: selfdestruct behavior changed in Dencun upgrade.',
        confidence: 0.95,
      }));
    }

    return findings;
  },
};

export const txOriginRule: AuditRule = {
  id: 'security-txorigin',
  name: 'tx.origin Usage',
  description: 'Detects tx.origin for authorization',
  category: 'access-control',
  severity: 'critical',
  enabled: true,
  analyze(ctx: AuditRuleContext): AuditFinding[] {
    const findings: AuditFinding[] = [];
    const hasTxOrigin = ctx.sourceCodeLower.includes('tx.origin');

    if (hasTxOrigin) {
      findings.push(makeFinding({
        ruleId: 'security-txorigin',
        title: 'tx.origin Used for Authorization',
        description: 'Contract uses tx.origin for authorization. This is vulnerable to phishing attacks where a malicious contract calls into this contract.',
        severity: 'critical',
        category: 'access-control',
        recommendation: 'Use msg.sender instead of tx.origin for authorization. tx.origin should only be used to prevent intermediate contracts from calling certain functions.',
        confidence: 0.95,
      }));
    }

    return findings;
  },
};

export const blockTimestampRule: AuditRule = {
  id: 'security-blocktimestamp',
  name: 'Block Timestamp Dependency',
  description: 'Detects dependency on block.timestamp',
  category: 'front-running',
  severity: 'low',
  enabled: true,
  analyze(ctx: AuditRuleContext): AuditFinding[] {
    const findings: AuditFinding[] = [];
    const hasTimestamp = ctx.sourceCodeLower.includes('block.timestamp') || ctx.sourceCodeLower.includes('block.timestamp');
    const hasBlockNumber = ctx.sourceCodeLower.includes('block.number');

    if (hasTimestamp) {
      findings.push(makeFinding({
        ruleId: 'security-blocktimestamp',
        title: 'Block Timestamp Dependency',
        description: 'Contract depends on block.timestamp. Miners can manipulate timestamps within ~15 seconds. Do not use for critical randomness or tight time constraints.',
        severity: 'low',
        category: 'front-running',
        recommendation: 'Avoid using block.timestamp for critical logic. If time-based checks are needed, allow sufficient margin (e.g., 15+ seconds).',
        confidence: 0.8,
      }));
    }

    if (hasBlockNumber) {
      findings.push(makeFinding({
        ruleId: 'security-blocktimestamp',
        title: 'Block Number Dependency',
        description: 'Contract depends on block.number. Block production timing varies across chains and can be manipulated in some scenarios.',
        severity: 'informational',
        category: 'front-running',
        recommendation: 'Be aware that block.number-based logic behaves differently across L1 and L2 chains.',
        confidence: 0.7,
      }));
    }

    return findings;
  },
};

export const ecrecoverRule: AuditRule = {
  id: 'security-ecrecover',
  name: 'Signature Verification',
  description: 'Detects ecrecover usage for signature verification',
  category: 'external-calls',
  severity: 'medium',
  enabled: true,
  analyze(ctx: AuditRuleContext): AuditFinding[] {
    const findings: AuditFinding[] = [];
    const hasEcrecover = ctx.sourceCodeLower.includes('ecrecover');

    if (hasEcrecover) {
      findings.push(makeFinding({
        ruleId: 'security-ecrecover',
        title: 'Ecrecover Usage Detected',
        description: 'Contract uses ecrecover for signature verification. Invalid signatures return address(0), which can lead to vulnerabilities if not checked.',
        severity: 'medium',
        category: 'external-calls',
        recommendation: 'Always verify that ecrecover does not return address(0). Consider using OpenZeppelin ECDSA library which handles edge cases.',
        confidence: 0.9,
      }));
    }

    return findings;
  },
};

export const immutableCandidatesRule: AuditRule = {
  id: 'security-immutable',
  name: 'Immutable Candidates',
  description: 'Identifies variables that could be immutable',
  category: 'gas-optimization',
  severity: 'informational',
  enabled: true,
  analyze(ctx: AuditRuleContext): AuditFinding[] {
    const findings: AuditFinding[] = [];
    const constructorBlock = ctx.sourceCode.match(/constructor\s*\([^)]*\)\s*\{[\s\S]*?\}/);
    if (!constructorBlock) return findings;

    const stateVars = ctx.sourceCode.match(/(address|uint\d*|bytes\d*|bool|string)\s+(private|internal|public)\s+\w+/gi) ?? [];
    const immutableVars = ctx.sourceCodeLower.match(/immutable/g) ?? [];

    if (stateVars.length > 2 && immutableVars.length === 0) {
      findings.push(makeFinding({
        ruleId: 'security-immutable',
        title: 'No Immutable Variables Found',
        description: `Contract has ${stateVars.length} state variables but none use the immutable modifier. Variables set in the constructor could be immutable for gas savings.`,
        severity: 'informational',
        category: 'gas-optimization',
        recommendation: 'Mark constructor-assigned variables as immutable to save gas on reads (~2100 gas per SLOAD vs ~3 gas for IMMUTABLE).',
        confidence: 0.7,
      }));
    }

    return findings;
  },
};

export const stringConcatRule: AuditRule = {
  id: 'security-string-concat',
  name: 'String Concatenation',
  description: 'Detects string concatenation in loops or frequent calls',
  category: 'gas-optimization',
  severity: 'low',
  enabled: true,
  analyze(ctx: AuditRuleContext): AuditFinding[] {
    const findings: AuditFinding[] = [];
    const hasStringConcat = ctx.sourceCode.includes('string(abi') || ctx.sourceCode.includes('abi.encodePacked');

    if (hasStringConcat) {
      findings.push(makeFinding({
        ruleId: 'security-string-concat',
        title: 'String Concatenation Detected',
        description: 'Contract uses abi.encodePacked for string concatenation. This can be gas-expensive in loops and may have hash collision risks with dynamic types.',
        severity: 'low',
        category: 'gas-optimization',
        recommendation: 'Use abi.encode instead of abi.encodePacked for hashing to prevent collision. Avoid string concatenation in loops.',
        confidence: 0.7,
      }));
    }

    return findings;
  },
};

export const publicMappingRule: AuditRule = {
  id: 'security-public-mapping',
  name: 'Public Mapping Visibility',
  description: 'Checks for public mappings that auto-generate getters',
  category: 'gas-optimization',
  severity: 'informational',
  enabled: true,
  analyze(ctx: AuditRuleContext): AuditFinding[] {
    const findings: AuditFinding[] = [];
    const publicMappings = ctx.sourceCode.match(/mapping\s*\([^)]+\)\s*public\s+\w+/gi) ?? [];

    if (publicMappings.length > 5) {
      findings.push(makeFinding({
        ruleId: 'security-public-mapping',
        title: 'Many Public Mappings',
        description: `Found ${publicMappings.length} public mappings with auto-generated getters. This increases contract bytecode size.`,
        severity: 'informational',
        category: 'gas-optimization',
        recommendation: 'Consider making mappings internal/private with explicit getter functions for better control and gas optimization.',
        confidence: 0.6,
      }));
    }

    return findings;
  },
};

export const receiveFallbackRule: AuditRule = {
  id: 'security-receive-fallback',
  name: 'Receive/Fallback Functions',
  description: 'Checks for payable functions with receive/fallback',
  category: 'code-quality',
  severity: 'low',
  enabled: true,
  analyze(ctx: AuditRuleContext): AuditFinding[] {
    const findings: AuditFinding[] = [];
    const hasPayable = ctx.sourceCodeLower.includes('payable');
    const hasReceive = ctx.sourceCodeLower.includes('receive');
    const hasFallback = ctx.sourceCodeLower.includes('fallback');

    if (hasPayable && !hasReceive && !hasFallback) {
      findings.push(makeFinding({
        ruleId: 'security-receive-fallback',
        title: 'Payable Without Receive/Fallback',
        description: 'Contract has payable functions but no receive() or fallback() function. ETH sent directly to the contract may be locked.',
        severity: 'low',
        category: 'code-quality',
        recommendation: 'Add a receive() function if the contract should accept direct ETH transfers, or ensure all ETH entry points are controlled.',
        confidence: 0.8,
      }));
    }

    return findings;
  },
};

export const duplicateFunctionRule: AuditRule = {
  id: 'security-duplicate-functions',
  name: 'Duplicate Function Signatures',
  description: 'Checks for duplicate function names in ABI',
  category: 'code-quality',
  severity: 'medium',
  enabled: true,
  analyze(ctx: AuditRuleContext): AuditFinding[] {
    const findings: AuditFinding[] = [];

    if (!ctx.abi || !Array.isArray(ctx.abi)) return findings;

    const fnNames = ctx.abi
      .filter((item: unknown) => typeof item === 'object' && item !== null && 'type' in item && (item as { type: string }).type === 'function')
      .map((item: unknown) => (item as { name: string }).name);

    const seen = new Map<string, number>();
    for (const name of fnNames) {
      seen.set(name, (seen.get(name) ?? 0) + 1);
    }

    for (const [name, count] of seen) {
      if (count > 1) {
        findings.push(makeFinding({
          ruleId: 'security-duplicate-functions',
          title: `Duplicate Function: ${name}`,
          description: `Function "${name}" appears ${count} times in the ABI. This may indicate overloaded functions or an ABI issue.`,
          severity: 'medium',
          category: 'code-quality',
          recommendation: 'Verify that function overloading is intentional and that no naming conflicts exist.',
          confidence: 0.9,
        }));
      }
    }

    return findings;
  },
};
