"use client";

import { DashboardLayout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "@/components/explorer";

function TransactionsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
        <p className="text-sm text-muted-foreground">
          Search for a transaction by its hash.
        </p>
      </div>

      <SearchBar placeholder="Enter transaction hash (0x...)..." />

      <Card>
        <CardContent className="pt-6 text-center text-sm text-muted-foreground">
          Enter a transaction hash above to view its details. Transactions can also
          be found on block detail pages.
        </CardContent>
      </Card>
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <DashboardLayout>
      <TransactionsContent />
    </DashboardLayout>
  );
}
