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

export interface TransactionData {
  hash: string;
  status: "success" | "failed" | "pending";
  from: string;
  to: string | null;
  value: string;
  gasUsed: string;
  gasPrice: string;
  isContractVerified: boolean;
  eventCount: number;
  averageGasPrice: string;
}

export function analyzeTransaction(data: TransactionData): RiskScore {
  const findings: RiskFinding[] = [];

  if (data.status === "failed") {
    findings.push(
      createFinding(
        "status",
        "high",
        "Transaction Failed",
        "This transaction reverted or failed.",
        "A failed transaction means the intended operation did not complete. Gas was still consumed. " +
          "If you were trying to send tokens or interact with a contract, the action did not succeed.",
        "Check the revert reason. Do not retry without understanding why it failed.",
      ),
    );
  }

  if (data.to === null) {
    findings.push(
      createFinding(
        "deployment",
        "medium",
        "Contract Deployment",
        "This transaction deploys a new contract.",
        "Contract deployments create new on-chain code. The deployed contract may have vulnerabilities " +
          "or behave unexpectedly.",
        "Review the contract source code before interacting with it. Check if it is verified.",
      ),
    );
  }

  if (!data.isContractVerified && data.to !== null) {
    findings.push(
      createFinding(
        "verification",
        "high",
        "Interaction with Unverified Contract",
        "The target contract is not verified.",
        "Interacting with unverified contracts means you cannot confirm what code will execute with your funds.",
        "Verify the contract source code before sending funds or signing transactions.",
      ),
    );
  }

  const gasUsedNum = parseInt(data.gasUsed, 10);
  const avgGasNum = parseInt(data.averageGasPrice, 10);
  if (avgGasNum > 0 && gasUsedNum > avgGasNum * 3) {
    findings.push(
      createFinding(
        "gas",
        "medium",
        "High Gas Usage",
        `Gas used (${gasUsedNum}) is significantly above average (${avgGasNum}).`,
        "Abnormally high gas usage may indicate complex or unusual contract logic executing.",
        "Review what operations were performed. High gas is not always a risk, but worth investigating.",
      ),
    );
  }

  const valueNum = parseFloat(data.value);
  if (valueNum > 100) {
    findings.push(
      createFinding(
        "value",
        "medium",
        "Large Value Transfer",
        `Transaction transfers ${valueNum} ETH.`,
        "Large transfers attract attention. Verify this was intentional and sent to the correct address.",
        "Double-check the recipient address. Consider using a test transaction first for large amounts.",
      ),
    );
  }

  if (data.status === "pending") {
    findings.push(
      createFinding(
        "status",
        "low",
        "Transaction Pending",
        "This transaction has not been confirmed yet.",
        "Pending transactions can be stuck, replaced, or dropped. Do not assume the transaction will complete.",
        "Monitor the transaction status. If stuck, consider replacing with a higher gas price.",
      ),
    );
  }

  return scoreFromFindings(findings);
}
