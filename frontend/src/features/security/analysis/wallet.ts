import type { RiskFinding, RiskScore, RiskLevel } from "../types";

let findingCounter = 0;

function createFinding(
  category: string,
  severity: RiskLevel,
  title: string,
  description: string,
  explanation: string,
  recommendation: string,
): RiskFinding {
  findingCounter++;
  return {
    id: `finding-${findingCounter}`,
    category,
    severity,
    title,
    description,
    explanation,
    recommendation,
  };
}

function scoreFromFindings(findings: RiskFinding[]): RiskScore {
  let penalty = 0;
  for (const f of findings) {
    if (f.severity === "critical") penalty += 30;
    else if (f.severity === "high") penalty += 20;
    else if (f.severity === "medium") penalty += 10;
    else penalty += 3;
  }
  const score = Math.max(0, Math.min(100, 100 - penalty));
  let level: RiskLevel = "low";
  if (score < 25) level = "critical";
  else if (score < 50) level = "high";
  else if (score < 75) level = "medium";
  return { score, level, findings };
}

export interface WalletData {
  address: string;
  balance: string;
  tokenCount: number;
  nftCount: number;
  transactionCount: number;
  contractInteractions: number;
  approvals: Array<{ spender: string; amount: string; unlimited: boolean }>;
  recentTransfers: Array<{ value: string; timestamp: number }>;
  inactiveDays: number;
}

export function analyzeWallet(data: WalletData): RiskScore {
  const findings: RiskFinding[] = [];

  const unlimitedApprovals = data.approvals.filter((a) => a.unlimited);
  if (unlimitedApprovals.length > 0) {
    findings.push(
      createFinding(
        "approval",
        "high",
        "Unlimited Token Approvals",
        `${unlimitedApprovals.length} spender(s) have unlimited approval.`,
        "Unlimited approvals allow a spender to transfer any amount of your tokens at any time. " +
          "If the spender contract is compromised, all your tokens could be stolen.",
        "Revoke unlimited approvals for contracts you no longer use. " +
          "Grant minimum necessary amounts instead.",
      ),
    );
  }

  if (data.approvals.length > 10) {
    findings.push(
      createFinding(
        "approval",
        "medium",
        "Excessive Approvals",
        `${data.approvals.length} active approvals found.`,
        "Each active approval is a potential attack vector. The more approvals, the larger the attack surface.",
        "Review and revoke approvals for contracts you no longer interact with.",
      ),
    );
  }

  if (data.contractInteractions > 50) {
    findings.push(
      createFinding(
        "activity",
        "medium",
        "High Contract Interaction Count",
        `This wallet has interacted with ${data.contractInteractions} contracts.`,
        "Interacting with many contracts increases exposure to potential vulnerabilities in any of those contracts.",
        "Review which contracts you still need. Consider using a fresh wallet for high-value assets.",
      ),
    );
  }

  const largeTransfers = data.recentTransfers.filter((t) => {
    const val = parseFloat(t.value);
    return val > 10;
  });
  if (largeTransfers.length > 0) {
    findings.push(
      createFinding(
        "transfer",
        "medium",
        "Large Value Transfers Detected",
        `${largeTransfers.length} transfer(s) with high value found.`,
        "Large transfers may indicate significant fund movements. Verify these were intentional.",
        "Double-check recent large transfers. If unexpected, secure your private keys immediately.",
      ),
    );
  }

  if (data.inactiveDays > 180) {
    findings.push(
      createFinding(
        "activity",
        "low",
        "Inactive Wallet",
        `No activity for ${data.inactiveDays} days.`,
        "Long-inactive wallets with existing approvals or balances may be targeted by attackers who " +
          "monitor on-chain activity.",
        "If you still use this wallet, make a small transaction to maintain activity. " +
          "Otherwise, migrate assets to an active wallet.",
      ),
    );
  }

  if (data.transactionCount === 0 && parseFloat(data.balance) > 0) {
    findings.push(
      createFinding(
        "activity",
        "low",
        "Funded but Never Used",
        "Wallet has balance but zero transactions.",
        "This is unusual and may indicate a cold storage wallet or a receiving-only address.",
        "Ensure this wallet is intentionally passive. Consider transferring to a wallet with proper security practices.",
      ),
    );
  }

  return scoreFromFindings(findings);
}
