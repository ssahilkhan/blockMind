"use client";

import { Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GasEstimate } from "@/services/transaction";

interface GasEstimateCardProps {
  estimate: GasEstimate | null;
  isLoading: boolean;
}

export function GasEstimateCard({ estimate, isLoading }: GasEstimateCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calculator className="h-4 w-4" />
          Gas Estimation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <p className="text-sm text-muted-foreground">Estimating gas...</p>
        )}

        {!isLoading && !estimate && (
          <p className="text-sm text-muted-foreground">
            Enter a transaction and click Estimate Gas.
          </p>
        )}

        {estimate && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Gas Limit</p>
                <p className="text-sm font-semibold">{estimate.gasEstimation}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Gas (Wei)</p>
                <p className="text-sm font-semibold">{estimate.gasEstimationWei}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
