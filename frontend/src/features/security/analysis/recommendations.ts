import type { RiskFinding, AnalysisType } from "../types";

export function generateRecommendations(
  findings: RiskFinding[],
  type: AnalysisType,
): string[] {
  const recommendations: string[] = [];

  for (const finding of findings) {
    if (finding.severity === "critical" || finding.severity === "high") {
      recommendations.push(finding.recommendation);
    }
  }

  const categorySet = new Set(findings.map((f) => f.category));

  if (categorySet.has("approval")) {
    recommendations.push(
      "Review and revoke unnecessary token approvals using a revocation tool.",
    );
  }

  if (categorySet.has("verification")) {
    recommendations.push(
      "Only interact with verified contracts and tokens.",
    );
  }

  if (categorySet.has("access")) {
    recommendations.push(
      "Verify access control mechanisms before depositing funds.",
    );
  }

  if (type === "wallet") {
    recommendations.push(
      "Consider using a hardware wallet for high-value assets.",
    );
  }

  if (type === "contract") {
    recommendations.push(
      "Monitor the contract for suspicious events and ownership changes.",
    );
  }

  if (type === "transaction") {
    recommendations.push(
      "Double-check all transaction details before confirming.",
    );
  }

  if (type === "token") {
    recommendations.push(
      "Diversify holdings to reduce exposure to single-token risk.",
    );
  }

  const unique = [...new Set(recommendations)];
  return unique.slice(0, 8);
}
