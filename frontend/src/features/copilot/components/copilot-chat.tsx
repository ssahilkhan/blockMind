"use client";

import { useState } from "react";
import { Send, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { CopilotMessage } from "../types";

interface CopilotChatProps {
  messages: CopilotMessage[];
  onSend: (message: string) => void;
  onClear: () => void;
  isSending: boolean;
}

export function CopilotChat({ messages, onSend, onClear, isSending }: CopilotChatProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || isSending) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Copilot Chat
        </CardTitle>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear} className="h-7 px-2">
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {messages.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              Ask the copilot anything about the current workspace.
            </p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`text-xs p-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-primary/10 ml-4"
                  : "bg-muted mr-4"
              }`}
            >
              <span className="font-medium text-[10px] text-muted-foreground">
                {msg.role === "user" ? "You" : "Copilot"}
              </span>
              <p className="mt-0.5 whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the copilot..."
            className="min-h-[60px] text-sm resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            size="sm"
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
