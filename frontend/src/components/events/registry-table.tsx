"use client";

import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STANDARD_BADGE_COLORS, type RegistryEntry } from "@/types/events";

interface RegistryTableProps {
  entries: RegistryEntry[];
  loading: boolean;
}

export function RegistryTable({ entries, loading }: RegistryTableProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-sm text-muted-foreground">Loading registry...</p>
        </CardContent>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-sm text-muted-foreground">
            No registered events found.
          </p>
        </CardContent>
      </Card>
    );
  }

  const grouped = entries.reduce<Record<string, RegistryEntry[]>>((acc, entry) => {
    if (!acc[entry.standard]) acc[entry.standard] = [];
    acc[entry.standard].push(entry);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4" />
            Event Registry
          </CardTitle>
          <CardDescription>
            All registered event signatures by standard ({entries.length} total)
          </CardDescription>
        </CardHeader>
      </Card>

      {Object.entries(grouped).map(([standard, events]) => (
        <Card key={standard}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Badge className={STANDARD_BADGE_COLORS[standard]}>
                {standard}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {events.length} event(s)
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {events.map((entry) => (
                <div
                  key={entry.signature}
                  className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2"
                >
                  <span className="text-sm font-medium">{entry.name}</span>
                  <code className="text-xs text-muted-foreground">{entry.signature}</code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
