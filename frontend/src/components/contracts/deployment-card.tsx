"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rocket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deploySchema, type DeployInput } from "@/lib/validators/contract";
import type { CompiledContract } from "@/types/contract";

interface DeploymentCardProps {
  compiled: CompiledContract;
  onDeploy: (params: {
    abi: unknown[];
    bytecode: string;
    args?: unknown[];
    privateKey: string;
  }) => void;
  isPending: boolean;
}

export function DeploymentCard({ compiled, onDeploy, isPending }: DeploymentCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeployInput>({
    resolver: zodResolver(deploySchema),
    defaultValues: { constructorArgs: "", privateKey: "" },
  });

  const onSubmit = (data: DeployInput) => {
    let args: unknown[] | undefined;
    if (data.constructorArgs?.trim()) {
      try {
        args = JSON.parse(data.constructorArgs);
      } catch {
        return;
      }
    }
    onDeploy({
      abi: compiled.abi,
      bytecode: compiled.bytecode,
      args,
      privateKey: data.privateKey,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Rocket className="h-4 w-4" />
          Deploy Contract
        </CardTitle>
        <CardDescription>
          Deploy {compiled.contractName} to the network
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="deploy-pk">Private Key</Label>
            <Input
              id="deploy-pk"
              type="password"
              placeholder="0x..."
              {...register("privateKey")}
            />
            {errors.privateKey && (
              <p className="text-xs text-destructive">{errors.privateKey.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="deploy-args">Constructor Arguments (JSON array, optional)</Label>
            <Input
              id="deploy-args"
              placeholder='[1, "hello", true]'
              {...register("constructorArgs")}
            />
            {errors.constructorArgs && (
              <p className="text-xs text-destructive">{errors.constructorArgs.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Deploying..." : "Deploy"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
