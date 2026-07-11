"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { Download, FileJson, FileText } from "lucide-react";
import { MessageBubble } from "./message-bubble";
import { PromptInput } from "./prompt-input";
import { TypingIndicator } from "./typing-indicator";
import { QuickActions } from "./quick-actions";
import { useAIStore } from "../stores/ai-store";
import { useAIContextStore } from "../stores/context-store";
import { sendMessage } from "../services/chat";
import { exportConversationMarkdown, exportConversationJSON, downloadFile } from "../services/export";
import type { QuickAction, AIMode } from "../types";

export function AIChat() {
  const activeConversationId = useAIStore((s) => s.activeConversationId);
  const conversations = useAIStore((s) => s.conversations);
  const isStreaming = useAIStore((s) => s.isStreaming);
  const setStreaming = useAIStore((s) => s.setStreaming);
  const addMessage = useAIStore((s) => s.addMessage);
  const createConversation = useAIStore((s) => s.createConversation);
  const providerConfig = useAIStore((s) => s.providerConfig);
  const mode = useAIStore((s) => s.mode);
  const level = useAIStore((s) => s.level);
  const context = useAIContextStore((s) => s.context);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId,
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages.length, isStreaming]);

  const handleSend = useCallback(
    async (input: string) => {
      if (!activeConversationId) {
        const newId = createConversation(mode);
        await processSend(input, newId);
        return;
      }
      await processSend(input, activeConversationId);
    },
    [activeConversationId, mode, level, providerConfig, context],
  );

  async function processSend(input: string, convId: string) {
    const userMsg = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content: input,
      timestamp: Date.now(),
      mode,
    };
    addMessage(convId, userMsg);
    setError(null);
    setStreaming(true);

    try {
      const conv = useAIStore.getState().conversations.find((c) => c.id === convId);
      const priorMessages = conv?.messages ?? [];
      const response = await sendMessage({
        input,
        mode,
        level,
        context,
        providerConfig,
        priorMessages: priorMessages.slice(0, -1),
      });
      addMessage(convId, response.message);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI request failed.";
      setError(msg);
      addMessage(convId, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Error: ${msg}`,
        timestamp: Date.now(),
        mode,
      });
    } finally {
      setStreaming(false);
    }
  }

  const handleQuickAction = useCallback(
    async (action: QuickAction) => {
      if (!activeConversationId) return;
      setError(null);
      setStreaming(true);

      try {
        const response = await sendMessage({
          input: "",
          mode,
          level,
          context,
          providerConfig,
          priorMessages: activeConversation?.messages ?? [],
          quickAction: action,
        });
        addMessage(activeConversationId, response.message);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "AI request failed.";
        setError(msg);
      } finally {
        setStreaming(false);
      }
    },
    [activeConversationId, mode, level, providerConfig, context, activeConversation],
  );

  const handleExport = (format: "md" | "json") => {
    if (!activeConversation) return;
    if (format === "md") {
      const md = exportConversationMarkdown(activeConversation);
      downloadFile(md, `${activeConversation.title}.md`, "text/markdown");
    } else {
      const json = exportConversationJSON(activeConversation);
      downloadFile(
        JSON.stringify(json, null, 2),
        `${activeConversation.title}.json`,
        "application/json",
      );
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <QuickActions onAction={handleQuickAction} disabled={isStreaming || !activeConversationId} />
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleExport("md")}
            disabled={!activeConversation}
            className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-50"
            title="Export Markdown"
          >
            <FileText className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleExport("json")}
            disabled={!activeConversation}
            className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-50"
            title="Export JSON"
          >
            <FileJson className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!activeConversationId && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">BlockMind AI</p>
              <p className="text-sm text-muted-foreground">
                Select a mode and start asking questions about blockchain data.
              </p>
            </div>
          </div>
        )}

        {activeConversation?.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isStreaming && <TypingIndicator />}

        {error && (
          <div className="rounded-md bg-destructive/10 p-2 text-xs text-destructive">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <PromptInput
        onSend={handleSend}
        isLoading={isStreaming}
        placeholder={
          activeConversationId
            ? `Ask about ${mode} data...`
            : "Start a conversation..."
        }
      />
    </div>
  );
}
