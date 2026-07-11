import type { CopilotSuggestion, CopilotContext } from "../types";

let idCounter = 0;
function sid(): string {
  idCounter++;
  return `tk-sug-${idCounter}-${Date.now()}`;
}

function makeSuggestion(
  overrides: Partial<CopilotSuggestion> & Pick<CopilotSuggestion, "title" | "description">,
): CopilotSuggestion {
  return {
    id: sid(),
    workspace: "token",
    category: "review",
    severity: "suggestion",
    source: "token-assistant",
    timestamp: Date.now(),
    ...overrides,
  };
}

interface TokenAnalysisData {
  standard?: string;
  name?: string;
  symbol?: string;
  totalSupply?: string;
  decimals?: number;
  hasMintCapability?: boolean;
  hasBurnFunction?: boolean;
  isVerified?: boolean;
  owner?: string;
  paused?: boolean;
}

export function analyzeTokenContext(
  context: CopilotContext,
  data?: TokenAnalysisData,
): CopilotSuggestion[] {
  const suggestions: CopilotSuggestion[] = [];

  if (!data) {
    if (context.tokenAddress) {
      suggestions.push(makeSuggestion({
        title: "Token Overview",
        description: `Load token data for ${context.tokenAddress.slice(0, 10)}... to receive detailed analysis.`,
        severity: "info",
        category: "review",
      }));
    }
    return suggestions;
  }

  if (data.standard) {
    const standardInfo: Record<string, { description: string; severity: CopilotSuggestion["severity"] }> = {
      ERC20: {
        description: "ERC-20 fungible token. Supports transfers, approvals, and allowances.",
        severity: "info",
      },
      ERC721: {
        description: "ERC-721 non-fungible token (NFT). Each token is unique with individual ownership.",
        severity: "info",
      },
      ERC1155: {
        description: "ERC-1155 multi-token. Supports both fungible and non-fungible tokens in a single contract.",
        severity: "info",
      },
    };

    const info = standardInfo[data.standard];
    if (info) {
      suggestions.push(makeSuggestion({
        title: `${data.standard} Token Standard`,
        description: info.description,
        severity: info.severity,
        category: "review",
      }));
    }
  }

  if (data.hasMintCapability) {
    suggestions.push(makeSuggestion({
      title: "Mint Function Detected",
      description: "This token has a mint function. The owner can create new tokens at any time.",
      details: "Mint capability means the token supply is not fixed. Check who controls the mint function and whether there are supply limits.",
      severity: "warning",
      category: "security",
    }));
  }

  if (data.hasBurnFunction) {
    suggestions.push(makeSuggestion({
      title: "Burn Function Detected",
      description: "This token has a burn function. Tokens can be permanently removed from circulation.",
      severity: "info",
      category: "review",
    }));
  }

  if (data.isVerified === false) {
    suggestions.push(makeSuggestion({
      title: "Unverified Token",
      description: "This token contract is not verified on the block explorer.",
      details: "Unverified contracts cannot be read or interacted with through the explorer. The source code is unknown.",
      severity: "warning",
      category: "security",
    }));
  }

  if (data.paused) {
    suggestions.push(makeSuggestion({
      title: "Token is Paused",
      description: "This token contract is currently paused. Transfers and approvals may be blocked.",
      severity: "critical",
      category: "security",
    }));
  }

  if (data.decimals !== undefined && data.decimals > 18) {
    suggestions.push(makeSuggestion({
      title: "Unusual Decimals",
      description: `Token has ${data.decimals} decimals. Standard ERC-20 uses 18 decimals.`,
      details: "Non-standard decimals can cause issues with DEXes, wallets, and DeFi protocols that assume 18 decimals.",
      severity: "warning",
      category: "best-practice",
    }));
  }

  if (data.totalSupply) {
    const supply = parseFloat(data.totalSupply);
    if (supply === 0) {
      suggestions.push(makeSuggestion({
        title: "Zero Total Supply",
        description: "This token has zero total supply. No tokens exist yet.",
        severity: "info",
        category: "review",
      }));
    } else if (supply > 1e18) {
      suggestions.push(makeSuggestion({
        title: "Large Token Supply",
        description: `Total supply is ${supply.toLocaleString()} tokens.`,
        severity: "info",
        category: "review",
      }));
    }
  }

  return suggestions;
}

export function analyzeTokenApproval(
  tokenName: string,
  spender: string,
  amount: string,
): CopilotSuggestion[] {
  const suggestions: CopilotSuggestion[] = [];

  const isUnlimited = amount === "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    || parseFloat(amount) > 1e15;

  if (isUnlimited) {
    suggestions.push(makeSuggestion({
      title: `Unlimited Approval for ${tokenName}`,
      description: `Approving unlimited ${tokenName} spending for ${spender.slice(0, 10)}...`,
      details: "Unlimited approvals give the spender access to your entire token balance. Use a specific amount instead for better security.",
      severity: "warning",
      category: "security",
      workspace: "token",
    }));
  }

  if (spender.toLowerCase() === "0x0000000000000000000000000000000000000000") {
    suggestions.push(makeSuggestion({
      title: "Approval to Zero Address",
      description: `Approving ${tokenName} to the zero address will effectively lock/burn the tokens.`,
      severity: "critical",
      category: "security",
      workspace: "token",
    }));
  }

  return suggestions;
}

export function resetTokenIdCounter(): void {
  idCounter = 0;
}
