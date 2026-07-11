"use client";

import { useState } from "react";
import { Pin, Bookmark, Trash2, Search, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { CopilotConversation } from "../types";

interface ConversationListProps {
  conversations: CopilotConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onPin: (id: string) => void;
  onBookmark: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onPin,
  onBookmark,
  onDelete,
}: ConversationListProps) {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) => {
    if (!search) return true;
    const lower = search.toLowerCase();
    return (
      c.title.toLowerCase().includes(lower) ||
      c.tags.some((t) => t.toLowerCase().includes(lower))
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Conversations ({conversations.length})
          </CardTitle>
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="pl-7 h-7 text-xs"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-1 max-h-[300px] overflow-y-auto">
        {sorted.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            {search ? "No matching conversations." : "No conversations yet."}
          </p>
        )}
        {sorted.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`p-2 rounded cursor-pointer hover:bg-muted/50 transition-colors ${
              activeId === conv.id ? "bg-muted" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium flex-1 truncate">{conv.title}</span>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={(e) => { e.stopPropagation(); onPin(conv.id); }}
                  className={`p-0.5 rounded hover:bg-muted ${conv.isPinned ? "text-blue-500" : "text-muted-foreground"}`}
                >
                  <Pin className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onBookmark(conv.id); }}
                  className={`p-0.5 rounded hover:bg-muted ${conv.isBookmarked ? "text-yellow-500" : "text-muted-foreground"}`}
                >
                  <Bookmark className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                  className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-1 ml-5">
              {conv.tags.map((tag) => (
                <span key={tag} className="text-[9px] px-1 py-0.5 rounded bg-muted text-muted-foreground">
                  {tag}
                </span>
              ))}
              <span className="text-[9px] text-muted-foreground ml-auto">
                {new Date(conv.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
