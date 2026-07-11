import type { AuditRule } from '../types';
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
  immutableCandidatesRule,
  stringConcatRule,
  publicMappingRule,
  receiveFallbackRule,
  duplicateFunctionRule,
} from './security-rules';
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
} from './gas-rules';

const ALL_SECURITY_RULES: AuditRule[] = [
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
  immutableCandidatesRule,
  stringConcatRule,
  publicMappingRule,
  receiveFallbackRule,
  duplicateFunctionRule,
];

const ALL_GAS_RULES = [
  repeatedStorageReadsRule,
  immutableCandidatesGasRule,
  constantCandidatesRule,
  customErrorsRule,
  eventOptimizationRule,
  uncheckedArithmeticRule,
  shortCircuitRule,
  memoryArrayRule,
  packedStorageRule,
];

export function getAllSecurityRules(): AuditRule[] {
  return [...ALL_SECURITY_RULES];
}

export function getAllGasRules(): typeof ALL_GAS_RULES {
  return [...ALL_GAS_RULES];
}

export function getRulesByCategory(category: AuditRule['category']): AuditRule[] {
  return ALL_SECURITY_RULES.filter((r) => r.category === category);
}

export function getRulesBySeverity(severity: AuditRule['severity']): AuditRule[] {
  return ALL_SECURITY_RULES.filter((r) => r.severity === severity);
}

export function getEnabledRules(): AuditRule[] {
  return ALL_SECURITY_RULES.filter((r) => r.enabled);
}

export function getRuleById(id: string): AuditRule | undefined {
  return ALL_SECURITY_RULES.find((r) => r.id === id);
}

export function getGasRuleById(id: string): typeof ALL_GAS_RULES[0] | undefined {
  return ALL_GAS_RULES.find((r) => r.id === id);
}

export { ALL_SECURITY_RULES, ALL_GAS_RULES };
