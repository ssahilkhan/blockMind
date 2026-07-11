import type { CopilotSuggestion, CopilotContext } from "../types";

let idCounter = 0;
function sid(): string {
  idCounter++;
  return `w-sug-${idCounter}-${Date.now()}`;
}

function makeSuggestion(
  overrides: Partial<CopilotSuggestion> & Pick<CopilotSuggestion, "title" | "description">,
): CopilotSuggestion {
  return {
    id: sid(),
    workspace: "wallet",
    category: "review",
    severity: "suggestion",
    source: "wallet-assistant",
    timestamp: Date.now(),
    ...overrides,
  };
}

function parseBalance(balance: string): number {
  try {
    return parseFloat(balance);
  } catch {
    return 0;
  }
}

interface WalletAnalysisData {
  balance?: string;
  transactionCount?: number;
  nonce?: number;
  tokenCount?: number;
  nftCount?: number;
  approvals?: { spender: string; amount: string; unlimited?: boolean }[];
  recentActivity?: { timestamp: number; type: string }[];
}

export function analyzeWalletContext(
  context: CopilotContext,
  data?: WalletAnalysisData,
): CopilotSuggestion[] {
  const suggestions: CopilotSuggestion[] = [];

  if (context.walletAddress) {
    suggestions.push(makeSuggestion({
      title: "Wallet Overview",
      description: `Analyzing wallet ${context.walletAddress.slice(0, 10)}...${context.walletAddress.slice(-8)}`,
      severity: "info",
      category: "review",
    }));
  }

  if (data) {
    if (data.balance) {
      const bal = parseBalance(data.balance);
      if (bal === 0) {
        suggestions.push(makeSuggestion({
          title: "Empty Wallet",
          description: "This wallet has zero ETH balance. Ensure you have funds before sending transactions.",
          severity: "info",
          category: "review",
        }));
      } else if (bal > 100) {
        suggestions.push(makeSuggestion({
          title: "High Balance Wallet",
          description: `This wallet holds ${bal.toFixed(4)} ETH. Consider using a hardware wallet for enhanced security.`,
          severity: "suggestion",
          category: "security",
        }));
      }
    }

    if (data.transactionCount !== undefined && data.transactionCount === 0) {
      suggestions.push(makeSuggestion({
        title: "No Transaction History",
        description: "This wallet has never sent or received a transaction. It may be newly created or unused.",
        severity: "info",
        category: "review",
      }));
    }

    if (data.approvals && data.approvals.length > 0) {
      const unlimited = data.approvals.filter((a) => a.unlimited);
      if (unlimited.length > 0) {
        suggestions.push(makeSuggestion({
          title: "Unlimited Token Approvals",
          description: `${unlimited.length} unlimited approvals found. These give protocols unlimited access to your tokens.`,
          details: "Unlimited approvals are convenient but risky. If a protocol is compromised, attackers can drain all approved tokens. Revoke unused approvals using revoke.cash or Etherscan.",
          severity: "warning",
          category: "security",
        }));
      }

      if (data.approvals.length > 10) {
        suggestions.push(makeSuggestion({
          title: "Many Active Approvals",
          description: `${data.approvals.length} active token approvals. Review and revoke unused ones.`,
          details: "Each active approval is a potential attack vector. Regularly audit approvals using revoke.cash.",
          severity: "warning",
          category: "security",
        }));
      }
    }

    if (data.nonce !== undefined && data.transactionCount !== undefined) {
      const gap = data.transactionCount - data.nonce;
      if (gap > 5) {
        suggestions.push(makeSuggestion({
          title: "Nonce Gap Detected",
          description: `Nonce gap of ${gap} detected. Some transactions may be stuck or dropped.`,
          details: "Nonce gaps can occur when transactions are dropped from the mempool. You may need to resubmit with a higher gas price.",
          severity: "warning",
          category: "optimization",
        }));
      }
    }

    if (data.recentActivity && data.recentActivity.length > 0) {
      const lastActivity = data.recentActivity[0]?.timestamp;
      if (lastActivity) {
        const daysSince = (Date.now() - lastActivity) / (1000 * 60 * 60 * 24);
        if (daysSince > 90) {
          suggestions.push(makeSuggestion({
            title: "Dormant Wallet",
            description: `Last activity was ${Math.floor(daysSince)} days ago. Dormant wallets may be vulnerable if private keys are lost.`,
            severity: "info",
            category: "review",
          }));
        }
      }
    }
  }

  return suggestions;
}

export function analyzeWalletApprovals(
  approvals: { spender: string; amount: string; unlimited?: boolean; tokenName?: string }[],
): CopilotSuggestion[] {
  const suggestions: CopilotSuggestion[] = [];

  if (approvals.length === 0) {
    return suggestions;
  }

  const unlimited = approvals.filter((a) => a.unlimited);
  if (unlimited.length > 0) {
    suggestions.push(makeSuggestion({
      title: `${unlimited.length} Unlimited Approval(s)`,
      description: `Unlimited approvals found for: ${unlimited.map((a) => a.tokenName ?? a.spender.slice(0, 10)).join(", ")}`,
      details: "Unlimited approvals allow the spender to transfer all your tokens at once. Revoke unused approvals.",
      severity: "warning",
      category: "security",
      workspace: "wallet",
    }));
  }

  const suspiciousSpenders = approvals.filter((a) => {
    const addr = a.spender.toLowerCase();
    return addr.startsWith("0x000000000000") || addr === "0x0000000000000000000000000000000000000000";
  });

  if (suspiciousSpenders.length > 0) {
    suggestions.push(makeSuggestion({
      title: "Suspicious Spender Addresses",
      description: "Approvals found for zero or near-zero addresses.",
      severity: "critical",
      category: "security",
      workspace: "wallet",
    }));
  }

  return suggestions;
}

export function resetWalletIdCounter(): void {
  idCounter = 0;
}
