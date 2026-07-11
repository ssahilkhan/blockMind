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

export interface ContractData {
  address: string;
  solidityVersion: string | null;
  owner: string | null;
  isUpgradeable: boolean;
  isProxy: boolean;
  hasPause: boolean;
  hasMint: boolean;
  hasBurn: boolean;
  hasAccessControl: boolean;
  isVerified: boolean;
  bytecodeLength: number;
}

export function analyzeContract(data: ContractData): RiskScore {
  const findings: RiskFinding[] = [];

  if (!data.isVerified) {
    findings.push(
      createFinding(
        "verification",
        "high",
        "Contract Not Verified",
        "Source code is not verified on-chain.",
        "An unverified contract cannot be independently audited. You cannot confirm what the bytecode actually does.",
        "Do not interact with unverified contracts unless you trust the deployer. Verify source code before signing transactions.",
      ),
    );
  }

  if (data.isUpgradeable) {
    findings.push(
      createFinding(
        "upgradeability",
        "medium",
        "Upgradeable Contract",
        "This contract uses an upgradeable pattern.",
        "An upgradeable contract can have its logic changed by the owner. This means the contract " +
          "you audit today could behave differently tomorrow.",
        "Check who controls upgrades. Monitor for upgrade events. Consider the trust assumptions.",
      ),
    );
  }

  if (data.isProxy) {
    findings.push(
      createFinding(
        "proxy",
        "medium",
        "Proxy Contract Detected",
        "This is a proxy contract delegating calls to an implementation.",
        "Proxy contracts add a layer of indirection. The actual logic lives in a separate implementation contract " +
          "that can be changed.",
        "Verify both the proxy and implementation contracts. Check the admin who can upgrade.",
      ),
    );
  }

  if (data.hasMint && !data.hasAccessControl) {
    findings.push(
      createFinding(
        "mint",
        "critical",
        "Mint Function Without Access Control",
        "Anyone can mint new tokens.",
        "If minting is unrestricted, anyone can create new tokens, diluting the supply and stealing value.",
        "Do not hold value in this contract. Report to the deployer immediately.",
      ),
    );
  }

  if (data.hasMint && data.hasAccessControl) {
    findings.push(
      createFinding(
        "mint",
        "medium",
        "Mint Function Present",
        "The contract has a mint function with access control.",
        "Controlled minting is normal for many tokens, but the owner can increase supply at any time.",
        "Check the mint limits and who has minting authority.",
      ),
    );
  }

  if (!data.hasAccessControl) {
    findings.push(
      createFinding(
        "access",
        "high",
        "No Access Control",
        "Critical functions lack access control.",
        "Without access control, any address can call administrative functions, potentially draining funds.",
        "Do not deposit funds into contracts without proper access control.",
      ),
    );
  }

  if (data.hasPause) {
    findings.push(
      createFinding(
        "pause",
        "low",
        "Pause Function Present",
        "The contract owner can pause operations.",
        "Pausing is a safety feature but also means the owner can freeze your funds or prevent transfers.",
        "Understand the pause conditions. Check if funds can be withdrawn during a pause.",
      ),
    );
  }

  if (!data.owner && !data.hasAccessControl) {
    findings.push(
      createFinding(
        "ownership",
        "medium",
        "No Owner and No Access Control",
        "The contract has no identifiable owner or access control.",
        "This could mean the contract is truly decentralized, or it could mean administrative functions are unprotected.",
        "Verify the contract design. Check if there are any unprotected functions.",
      ),
    );
  }

  const oldVersions = ["0.4", "0.5", "0.6"];
  if (data.solidityVersion && oldVersions.some((v) => data.solidityVersion!.startsWith(v))) {
    findings.push(
      createFinding(
        "compiler",
        "medium",
        "Outdated Solidity Version",
        `Compiled with Solidity ${data.solidityVersion}.`,
        "Older Solidity versions may contain known bugs or lack security features present in newer versions.",
        "Check if the contract uses safe patterns despite the older compiler version.",
      ),
    );
  }

  return scoreFromFindings(findings);
}
