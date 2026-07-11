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

export interface TokenData {
  address: string;
  standard: string;
  name: string | null;
  symbol: string | null;
  totalSupply: string | null;
  hasMintCapability: boolean;
  hasApprovalRisks: boolean;
  holderCount: number;
  topHolderPercentage: number;
  isVerified: boolean;
}

export function analyzeToken(data: TokenData): RiskScore {
  const findings: RiskFinding[] = [];

  if (!data.isVerified) {
    findings.push(
      createFinding(
        "verification",
        "high",
        "Token Contract Not Verified",
        "The token contract source code is not verified.",
        "An unverified token contract cannot be audited. The actual behavior may differ from what is displayed.",
        "Do not hold significant value in unverified tokens. Check for verified alternatives.",
      ),
    );
  }

  if (data.hasMintCapability) {
    findings.push(
      createFinding(
        "mint",
        "high",
        "Mint Capability Detected",
        "The token contract has an active mint function.",
        "If minting is not properly restricted, the supply can be increased arbitrarily, diluting existing holders.",
        "Check who controls minting. Verify if there are supply caps or time locks.",
      ),
    );
  }

  if (data.topHolderPercentage > 50) {
    findings.push(
      createFinding(
        "concentration",
        "high",
        "High Token Concentration",
        `Top holder(s) control ${data.topHolderPercentage}% of supply.`,
        "High concentration means a few wallets can crash the price or manipulate the market at will.",
        "Be cautious with heavily concentrated tokens. Check if large holders are locked or vesting.",
      ),
    );
  } else if (data.topHolderPercentage > 30) {
    findings.push(
      createFinding(
        "concentration",
        "medium",
        "Moderate Token Concentration",
        `Top holder(s) control ${data.topHolderPercentage}% of supply.`,
        "Moderate concentration means some holders have significant influence over the token.",
        "Monitor large holder movements. Consider position size relative to concentration risk.",
      ),
    );
  }

  if (data.hasApprovalRisks) {
    findings.push(
      createFinding(
        "approval",
        "medium",
        "Known Approval Vulnerabilities",
        "This token type is known to have approval-related risks.",
        "Some token standards have approval race conditions or permit vulnerabilities that can be exploited.",
        "Use increaseAllowance/decreaseAllowance when available. Approve only necessary amounts.",
      ),
    );
  }

  if (data.holderCount < 10 && data.holderCount > 0) {
    findings.push(
      createFinding(
        "adoption",
        "medium",
        "Very Low Holder Count",
        `Only ${data.holderCount} holder(s) found.`,
        "Low holder count suggests limited adoption and higher volatility risk.",
        "Treat this as a high-risk speculative asset. Do not invest more than you can afford to lose.",
      ),
    );
  }

  if (data.totalSupply === "0" || data.totalSupply === null) {
    findings.push(
      createFinding(
        "supply",
        "low",
        "Zero or Unknown Supply",
        "Total supply is zero or could not be determined.",
        "A token with zero supply may be paused, burned, or malfunctioning.",
        "Verify the token is active before trading.",
      ),
    );
  }

  const standardRisks: Record<string, RiskLevel> = {
    ERC20: "low",
    ERC721: "low",
    ERC1155: "low",
  };
  if (!(data.standard in standardRisks) && data.standard !== "unknown") {
    findings.push(
      createFinding(
        "standard",
        "medium",
        "Non-Standard Token",
        `Token uses ${data.standard} standard.`,
        "Non-standard tokens may not be compatible with common tools and wallets, increasing risk of loss.",
        "Verify compatibility with your wallet and DEX before trading.",
      ),
    );
  }

  return scoreFromFindings(findings);
}
