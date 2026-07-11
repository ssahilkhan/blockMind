"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Lightbulb, Hand, AlertTriangle, Info } from "lucide-react";
import type { PortfolioRecommendation } from "../types";
import { PRIORITY_COLORS } from "../types";

interface RecommendationsPanelProps {
  recommendations: PortfolioRecommendation[];
}

const CATEGORY_ICONS: Record<PortfolioRecommendation["category"], typeof Shield> = {
  security: Shield,
  optimization: Zap,
  insight: Lightbulb,
  action: Hand,
};

export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <Info className="h-8 w-8 mx-auto text-green-500 mb-2" />
          <p className="text-sm text-muted-foreground">
            No recommendations at this time. Portfolio looks healthy.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Recommendations ({recommendations.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec) => {
          const Icon = CATEGORY_ICONS[rec.category] ?? AlertTriangle;
          return (
            <div
              key={rec.id}
              className="p-3 rounded-lg border border-border bg-card space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium flex-1">{rec.title}</span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${PRIORITY_COLORS[rec.priority]}`}>
                  {rec.priority.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {rec.description}
              </p>
              {rec.action && (
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  Action: {rec.action}
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
