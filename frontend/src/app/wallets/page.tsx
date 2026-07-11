"use client";

import { DashboardLayout } from "@/components/layout";
import { CreateWallet, ImportWallet } from "./components/create-import-wallet";
import { WalletDetails } from "./components/wallet-details";
import { ValidateAddress } from "./components/validate-address";
import { SignMessage } from "./components/sign-message";
import { VerifySignature } from "./components/verify-signature";

function WalletsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Wallet Workspace</h2>
        <p className="text-sm text-muted-foreground">
          Create, import, and interact with Ethereum wallets.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CreateWallet />
        <ImportWallet />
      </div>

      <WalletDetails />

      <div className="grid gap-6 lg:grid-cols-2">
        <ValidateAddress />
        <SignMessage />
      </div>

      <VerifySignature />
    </div>
  );
}

export default function WalletsPage() {
  return (
    <DashboardLayout>
      <WalletsContent />
    </DashboardLayout>
  );
}
