"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollText, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { eventDecodeSchema, type EventDecodeInput } from "@/lib/validators/contract";
import { apiClient } from "@/lib/api-client";
import type { DecodedEvent, DecodedEventsResult } from "@/types/contract";

interface EventViewerProps {
  defaultAbi?: unknown[];
}

export function EventViewer({ defaultAbi }: EventViewerProps) {
  const [events, setEvents] = useState<DecodedEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventDecodeInput>({
    resolver: zodResolver(eventDecodeSchema),
  });

  const [abiInput, setAbiInput] = useState(
    defaultAbi ? JSON.stringify(defaultAbi) : "",
  );

  const onSubmit = async (data: EventDecodeInput) => {
    setLoading(true);
    setError(null);
    setEvents(null);
    try {
      let abi: unknown[];
      try {
        abi = JSON.parse(abiInput);
      } catch {
        setError("Invalid ABI JSON");
        setLoading(false);
        return;
      }
      const abiParam = encodeURIComponent(JSON.stringify(abi));
      const result = await apiClient<DecodedEventsResult>(
        `/contract/events/${data.txHash}?abi=${abiParam}`,
      );
      setEvents(result.events ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to decode events");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ScrollText className="h-4 w-4" />
          Event Viewer
        </CardTitle>
        <CardDescription>Decode events from a transaction hash</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="event-tx">Transaction Hash</Label>
            <Input
              id="event-tx"
              placeholder="0x..."
              {...register("txHash")}
            />
            {errors.txHash && (
              <p className="text-xs text-destructive">{errors.txHash.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="event-abi">Contract ABI (JSON array)</Label>
            <Input
              id="event-abi"
              placeholder='[{"type":"event",...}]'
              value={abiInput}
              onChange={(e) => setAbiInput(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={loading} size="sm">
            {loading ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <ScrollText className="mr-1 h-3 w-3" />
            )}
            Decode Events
          </Button>
        </form>

        {error && (
          <div className="mt-3 rounded-md bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {events && events.length === 0 && (
          <p className="mt-3 text-center text-sm text-muted-foreground">
            No events found in this transaction.
          </p>
        )}

        {events && events.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              {events.length} event(s) decoded
            </p>
            {events.map((ev, i) => (
              <div key={i} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="default">{ev.eventName}</Badge>
                  <span className="text-xs text-muted-foreground">
                    Log #{ev.logIndex}
                  </span>
                </div>
                <div className="space-y-1">
                  {Object.entries(ev.args).map(([key, value]) => (
                    <div key={key} className="flex gap-2 text-xs">
                      <span className="font-medium text-muted-foreground">{key}:</span>
                      <span className="break-all font-mono">
                        {typeof value === "bigint" ? value.toString() : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
