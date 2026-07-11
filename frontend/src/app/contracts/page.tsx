"use client";

import { DashboardLayout } from "@/components/layout";
import { FileCode2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ContractsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Contracts</h2>
        <p className="text-sm text-muted-foreground">
          Compile, deploy, and interact with smart contracts.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Deployed Contracts
            </CardTitle>
            <FileCode2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">--</div>
          </CardContent>
        </Card>
        <Card className="col-span-full">
          <CardContent className="pt-6 text-center text-sm text-muted-foreground">
            Contract management coming soon.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ContractsPage() {
  return (
    <DashboardLayout>
      <ContractsContent />
    </DashboardLayout>
  );
}
