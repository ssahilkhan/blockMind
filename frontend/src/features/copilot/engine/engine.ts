import type { CopilotContext, CopilotWorkspace, CopilotSuggestion, CopilotRule } from "../types";
import { analyzeContractContext } from "../assistants/contract";
import { analyzeTransactionPreSend } from "../assistants/transaction";
import { analyzeWalletContext, analyzeWalletApprovals } from "../assistants/wallet";
import { analyzeTokenContext, analyzeTokenApproval } from "../assistants/token";

let engineId = 0;

function nextId(prefix: string): string {
  engineId++;
  return `${prefix}-${engineId}-${Date.now()}`;
}

const DEFAULT_RULES: CopilotRule[] = [
  {
    id: "contract-analysis",
    workspace: "contract",
    name: "Contract Analysis",
    description: "Analyze smart contract source and ABI for security issues",
    enabled: true,
    check: (ctx) => analyzeContractContext(ctx),
  },
  {
    id: "transaction-analysis",
    workspace: "transaction",
    name: "Transaction Analysis",
    description: "Analyze transaction data before sending",
    enabled: true,
    check: (ctx) => analyzeTransactionPreSend(ctx),
  },
  {
    id: "wallet-analysis",
    workspace: "wallet",
    name: "Wallet Analysis",
    description: "Analyze wallet health and approval risks",
    enabled: true,
    check: (ctx) => analyzeWalletContext(ctx),
  },
  {
    id: "token-analysis",
    workspace: "token",
    name: "Token Analysis",
    description: "Analyze token context and approval safety",
    enabled: true,
    check: (ctx) => analyzeTokenContext(ctx),
  },
];

function getRules(): CopilotRule[] {
  return [...DEFAULT_RULES];
}

function runRules(context: CopilotContext, _existing: CopilotSuggestion[]): CopilotSuggestion[] {
  const rules = getRules().filter(
    (r) => r.enabled && (r.workspace === context.workspace || r.workspace === "global"),
  );

  const suggestions: CopilotSuggestion[] = [];
  for (const rule of rules) {
    try {
      const results = rule.check(context);
      suggestions.push(...results);
    } catch {
      // skip failed rules
    }
  }
  return suggestions;
}

function getWorkspaceSuggestions(workspace: CopilotWorkspace, context: CopilotContext): CopilotSuggestion[] {
  const suggestions = runRules(context, []);
  const seen = new Set<string>();
  return suggestions.filter((s) => {
    const key = `${s.category}-${s.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function runCopilotAnalysis(context: CopilotContext): CopilotSuggestion[] {
  return getWorkspaceSuggestions(context.workspace, context);
}

function resetEngineId(): void {
  engineId = 0;
}

export { runCopilotAnalysis, getWorkspaceSuggestions, getRules, runRules, resetEngineId };
