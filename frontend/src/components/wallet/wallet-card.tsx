"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AddressField } from "./address-field";

interface WalletCardProps {
  address: string;
  network: string;
  balance?: string;
  nonce?: number;
}

export function WalletCard({ address, network, balance, nonce }: WalletCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Wallet</CardTitle>
        <CardDescription>{network}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <AddressField label="Address" value={address} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Balance</p>
            <p className="text-sm font-semibold">{balance ?? "--"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Nonce</p>
            <p className="text-sm font-semibold">{nonce ?? "--"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
