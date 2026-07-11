"use client";

import { X, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STANDARD_BADGE_COLORS, guessStandardFromEventName, type DecodedEvent } from "@/types/events";

interface EventDetailsProps {
  event: DecodedEvent;
  onClose: () => void;
}

export function EventDetails({ event, onClose }: EventDetailsProps) {
  const standard = guessStandardFromEventName(event.eventName);

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{event.eventName}</h3>
          <Badge className={STANDARD_BADGE_COLORS[standard]}>{standard}</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 text-xs">
        <div className="space-y-1">
          <p className="font-medium text-muted-foreground">Contract Address</p>
          <code className="break-all">{event.contract}</code>
        </div>
        <div className="space-y-1">
          <p className="font-medium text-muted-foreground">Transaction Hash</p>
          <div className="flex items-center gap-1">
            <code className="break-all">{event.transactionHash}</code>
          </div>
        </div>
        <div className="space-y-1">
          <p className="font-medium text-muted-foreground">Block Number</p>
          <p>#{event.blockNumber}</p>
        </div>
        <div className="space-y-1">
          <p className="font-medium text-muted-foreground">Log Index</p>
          <p>{event.logIndex}</p>
        </div>
      </div>

      {Object.keys(event.args).length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Decoded Parameters</p>
          <div className="space-y-1">
            {Object.entries(event.args).map(([key, value]) => (
              <div key={key} className="flex gap-2 text-xs">
                <span className="w-24 shrink-0 font-medium text-muted-foreground">{key}</span>
                <span className="break-all font-mono">
                  {typeof value === "bigint" ? value.toString() : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Block Hash</p>
        <code className="block break-all text-xs">{event.blockHash}</code>
      </div>
    </div>
  );
}
