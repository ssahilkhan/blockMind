/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { RiskScoreCard } from "@/features/security/components/risk-score-card";
import { RecommendationPanel } from "@/features/security/components/recommendation-panel";
import { SecurityTimeline } from "@/features/security/components/security-timeline";
import type { RiskScore, RiskFinding, SecurityTimelineEntry } from "@/features/security/types";

const LOW_SCORE: RiskScore = {
  score: 90,
  level: "low",
  findings: [],
};

const CRITICAL_SCORE: RiskScore = {
  score: 20,
  level: "critical",
  findings: [
    {
      id: "f1",
      category: "approval",
      severity: "critical",
      title: "Unlimited Approvals",
      description: "Spender has unlimited access.",
      explanation: "This means all your tokens can be taken.",
      recommendation: "Revoke immediately.",
    },
  ],
};

const MOCK_FINDINGS: RiskFinding[] = [
  {
    id: "f1",
    category: "approval",
    severity: "high",
    title: "Unlimited Approvals",
    description: "Spender has unlimited access.",
    explanation: "This is dangerous.",
    recommendation: "Revoke approvals.",
  },
  {
    id: "f2",
    category: "status",
    severity: "low",
    title: "Minor Issue",
    description: "Not a big deal.",
    explanation: "Just a note.",
    recommendation: "Monitor.",
  },
];

const MOCK_TIMELINE: SecurityTimelineEntry[] = [
  {
    id: "t1",
    timestamp: Date.now(),
    type: "wallet",
    targetAddress: "0x" + "a".repeat(40),
    score: 85,
    level: "low",
    summary: "Wallet analysis: score 85/100 (low)",
  },
  {
    id: "t2",
    timestamp: Date.now() - 60000,
    type: "contract",
    targetAddress: "0x" + "b".repeat(40),
    score: 30,
    level: "high",
    summary: "Contract analysis: score 30/100 (high)",
  },
];

describe("RiskScoreCard", () => {
  it("renders score and level", () => {
    render(<RiskScoreCard score={LOW_SCORE} title="Test Score" />);
    expect(screen.getByText("90")).toBeInTheDocument();
    expect(screen.getByText("LOW")).toBeInTheDocument();
    expect(screen.getByText("0 finding(s)")).toBeInTheDocument();
  });

  it("renders title and subtitle", () => {
    render(
      <RiskScoreCard score={LOW_SCORE} title="Wallet Risk" subtitle="0xabc..." />,
    );
    expect(screen.getByText("Wallet Risk")).toBeInTheDocument();
    expect(screen.getByText("0xabc...")).toBeInTheDocument();
  });

  it("renders critical score", () => {
    render(<RiskScoreCard score={CRITICAL_SCORE} title="Critical" />);
    expect(screen.getByText("CRITICAL")).toBeInTheDocument();
    expect(screen.getByText("1 finding(s)")).toBeInTheDocument();
  });
});

describe("RecommendationPanel", () => {
  it("renders recommendations", () => {
    render(
      <RecommendationPanel
        recommendations={["Revoke approvals", "Verify contract"]}
        findings={[]}
      />,
    );
    expect(screen.getByText("Recommendations")).toBeInTheDocument();
    expect(screen.getByText("Revoke approvals")).toBeInTheDocument();
    expect(screen.getByText("Verify contract")).toBeInTheDocument();
  });

  it("renders critical findings", () => {
    render(
      <RecommendationPanel recommendations={[]} findings={MOCK_FINDINGS} />,
    );
    expect(screen.getByText("Critical Findings")).toBeInTheDocument();
    expect(screen.getByText("Unlimited Approvals")).toBeInTheDocument();
    expect(screen.getByText("What does this mean?")).toBeInTheDocument();
  });

  it("shows safe state when no recommendations", () => {
    render(<RecommendationPanel recommendations={[]} findings={[]} />);
    expect(screen.getByText(/No immediate actions/)).toBeInTheDocument();
  });
});

describe("SecurityTimeline", () => {
  it("shows empty state", () => {
    render(<SecurityTimeline entries={[]} />);
    expect(screen.getByText(/No security findings yet/)).toBeInTheDocument();
  });

  it("renders entries", () => {
    render(<SecurityTimeline entries={MOCK_TIMELINE} />);
    expect(screen.getByText("Security Timeline")).toBeInTheDocument();
    expect(screen.getByText("WALLET")).toBeInTheDocument();
    expect(screen.getByText("CONTRACT")).toBeInTheDocument();
    expect(screen.getByText("85/100")).toBeInTheDocument();
    expect(screen.getByText("30/100")).toBeInTheDocument();
  });
});
