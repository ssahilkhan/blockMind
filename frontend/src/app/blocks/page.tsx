"use client";

import { DashboardLayout } from "@/components/layout";
import { Box } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function BlocksContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Blocks</h2>
        <p className="text-sm text-muted-foreground">
          Browse blockchain blocks and their details.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Latest Block
            </CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">--</div>
          </CardContent>
        </Card>
        <Card className="col-span-full">
          <CardContent className="pt-6 text-center text-sm text-muted-foreground">
            Block explorer coming soon.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function BlocksPage() {
  return (
    <DashboardLayout>
      <BlocksContent />
    </DashboardLayout>
  );
}
