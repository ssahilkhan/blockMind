"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, MessageSquare, History } from "lucide-react";
import { useCopilotStore } from "../stores/copilot-store";
import { sendCopilotMessage } from "../services/chat";
import { useAIStore } from "@/features/ai/stores/ai-store";
import type { CopilotContext, CopilotActionType, CopilotWorkspace, CopilotMessage } from "../types";
import { WORKSPACE_LABELS } from "../types";
import { CopilotPanel } from "./copilot-panel";
import { CopilotChat } from "./copilot-chat";
import { ConversationList } from "./conversation-list";

interface CopilotWorkspaceViewProps {
  initialContext?: CopilotContext;
}

export function CopilotWorkspaceView({ initialContext }: CopilotWorkspaceViewProps) {
  const [context, setContext] = useState<CopilotContext>(
    initialContext ?? { workspace: "global" },
  );
  const [activeTab, setActiveTab] = useState<"copilot" | "chat" | "history">("copilot");

  const providerConfig = useAIStore((s) => s.providerConfig);
  const {
    conversations,
    activeConversationId,
    createConversation,
    addMessage,
    setActiveConversation,
    pinConversation,
    bookmarkConversation,
    deleteConversation,
  } = useCopilotStore();

  const [isSending, setIsSending] = useState(false);
  const [chatMessages, setChatMessages] = useState<CopilotMessage[]>([]);

  const handleAction = useCallback(
    async (actionType: CopilotActionType, actionContext: CopilotContext) => {
      setIsSending(true);
      try {
        const res = await sendCopilotMessage({
          input: `Run ${actionType} analysis`,
          workspace: actionContext.workspace,
          context: actionContext,
          providerConfig,
          actionType,
        });

        const assistantMsg: CopilotMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: res.content,
          timestamp: Date.now(),
          workspace: actionContext.workspace,
        };

        setChatMessages((prev) => [...prev, assistantMsg]);

        if (!activeConversationId) {
          const convId = createConversation(
            `${WORKSPACE_LABELS[actionContext.workspace]} - ${actionType}`,
            actionContext.workspace,
          );
          addMessage(convId, assistantMsg);
        } else {
          addMessage(activeConversationId, assistantMsg);
        }
      } catch {
        const errorMsg: CopilotMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "I need an AI provider configured to respond. Please set up your API key in Settings.",
          timestamp: Date.now(),
          workspace: actionContext.workspace,
        };
        setChatMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsSending(false);
      }
    },
    [providerConfig, activeConversationId, createConversation, addMessage],
  );

  const handleChatSend = useCallback(
    async (input: string) => {
      const userMsg: CopilotMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: input,
        timestamp: Date.now(),
        workspace: context.workspace,
      };

      setChatMessages((prev) => [...prev, userMsg]);

      if (activeConversationId) {
        addMessage(activeConversationId, userMsg);
      }

      setIsSending(true);
      try {
        const prior = chatMessages.map((m) => ({ role: m.role, content: m.content }));
        const res = await sendCopilotMessage({
          input,
          workspace: context.workspace,
          context,
          providerConfig,
          priorMessages: prior,
        });

        const assistantMsg: CopilotMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: res.content,
          timestamp: Date.now(),
          workspace: context.workspace,
        };

        setChatMessages((prev) => [...prev, assistantMsg]);

        if (!activeConversationId) {
          const convId = createConversation(
            input.slice(0, 50) + (input.length > 50 ? "..." : ""),
            context.workspace,
          );
          addMessage(convId, userMsg);
          addMessage(convId, assistantMsg);
        } else {
          addMessage(activeConversationId, assistantMsg);
        }
      } catch {
        const errorMsg: CopilotMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "I need an AI provider configured. Please set your API key in Settings.",
          timestamp: Date.now(),
        };
        setChatMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsSending(false);
      }
    },
    [
      context,
      providerConfig,
      activeConversationId,
      chatMessages,
      createConversation,
      addMessage,
    ],
  );

  const handleConversationSelect = useCallback(
    (id: string) => {
      setActiveConversation(id);
      const conv = conversations.find((c) => c.id === id);
      if (conv) {
        setChatMessages(conv.messages);
        setActiveTab("chat");
      }
    },
    [conversations, setActiveConversation],
  );

  const currentConv = conversations.find((c) => c.id === activeConversationId);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-base font-semibold">Developer Copilot</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList>
              <TabsTrigger value="copilot" className="text-xs">
                <Bot className="h-3 w-3 mr-1" /> Copilot
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-xs">
                <MessageSquare className="h-3 w-3 mr-1" /> Chat
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs">
                <History className="h-3 w-3 mr-1" /> History
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {activeTab === "copilot" && (
        <CopilotPanel context={context} onAction={handleAction} />
      )}

      {activeTab === "chat" && (
        <CopilotChat
          messages={chatMessages}
          onSend={handleChatSend}
          onClear={() => setChatMessages([])}
          isSending={isSending}
        />
      )}

      {activeTab === "history" && (
        <ConversationList
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={handleConversationSelect}
          onPin={pinConversation}
          onBookmark={bookmarkConversation}
          onDelete={deleteConversation}
        />
      )}
    </div>
  );
}
