"use client";

import { useState } from "react";
import { Plus, Trash2, MessageSquare, Pencil, Check, X } from "lucide-react";
import { useAIStore } from "../stores/ai-store";

export function ConversationList() {
  const conversations = useAIStore((s) => s.conversations);
  const activeConversationId = useAIStore((s) => s.activeConversationId);
  const createConversation = useAIStore((s) => s.createConversation);
  const deleteConversation = useAIStore((s) => s.deleteConversation);
  const renameConversation = useAIStore((s) => s.renameConversation);
  const setActiveConversation = useAIStore((s) => s.setActiveConversation);
  const mode = useAIStore((s) => s.mode);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleNew = () => {
    createConversation(mode);
  };

  const startEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const saveEdit = () => {
    if (editingId && editTitle.trim()) {
      renameConversation(editingId, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Conversations</h3>
        <button
          onClick={handleNew}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          title="New chat"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-1">
        {conversations.length === 0 && (
          <p className="py-4 text-center text-xs text-muted-foreground">
            No conversations yet.
          </p>
        )}

        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setActiveConversation(conv.id)}
            className={`group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${
              activeConversationId === conv.id
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <MessageSquare className="h-3 w-3 shrink-0" />

            {editingId === conv.id ? (
              <div className="flex flex-1 items-center gap-1">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="flex-1 rounded border bg-background px-1 py-0.5 text-xs"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
                <button onClick={(e) => { e.stopPropagation(); saveEdit(); }}>
                  <Check className="h-3 w-3 text-green-500" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }}>
                  <X className="h-3 w-3 text-red-500" />
                </button>
              </div>
            ) : (
              <>
                <span className="flex-1 truncate">{conv.title}</span>
                <div className="hidden items-center gap-1 group-hover:flex">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(conv.id, conv.title);
                    }}
                    className="p-0.5 hover:text-foreground"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    className="p-0.5 hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
