"use client";

import { useState } from "react";
import { Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import {
  AIChat,
  ModeSelector,
  LevelToggle,
  ProviderSelector,
  ContextPanel,
  ConversationList,
} from "@/features/ai/components";
import { useAIStore } from "@/features/ai/stores/ai-store";

export default function AIPage() {
  const mode = useAIStore((s) => s.mode);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4rem)] gap-0 -m-6">
        {sidebarOpen && (
          <div className="w-64 shrink-0 border-r bg-card p-4 flex flex-col gap-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">AI Assistant</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            <ModeSelector />
            <LevelToggle />
            <ConversationList />

            {settingsOpen && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Provider Settings</h3>
                <ProviderSelector />
              </div>
            )}

            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-3 w-3" />
              {settingsOpen ? "Hide Settings" : "Provider Settings"}
            </button>
          </div>
        )}

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-r-md border bg-card p-1 text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        <div className="flex-1 min-w-0">
          <AIChat />
        </div>

        <div className="w-72 shrink-0 border-l bg-card p-4 overflow-y-auto">
          <ContextPanel currentMode={mode} />
        </div>
      </div>
    </DashboardLayout>
  );
}
