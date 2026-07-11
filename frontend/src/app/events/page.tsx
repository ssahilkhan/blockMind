"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EventTable,
  EventDetails,
  SearchBar,
  FilterPanel,
  RegistryTable,
  StatsCards,
  RecentEvents,
} from "@/components/events";
import { eventsApi } from "@/services/events";
import { useEventStore } from "@/stores/event-store";
import { guessStandardFromEventName, type DecodedEvent, type EventListResponse, type RegistryEntry } from "@/types/events";
import type { EventSearchInput } from "@/lib/validators/events";

function BrowseTab() {
  const [events, setEvents] = useState<DecodedEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<DecodedEvent | null>(null);
  const [filterStandard, setFilterStandard] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [rangeLoading, setRangeLoading] = useState(false);
  const addRecentEvent = useEventStore((s) => s.addRecentEvent);

  const handleSearch = useCallback(async (params: EventSearchInput) => {
    setSearchLoading(true);
    try {
      const res = await eventsApi.searchEvents(params);
      const data = res as unknown as EventListResponse;
      setEvents(data.events ?? []);
      setSelectedEvent(null);
    } catch {
      setEvents([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleRange = useCallback(async (from: number, to: number) => {
    setRangeLoading(true);
    try {
      const res = await eventsApi.getRangeEvents(from, to);
      const data = res as unknown as EventListResponse;
      setEvents(data.events ?? []);
      setSelectedEvent(null);
    } catch {
      setEvents([]);
    } finally {
      setRangeLoading(false);
    }
  }, []);

  const filteredEvents = useMemo(() => {
    if (!filterStandard) return events;
    return events.filter((ev) => {
      const standard = guessStandardFromEventName(ev.eventName);
      return standard === filterStandard;
    });
  }, [events, filterStandard]);

  const stats = useMemo(() => {
    const counts = { total: events.length, erc20: 0, erc721: 0, erc1155: 0, custom: 0 };
    for (const ev of events) {
      const s = guessStandardFromEventName(ev.eventName);
      if (s === "ERC20") counts.erc20++;
      else if (s === "ERC721") counts.erc721++;
      else if (s === "ERC1155") counts.erc1155++;
      else counts.custom++;
    }
    return counts;
  }, [events]);

  const handleSelectEvent = useCallback((event: DecodedEvent) => {
    setSelectedEvent(event);
    addRecentEvent({
      eventName: event.eventName,
      contract: event.contract,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      viewedAt: Date.now(),
    });
  }, [addRecentEvent]);

  return (
    <div className="space-y-6">
      <StatsCards {...stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <SearchBar onSearch={handleSearch} isLoading={searchLoading} />

          {selectedEvent && (
            <EventDetails
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
            />
          )}

          <EventTable
            events={filteredEvents}
            loading={searchLoading}
            onSelect={handleSelectEvent}
          />
        </div>

        <div>
          <FilterPanel
            onFilterRange={handleRange}
            onFilterStandard={setFilterStandard}
            activeStandard={filterStandard}
            isLoading={rangeLoading}
          />
        </div>
      </div>
    </div>
  );
}

function RegistryTab() {
  const { data: registry, isLoading } = useQuery<{
    standards: string[];
    events: RegistryEntry[];
    contracts: Array<{ address: string; label?: string }>;
  } | null>({
    queryKey: ["event-registry"],
    queryFn: async () => {
      const res = await eventsApi.getRegistry();
      return res as unknown as {
        standards: string[];
        events: RegistryEntry[];
        contracts: Array<{ address: string; label?: string }>;
      };
    },
    retry: false,
  });

  return (
    <RegistryTable
      entries={registry?.events ?? []}
      loading={isLoading}
    />
  );
}

export default function EventsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Event Explorer</h2>
          <p className="text-sm text-muted-foreground">
            Browse, decode, and filter blockchain events.
          </p>
        </div>

        <Tabs defaultValue="browse">
          <TabsList variant="line">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="registry">Registry</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="browse">
              <BrowseTab />
            </TabsContent>
            <TabsContent value="registry">
              <RegistryTab />
            </TabsContent>
            <TabsContent value="history">
              <RecentEvents />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
