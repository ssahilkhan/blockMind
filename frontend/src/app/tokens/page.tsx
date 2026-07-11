"use client";

import { DashboardLayout } from "@/components/layout";
import { Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function TokensContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tokens</h2>
        <p className="text-sm text-muted-foreground">
          Explore ERC20, ERC721, and ERC1155 tokens.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Token Standards
            </CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">--</div>
          </CardContent>
        </Card>
        <Card className="col-span-full">
          <CardContent className="pt-6 text-center text-sm text-muted-foreground">
            Token explorer coming soon.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function TokensPage() {
  return (
    <DashboardLayout>
      <TokensContent />
    </DashboardLayout>
  );
}
