"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressField, CopyButton } from "@/components/wallet";
import { walletApi } from "@/services";
import {
  importPrivateKeySchema,
  importMnemonicSchema,
  type ImportPrivateKeyInput,
  type ImportMnemonicInput,
} from "@/lib/validators";
import type { CreatedWallet } from "@/types/api";

function WalletResult({ wallet }: { wallet: CreatedWallet }) {
  return (
    <div className="space-y-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950/30">
      <div className="flex items-center gap-2 text-sm font-medium text-yellow-800 dark:text-yellow-400">
        <AlertTriangle className="h-4 w-4" />
        Save these credentials now. They will not be shown again.
      </div>
      <div className="space-y-2">
        <AddressField label="Address" value={wallet.address} />
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Public Key</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-muted px-2 py-1 font-mono text-xs break-all">
              {wallet.publicKey}
            </code>
            <CopyButton value={wallet.publicKey} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Private Key</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-muted px-2 py-1 font-mono text-xs break-all">
              {wallet.privateKey}
            </code>
            <CopyButton value={wallet.privateKey} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Mnemonic</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-muted px-2 py-1 font-mono text-xs break-all">
              {wallet.mnemonic}
            </code>
            <CopyButton value={wallet.mnemonic} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Derivation Path</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-muted px-2 py-1 font-mono text-xs">
              {wallet.path}
            </code>
            <CopyButton value={wallet.path} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CreateWallet() {
  const [result, setResult] = useState<CreatedWallet | null>(null);

  const { mutate, isPending, error } = useMutation({
    mutationFn: walletApi.createWallet,
    onSuccess: (data) => setResult(data),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Create Wallet</CardTitle>
        <CardDescription>Generate a new random wallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {result && <WalletResult wallet={result} />}
        {error && (
          <p className="text-sm text-destructive">
            Failed to create wallet. Please try again.
          </p>
        )}
        <Button onClick={() => mutate()} disabled={isPending}>
          <Plus className="mr-2 h-4 w-4" />
          {isPending ? "Creating..." : "Create Wallet"}
        </Button>
      </CardContent>
    </Card>
  );
}

export function ImportWallet() {
  const [importResult, setImportResult] = useState<{
    address: string;
    publicKey: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"privateKey" | "mnemonic">("privateKey");

  const {
    register: registerPrivateKey,
    handleSubmit: handleSubmitPrivateKey,
    formState: { errors: pkErrors },
  } = useForm<ImportPrivateKeyInput>({
    resolver: zodResolver(importPrivateKeySchema),
  });

  const {
    register: registerMnemonic,
    handleSubmit: handleSubmitMnemonic,
    formState: { errors: mnErrors },
  } = useForm<ImportMnemonicInput>({
    resolver: zodResolver(importMnemonicSchema),
  });

  const pkMutation = useMutation({
    mutationFn: walletApi.importFromPrivateKey,
    onSuccess: (data) => setImportResult(data),
  });

  const mnMutation = useMutation({
    mutationFn: walletApi.importFromMnemonic,
    onSuccess: (data) => setImportResult({ address: data.address, publicKey: data.publicKey }),
  });

  const isPending = pkMutation.isPending || mnMutation.isPending;
  const error = pkMutation.error || mnMutation.error;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Import Wallet</CardTitle>
        <CardDescription>Import using a private key or mnemonic phrase</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant={activeTab === "privateKey" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("privateKey")}
          >
            Private Key
          </Button>
          <Button
            variant={activeTab === "mnemonic" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("mnemonic")}
          >
            Mnemonic
          </Button>
        </div>

        {activeTab === "privateKey" && (
          <form
            onSubmit={handleSubmitPrivateKey((data) => pkMutation.mutate(data.privateKey))}
            className="space-y-3"
          >
            <div className="space-y-1.5">
              <Label htmlFor="import-pk">Private Key</Label>
              <Input
                id="import-pk"
                placeholder="0x..."
                {...registerPrivateKey("privateKey")}
              />
              {pkErrors.privateKey && (
                <p className="text-xs text-destructive">{pkErrors.privateKey.message}</p>
              )}
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Importing..." : "Import"}
            </Button>
          </form>
        )}

        {activeTab === "mnemonic" && (
          <form
            onSubmit={handleSubmitMnemonic((data) => mnMutation.mutate(data.mnemonic))}
            className="space-y-3"
          >
            <div className="space-y-1.5">
              <Label htmlFor="import-mn">Mnemonic Phrase</Label>
              <Input
                id="import-mn"
                placeholder="word1 word2 word3 ..."
                {...registerMnemonic("mnemonic")}
              />
              {mnErrors.mnemonic && (
                <p className="text-xs text-destructive">{mnErrors.mnemonic.message}</p>
              )}
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Importing..." : "Import"}
            </Button>
          </form>
        )}

        {error && (
          <p className="text-sm text-destructive">
            Failed to import wallet. Please check your input.
          </p>
        )}

        {importResult && (
          <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
            <p className="text-sm font-medium text-green-600">Wallet imported successfully</p>
            <AddressField label="Address" value={importResult.address} />
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Public Key</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-muted px-2 py-1 font-mono text-xs break-all">
                  {importResult.publicKey}
                </code>
                <CopyButton value={importResult.publicKey} />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
