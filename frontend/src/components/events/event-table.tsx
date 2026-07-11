"use client";

import { useState } from "react";
import { Eye, ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STANDARD_BADGE_COLORS, type DecodedEvent } from "@/types/events";
import { guessStandardFromEventName } from "@/types/events";

interface EventTableProps {
  events: DecodedEvent[];
  loading: boolean;
  onSelect: (event: DecodedEvent) => void;
}

function EventRow({
  event,
  isSelected,
  onSelect,
}: {
  event: DecodedEvent;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const standard = guessStandardFromEventName(event.eventName);

  return (
    <div className="rounded-lg border">
      <button
        onClick={onSelect}
        className="flex w-full items-center justify-between p-3 text-left hover:bg-muted/50"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {isSelected ? (
            <ChevronDown className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0" />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{event.eventName}</span>
              <Badge className={STANDARD_BADGE_COLORS[standard]}>
                {standard}
              </Badge>
            </div>
            <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="truncate">{event.contract.slice(0, 10)}...{event.contract.slice(-6)}</span>
              <span>Block #{event.blockNumber}</span>
              <span className="hidden sm:inline truncate">{event.transactionHash.slice(0, 10)}...</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

export function EventTable({ events, loading, onSelect }: EventTableProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-sm text-muted-foreground">Loading events...</p>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-sm text-muted-foreground">
            No events found. Try a different search or block range.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          {events.length} event(s) found
        </p>
      </div>
      <div className="space-y-2">
        {events.map((event, idx) => (
          <div key={`${event.transactionHash}-${event.logIndex}`}>
            <EventRow
              event={event}
              isSelected={selectedIdx === idx}
              onSelect={() => {
                setSelectedIdx(selectedIdx === idx ? null : idx);
                onSelect(event);
              }}
            />
            {selectedIdx === idx && (
              <div className="ml-6 rounded-lg border-t-0 border bg-muted/30 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Contract</p>
                    <code className="break-all text-xs">{event.contract}</code>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Transaction</p>
                    <code className="break-all text-xs">{event.transactionHash}</code>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Block</p>
                    <p className="text-xs">#{event.blockNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Log Index</p>
                    <p className="text-xs">{event.logIndex}</p>
                  </div>
                </div>
                {Object.keys(event.args).length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Decoded Parameters</p>
                    <div className="space-y-1">
                      {Object.entries(event.args).map(([key, value]) => (
                        <div key={key} className="flex gap-2 text-xs">
                          <span className="font-medium text-muted-foreground">{key}:</span>
                          <span className="break-all font-mono">
                            {typeof value === "bigint" ? value.toString() : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
