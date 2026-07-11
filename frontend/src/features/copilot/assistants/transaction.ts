import type { CopilotSuggestion, CopilotContext } from "../types";

let idCounter = 0;
function sid(): string {
  idCounter++;
  return `tx-sug-${idCounter}-${Date.now()}`;
}

function makeSuggestion(
  overrides: Partial<CopilotSuggestion> & Pick<CopilotSuggestion, "title" | "description">,
): CopilotSuggestion {
  return {
    id: sid(),
    workspace: "transaction",
    category: "review",
    severity: "suggestion",
    source: "transaction-assistant",
    timestamp: Date.now(),
    ...overrides,
  };
}

function parseWei(wei: string): number {
  try {
    return parseFloat(wei);
  } catch {
    return 0;
  }
}

function parseEth(eth: string): number {
  try {
    return parseFloat(eth);
  } catch {
    return 0;
  }
}

export function analyzeTransactionPreSend(context: CopilotContext): CopilotSuggestion[] {
  const suggestions: CopilotSuggestion[] = [];
  const tx = context.transactionData;

  if (!tx) {
    suggestions.push(makeSuggestion({
      title: "No Transaction Data",
      description: "Provide transaction details (to, value, data) for pre-send analysis.",
      severity: "info",
      category: "review",
    }));
    return suggestions;
  }

  const valueEth = parseEth(tx.value ?? "0");
  if (valueEth > 10) {
    suggestions.push(makeSuggestion({
      title: "High Value Transfer",
      description: `This transaction sends ${valueEth} ETH. Double-check the recipient address.`,
      details: "Large transfers are irreversible. Verify the recipient address character-by-character and consider using a test transaction first.",
      severity: "critical",
      category: "security",
    }));
  } else if (valueEth > 1) {
    suggestions.push(makeSuggestion({
      title: "Moderate Value Transfer",
      description: `Sending ${valueEth} ETH. Ensure the recipient is correct.`,
      severity: "warning",
      category: "security",
    }));
  }

  if (tx.data && tx.data !== "0x" && tx.data.length > 10) {
    suggestions.push(makeSuggestion({
      title: "Contract Interaction Detected",
      description: "This transaction includes calldata, indicating a smart contract interaction.",
      details: `Calldata length: ${(tx.data.length - 2) / 2} bytes. Decode the function signature to verify what operation is being called.`,
      severity: "info",
      category: "review",
    }));

    if (tx.data.toLowerCase().startsWith("0x095ea7b3")) {
      suggestions.push(makeSuggestion({
        title: "ERC-20 Approval Detected",
        description: "This transaction approves a spender to transfer tokens on your behalf.",
        details: "Approval transactions give another address permission to move your tokens. If the amount is very large (uint256 max), this is an unlimited approval. Review the spender address carefully.",
        severity: "warning",
        category: "security",
      }));
    }

    if (tx.data.toLowerCase().startsWith("0xa9059cbb")) {
      suggestions.push(makeSuggestion({
        title: "ERC-20 Transfer",
        description: "This is a standard ERC-20 token transfer.",
        severity: "info",
        category: "review",
      }));
    }

    if (tx.data.toLowerCase().startsWith("0x23b872dd")) {
      suggestions.push(makeSuggestion({
        title: "ERC-20 TransferFrom",
        description: "This is a transferFrom call, moving tokens from one address to another using an allowance.",
        severity: "info",
        category: "review",
      }));
    }

    if (tx.data.length > 1000) {
      suggestions.push(makeSuggestion({
        title: "Large Calldata",
        description: `Calldata is ${(tx.data.length - 2) / 2} bytes. Large calldata increases gas costs significantly.`,
        details: "Each non-zero byte costs 4 gas, each zero byte costs 1 gas. Consider compressing or optimizing the data.",
        severity: "suggestion",
        category: "gas",
      }));
    }
  }

  if (tx.gasPrice) {
    const gasPriceGwei = parseWei(tx.gasPrice) / 1e9;
    if (gasPriceGwei > 100) {
      suggestions.push(makeSuggestion({
        title: "High Gas Price",
        description: `Gas price is ${gasPriceGwei.toFixed(2)} Gwei. This is significantly above average.`,
        details: "Consider waiting for lower gas prices during off-peak hours. Use gas trackers to monitor network conditions.",
        severity: "warning",
        category: "gas",
      }));
    } else if (gasPriceGwei > 50) {
      suggestions.push(makeSuggestion({
        title: "Elevated Gas Price",
        description: `Gas price is ${gasPriceGwei.toFixed(2)} Gwei.`,
        severity: "info",
        category: "gas",
      }));
    }
  }

  if (!tx.to && tx.data && tx.data !== "0x") {
    suggestions.push(makeSuggestion({
      title: "Contract Deployment",
      description: "No recipient address means this transaction deploys a new contract.",
      details: "Ensure the bytecode is correct and the constructor arguments are properly encoded.",
      severity: "info",
      category: "review",
    }));
  }

  if (tx.to && tx.to.toLowerCase().startsWith("0x0000000000000000")) {
    suggestions.push(makeSuggestion({
      title: "Zero Address Target",
      description: "Sending to the zero address (0x000...000) will burn the ETH permanently.",
      severity: "critical",
      category: "security",
    }));
  }

  return suggestions;
}

export function resetTxIdCounter(): void {
  idCounter = 0;
}
