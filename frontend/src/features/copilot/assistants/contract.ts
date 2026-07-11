import type { CopilotSuggestion, CopilotContext } from "../types";

let idCounter = 0;
function sid(): string {
  idCounter++;
  return `sug-${idCounter}-${Date.now()}`;
}

function makeSuggestion(
  overrides: Partial<CopilotSuggestion> & Pick<CopilotSuggestion, "title" | "description">,
): CopilotSuggestion {
  return {
    id: sid(),
    workspace: "contract",
    category: "best-practice",
    severity: "suggestion",
    source: "contract-assistant",
    timestamp: Date.now(),
    ...overrides,
  };
}

interface ContractAnalysisInput {
  source?: string;
  abi?: unknown[];
  address?: string;
}

function getSourceLower(source: string): string {
  return source.toLowerCase();
}

export function analyzeContractCode(input: ContractAnalysisInput): CopilotSuggestion[] {
  const suggestions: CopilotSuggestion[] = [];
  const source = input.source ?? "";
  const lower = getSourceLower(source);

  if (!source.trim()) {
    suggestions.push(makeSuggestion({
      title: "No contract source provided",
      description: "Paste or load a Solidity contract to receive analysis.",
      severity: "info",
      category: "review",
    }));
    return suggestions;
  }

  if (lower.includes("pragma solidity") && !lower.includes("pragma solidity ^0.8")) {
    suggestions.push(makeSuggestion({
      title: "Outdated Solidity Version",
      description: "Consider upgrading to Solidity 0.8.x for built-in overflow protection and improved features.",
      details: "Solidity 0.8+ includes automatic overflow/underflow checks, custom errors, and better gas optimization.",
      severity: "warning",
      category: "best-practice",
    }));
  }

  if (!lower.includes(" Ownable") && !lower.includes("ownable") && (lower.includes("function") && (lower.includes("onlyowner") || lower.includes("restricted")))) {
    suggestions.push(makeSuggestion({
      title: "Missing Access Control",
      description: "Contract uses access patterns but may not inherit from OpenZeppelin Ownable or AccessControl.",
      details: "Consider using OpenZeppelin's Ownable or AccessControl for role-based permission management.",
      severity: "warning",
      category: "security",
    }));
  }

  if (!lower.includes("reentrancyguard") && (lower.includes(".call{value:") || lower.includes(".transfer(") || lower.includes(".send("))) {
    suggestions.push(makeSuggestion({
      title: "Missing ReentrancyGuard",
      description: "Contract sends ETH but doesn't use ReentrancyGuard. This could be vulnerable to reentrancy attacks.",
      details: "Apply the Checks-Effects-Interactions pattern and use OpenZeppelin's ReentrancyGuard on external functions that handle ETH transfers.",
      severity: "critical",
      category: "security",
    }));
  }

  if (!lower.includes("event ") && lower.includes("function ")) {
    suggestions.push(makeSuggestion({
      title: "No Events Defined",
      description: "Contract has functions but no events. Events are essential for off-chain monitoring and indexing.",
      details: "Emit events for state changes, transfers, and important contract actions. This helps block explorers, indexers, and frontends track contract activity.",
      severity: "warning",
      category: "best-practice",
    }));
  }

  if (lower.includes("selfdestruct") || lower.includes("suicide")) {
    suggestions.push(makeSuggestion({
      title: "Selfdestruct Detected",
      description: "selfdestruct is deprecated and dangerous. It can destroy the contract and send remaining ETH to any address.",
      details: "Starting from Dencun upgrade, selfdestruct only sends ETH during the same transaction it's called. Consider using a pause/deactivate pattern instead.",
      severity: "critical",
      category: "security",
    }));
  }

  if (lower.includes("delegatecall") && !lower.includes("//")) {
    suggestions.push(makeSuggestion({
      title: "Delegatecall Usage",
      description: "Delegatecall executes code in the caller's context. Ensure the target address is trusted and immutable.",
      details: "Delegatecall shares storage with the caller. If the target can be changed, an attacker could hijack the contract's storage and funds.",
      severity: "warning",
      category: "security",
    }));
  }

  const funcMatches = source.match(/function\s+(\w+)/g);
  if (funcMatches && funcMatches.length > 0) {
    const publicFuncs = funcMatches.filter((f) => !f.includes("internal") && !f.includes("private"));
    if (publicFuncs.length > 10) {
      suggestions.push(makeSuggestion({
        title: "High Public Function Count",
        description: `Contract exposes ${publicFuncs.length} public functions. Consider grouping into facets or using a proxy pattern.`,
        details: "Large contracts increase deployment gas and may hit the contract size limit (24KB). Consider splitting into libraries or using Diamond pattern.",
        severity: "suggestion",
        category: "optimization",
      }));
    }
  }

  if (lower.includes("tx.origin") && lower.includes("require")) {
    suggestions.push(makeSuggestion({
      title: "tx.origin for Authorization",
      description: "Using tx.origin for authorization is vulnerable to phishing attacks. Use msg.sender instead.",
      details: "tx.origin returns the EOA that initiated the transaction, not the immediate caller. An attacker can trick a user into calling a malicious contract that forwards the call.",
      severity: "critical",
      category: "security",
    }));
  }

  if (lower.includes("block.timestamp") && lower.includes("require")) {
    suggestions.push(makeSuggestion({
      title: "Block Timestamp Dependency",
      description: "Relying on block.timestamp for critical logic can be manipulated by miners (±15 seconds).",
      details: "Miners can adjust block.timestamp within a small range. For time-locks, use longer windows and combine with other conditions.",
      severity: "info",
      category: "best-practice",
    }));
  }

  if (lower.includes("ecrecover") && !lower.includes("ecrecover(")) {
    // ecrecover usage
  } else if (lower.includes("signature") || lower.includes("ecrecover")) {
    suggestions.push(makeSuggestion({
      title: "Signature Verification",
      description: "Ensure ecrecover results are checked against the expected signer address. An invalid signature returns address(0).",
      details: "Always validate that ecrecover() != address(0) and matches the expected address. Consider using EIP-712 typed data signatures.",
      severity: "warning",
      category: "security",
    }));
  }

  if (lower.includes("block.number") && (lower.includes("require") || lower.includes("if"))) {
    suggestions.push(makeSuggestion({
      title: "Block Number Dependency",
      description: "Using block.number for timing logic is unreliable across chains with different block times.",
      details: "Block times vary: Ethereum ~12s, Polygon ~2s, BSC ~3s. Use block.timestamp for time-based logic instead.",
      severity: "info",
      category: "best-practice",
    }));
  }

  if (lower.includes("payable") && !lower.includes("receive()") && !lower.includes("fallback()")) {
    suggestions.push(makeSuggestion({
      title: "No Receive/Fallback Function",
      description: "Contract accepts ETH via payable functions but has no receive() or fallback(). Direct ETH transfers will fail.",
      details: "Add a receive() function if the contract should accept plain ETH transfers, or a fallback() for complex routing.",
      severity: "info",
      category: "best-practice",
    }));
  }

  const gasKeywords = ["sstore(", "sload(", "mload(", "mstore("];
  const hasAssembly = lower.includes("assembly");
  if (hasAssembly && gasKeywords.some((k) => lower.includes(k))) {
    suggestions.push(makeSuggestion({
      title: "Inline Assembly Detected",
      description: "Contract uses inline assembly. Ensure memory and storage operations are correct to avoid vulnerabilities.",
      details: "Assembly bypasses Solidity safety checks. Verify bounds checking, memory management, and storage slot calculations manually.",
      severity: "suggestion",
      category: "review",
    }));
  }

  if (lower.includes("string memory") && source.length > 2000) {
    suggestions.push(makeSuggestion({
      title: "String Concatenation in Loops",
      description: "String operations in loops are gas-expensive. Consider using events for logging instead.",
      details: "String concatenation allocates new memory on each iteration. Use emit events for off-chain logging and keep on-chain storage minimal.",
      severity: "suggestion",
      category: "gas",
    }));
  }

  if (lower.includes("mapping(") && lower.includes("public")) {
    const publicMappings = (source.match(/mapping\([^)]+\)\s+public/g) || []).length;
    if (publicMappings > 5) {
      suggestions.push(makeSuggestion({
        title: "Many Public Mappings",
        description: `${publicMappings} public mappings generate getter functions. Each adds deployment gas.`,
        details: "Consider using events instead of public mappings for data that doesn't need on-chain reads, or batch reads via a single view function.",
        severity: "suggestion",
        category: "gas",
      }));
    }
  }

  return suggestions;
}

export function analyzeContractABI(abi: unknown[]): CopilotSuggestion[] {
  const suggestions: CopilotSuggestion[] = [];

  if (!Array.isArray(abi) || abi.length === 0) {
    return suggestions;
  }

  const functions = abi.filter((item) => (item as Record<string, unknown>).type === "function");
  const events = abi.filter((item) => (item as Record<string, unknown>).type === "event");
  const hasReceive = abi.some((item) => (item as Record<string, unknown>).type === "receive");

  const stateChangers = functions.filter((f) => {
    const rec = f as Record<string, unknown>;
    return rec.stateMutability === "nonpayable" || rec.stateMutability === "payable";
  });

  if (stateChangers.length > 0 && events.length === 0) {
    suggestions.push(makeSuggestion({
      title: "State Changes Without Events",
      description: `${stateChangers.length} state-changing functions but no events defined.`,
      details: "Emit events in state-changing functions for off-chain indexing, monitoring, and debugging.",
      severity: "warning",
      category: "best-practice",
    }));
  }

  const payableFuncs = functions.filter((f) => (f as Record<string, unknown>).stateMutability === "payable");
  if (payableFuncs.length > 0 && !hasReceive) {
    suggestions.push(makeSuggestion({
      title: "Payable Functions Without Receive",
      description: "Contract has payable functions but no receive() function. Plain ETH transfers will revert.",
      severity: "info",
      category: "best-practice",
    }));
  }

  const writeFuncs = functions.filter((f) => {
    const sm = (f as Record<string, unknown>).stateMutability;
    return sm !== "view" && sm !== "pure";
  });

  if (writeFuncs.length === 0 && functions.length > 0) {
    suggestions.push(makeSuggestion({
      title: "Read-Only Contract",
      description: "All functions are view/pure. This contract cannot modify state.",
      severity: "info",
      category: "review",
    }));
  }

  const funcNames = functions.map((f) => String((f as Record<string, unknown>).name ?? ""));
  const duplicates = funcNames.filter((name, i) => funcNames.indexOf(name) !== i);
  if (duplicates.length > 0) {
    suggestions.push(makeSuggestion({
      title: "Duplicate Function Names",
      description: `Duplicate names detected: ${[...new Set(duplicates)].join(", ")}`,
      details: "Ensure function names are unique or use function overloading intentionally.",
      severity: "warning",
      category: "review",
    }));
  }

  return suggestions;
}

export function analyzeContractContext(context: CopilotContext): CopilotSuggestion[] {
  const suggestions: CopilotSuggestion[] = [];

  if (context.contractSource) {
    suggestions.push(...analyzeContractCode({ source: context.contractSource, address: context.contractAddress }));
  }

  if (context.metadata?.abi && Array.isArray(context.metadata.abi)) {
    suggestions.push(...analyzeContractABI(context.metadata.abi as unknown[]));
  }

  if (context.contractAddress) {
    suggestions.push(makeSuggestion({
      title: "Contract Verification",
      description: `Verify contract source on Etherscan for transparency.`,
      details: "Verified contracts allow users to read state, call functions, and understand the contract logic.",
      severity: "info",
      category: "best-practice",
      workspace: "contract",
    }));
  }

  return suggestions;
}

export function resetIdCounter(): void {
  idCounter = 0;
}
