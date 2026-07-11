"use client";

import { DashboardLayout } from "@/components/layout";
import { PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function PortfolioContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Portfolio</h2>
        <p className="text-sm text-muted-foreground">
          Aggregate assets and track portfolio performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Value
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">--</div>
          </CardContent>
        </Card>
        <Card className="col-span-full">
          <CardContent className="pt-6 text-center text-sm text-muted-foreground">
            Portfolio tracker coming soon.
          </CardContent>
        </Card>
      </div>
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
