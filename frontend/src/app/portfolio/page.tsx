"use client";

import { DashboardLayout } from "@/components/layout";
import { PortfolioIntelligenceDashboard } from "@/features/portfolio-intelligence/components/portfolio-intelligence-dashboard";

function PortfolioContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Portfolio Intelligence</h2>
        <p className="text-sm text-muted-foreground">
          AI-powered portfolio analysis with insights, trends, and recommendations.
        </p>
      </div>

      <PortfolioIntelligenceDashboard />
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <DashboardLayout>
      <PortfolioContent />
    </DashboardLayout>
  );
}
