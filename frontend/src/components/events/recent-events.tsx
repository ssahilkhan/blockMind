"use client";

import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEventStore } from "@/stores/event-store";
import { guessStandardFromEventName, STANDARD_BADGE_COLORS } from "@/types/events";
import { Badge } from "@/components/ui/badge";

export function RecentEvents() {
  const recentEvents = useEventStore((s) => s.recentEvents);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4" />
          Session History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentEvents.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No events viewed in this session.
          </p>
        ) : (
          <div className="space-y-2">
            {recentEvents.map((ev, idx) => {
              const standard = guessStandardFromEventName(ev.eventName);
              return (
                <div
                  key={`${ev.transactionHash}-${ev.contract}-${idx}`}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{ev.eventName}</span>
                      <Badge className={STANDARD_BADGE_COLORS[standard]}>
                        {standard}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="truncate">
                        {ev.contract.slice(0, 10)}...{ev.contract.slice(-6)}
                      </span>
                      <span>Block #{ev.blockNumber}</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(ev.viewedAt).toLocaleTimeString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
