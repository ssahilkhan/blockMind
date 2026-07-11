"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Search } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ContractEditor,
  CompileCard,
  DeploymentCard,
  FunctionList,
  FunctionInvoker,
  EventViewer,
  CalldataEncoder,
  CalldataDecoder,
  ContractHistory,
} from "@/components/contracts";
import { contractApi } from "@/services/contract";
import { useContractStudioStore } from "@/stores/contract-studio-store";
import {
  interactSchema,
  type InteractInput,
} from "@/lib/validators/contract";
import type { CompiledContract } from "@/types/contract";
import type { AbiFunction } from "@/types/contract";

function CompileTab() {
  const [source, setSource] = useState("");
  const [compileResult, setCompileResult] = useState<CompiledContract | null>(null);
  const [compileErrors, setCompileErrors] = useState<string[]>([]);
  const { addCompiled, deployedContracts } = useContractStudioStore();

  const compileMutation = useMutation({
    mutationFn: (src: string) => contractApi.compile(src),
    onSuccess: (data) => {
      if (Array.isArray(data) && data.length > 0) {
        const res = data[0];
        const compiled: CompiledContract = {
          contractName: res.contractName,
          abi: res.abi,
          bytecode: res.bytecode,
        };
        setCompileResult(compiled);
        setCompileErrors([]);
        addCompiled(compiled);
      } else {
        setCompileResult(null);
        setCompileErrors(["No contracts produced from compilation."]);
      }
    },
    onError: (err: Error) => {
      setCompileResult(null);
      setCompileErrors([err.message]);
    },
  });

  const deployMutation = useMutation({
    mutationFn: (params: {
      abi: unknown[];
      bytecode: string;
      args?: unknown[];
      privateKey: string;
    }) => contractApi.deploy(params),
  });

  const handleCompile = () => {
    compileMutation.mutate(source);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <ContractEditor
          value={source}
          onChange={setSource}
          onCompile={handleCompile}
          isCompiling={compileMutation.isPending}
        />
        <CompileCard result={compileResult} errors={compileErrors} />
      </div>

      {compileResult && (
        <DeploymentCard
          compiled={compileResult}
          onDeploy={(data) => deployMutation.mutate(data)}
          isPending={deployMutation.isPending}
        />
      )}

      {deployMutation.isError && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">
              Deployment failed: {deployMutation.error.message}
            </p>
          </CardContent>
        </Card>
      )}

      {deployMutation.data && (
        <Card>
          <CardContent className="pt-6 space-y-2">
            <p className="flex items-center gap-2 text-sm font-medium text-green-600">
              <CheckCircle className="h-4 w-4" />
              Contract Deployed Successfully
            </p>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Contract Address</p>
              <code className="block break-all rounded bg-muted px-2 py-1 font-mono text-xs">
                {deployMutation.data.contractAddress}
              </code>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Transaction Hash</p>
              <code className="block break-all rounded bg-muted px-2 py-1 font-mono text-xs">
                {deployMutation.data.transactionHash}
              </code>
            </div>
          </CardContent>
        </Card>
      )}

      <ContractHistory contracts={deployedContracts} />
    </div>
  );
}

function InteractTab() {
  const [selectedAbi, setSelectedAbi] = useState<unknown[] | null>(null);
  const [contractAddress, setContractAddress] = useState("");
  const [selectedFn, setSelectedFn] = useState<AbiFunction | null>(null);
  const { deployedContracts } = useContractStudioStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InteractInput>({
    resolver: zodResolver(interactSchema),
  });

  const onSubmit = (data: InteractInput) => {
    try {
      const abi = JSON.parse(data.abi);
      setSelectedAbi(abi);
      setContractAddress(data.address);
      setSelectedFn(null);
    } catch {
      // validation should catch this
    }
  };

  const handleSelectFromSession = (addr: string, abi: unknown[]) => {
    setContractAddress(addr);
    setSelectedAbi(abi);
    setSelectedFn(null);
    reset({ address: addr, abi: JSON.stringify(abi) });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Search className="h-4 w-4" />
            Contract Lookup
          </CardTitle>
        </CardHeader>
        <CardContent>
          {deployedContracts.length > 0 && (
            <div className="mb-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Session Contracts
              </p>
              <div className="flex flex-wrap gap-2">
                {deployedContracts.map((c) => (
                  <Button
                    key={c.address}
                    variant={contractAddress === c.address ? "default" : "outline"}
                    size="sm"
                    className="font-mono text-xs"
                    onClick={() => handleSelectFromSession(c.address, c.abi)}
                  >
                    {c.name} ({c.address.slice(0, 8)}...)
                  </Button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="int-addr">Contract Address</Label>
              <Input
                id="int-addr"
                placeholder="0x..."
                {...register("address")}
              />
              {errors.address && (
                <p className="text-xs text-destructive">{errors.address.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="int-abi">ABI (JSON array)</Label>
              <Input
                id="int-abi"
                placeholder='[{"type":"function",...}]'
                {...register("abi")}
              />
              {errors.abi && (
                <p className="text-xs text-destructive">{errors.abi.message}</p>
              )}
            </div>
            <Button type="submit" size="sm">
              <Search className="mr-1 h-3 w-3" />
              Load Contract
            </Button>
          </form>
        </CardContent>
      </Card>

      {selectedAbi && contractAddress && (
        <div className="grid gap-6 lg:grid-cols-2">
          <FunctionList
            abi={selectedAbi}
            onSelectFunction={setSelectedFn}
            selectedName={selectedFn?.name ?? null}
          />
          {selectedFn && (
            <FunctionInvoker
              fn={selectedFn}
              abi={selectedAbi}
              contractAddress={contractAddress}
            />
          )}
        </div>
      )}
    </div>
  );
}

function EncodeDecodeTab() {
  const { compiledContracts } = useContractStudioStore();
  const latestAbi = compiledContracts[0]?.abi;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <CalldataEncoder abi={latestAbi} />
      <CalldataDecoder abi={latestAbi} />
    </div>
  );
}

function EventsTab() {
  const { compiledContracts } = useContractStudioStore();
  const latestAbi = compiledContracts[0]?.abi;

  return (
    <EventViewer defaultAbi={latestAbi} />
  );
}

export default function ContractsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Smart Contract Studio</h2>
          <p className="text-sm text-muted-foreground">
            Compile, deploy, and interact with smart contracts.
          </p>
        </div>

        <Tabs defaultValue="compile">
          <TabsList variant="line">
            <TabsTrigger value="compile">Compile & Deploy</TabsTrigger>
            <TabsTrigger value="interact">Interact</TabsTrigger>
            <TabsTrigger value="encode">Encode / Decode</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="compile">
              <CompileTab />
            </TabsContent>
            <TabsContent value="interact">
              <InteractTab />
            </TabsContent>
            <TabsContent value="encode">
              <EncodeDecodeTab />
            </TabsContent>
            <TabsContent value="events">
              <EventsTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
