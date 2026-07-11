"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Filter, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { blockRangeSchema, type BlockRangeInput } from "@/lib/validators/events";

interface FilterPanelProps {
  onFilterRange: (from: number, to: number) => void;
  onFilterStandard: (standard: string | null) => void;
  activeStandard: string | null;
  isLoading: boolean;
}

const STANDARD_FILTERS = ["ERC20", "ERC721", "ERC1155", "Custom"];

export function FilterPanel({
  onFilterRange,
  onFilterStandard,
  activeStandard,
  isLoading,
}: FilterPanelProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BlockRangeInput>({
    resolver: zodResolver(blockRangeSchema),
  });

  const onSubmit = (data: BlockRangeInput) => {
    onFilterRange(parseInt(data.fromBlock, 10), parseInt(data.toBlock, 10));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Filter className="h-4 w-4" />
          Filters
        </CardTitle>
        <CardDescription>Filter by standard or block range</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Token Standard</p>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={activeStandard === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onFilterStandard(null)}
            >
              All
            </Badge>
            {STANDARD_FILTERS.map((s) => (
              <Badge
                key={s}
                variant={activeStandard === s ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onFilterStandard(s)}
              >
                {s}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Block Range</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="from-block" className="text-xs">From Block</Label>
                <Input id="from-block" placeholder="0" {...register("fromBlock")} />
                {errors.fromBlock && (
                  <p className="text-xs text-destructive">{errors.fromBlock.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="to-block" className="text-xs">To Block</Label>
                <Input id="to-block" placeholder="100" {...register("toBlock")} />
                {errors.toBlock && (
                  <p className="text-xs text-destructive">{errors.toBlock.message}</p>
                )}
              </div>
            </div>
            {errors.root && (
              <p className="text-xs text-destructive">{errors.root.message}</p>
            )}
            <Button type="submit" disabled={isLoading} size="sm" variant="outline">
              {isLoading ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <Filter className="mr-1 h-3 w-3" />
              )}
              Load Range
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
