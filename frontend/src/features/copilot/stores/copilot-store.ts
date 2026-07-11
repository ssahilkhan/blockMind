import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CopilotSession,
  CopilotSuggestion,
  CopilotContext,
  CopilotConversation,
  CopilotMessage,
  CopilotWorkspace,
} from "../types";

interface CopilotState {
  sessions: CopilotSession[];
  activeSessionId: string | null;
  suggestions: CopilotSuggestion[];
  context: CopilotContext;
  conversations: CopilotConversation[];
  activeConversationId: string | null;
  isAnalyzing: boolean;
  error: string | null;
  filterSeverity: string | null;
  filterCategory: string | null;

  createSession: (workspace: CopilotWorkspace, context: CopilotContext) => string;
  setActiveSession: (id: string | null) => void;
  addSuggestion: (suggestion: CopilotSuggestion) => void;
  setSuggestions: (suggestions: CopilotSuggestion[]) => void;
  clearSuggestions: () => void;
  setContext: (context: Partial<CopilotContext>) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setError: (error: string | null) => void;
  setFilterSeverity: (severity: string | null) => void;
  setFilterCategory: (category: string | null) => void;
  getActiveSession: () => CopilotSession | undefined;
  pinSession: (id: string) => void;
  bookmarkSession: (id: string) => void;
  deleteSession: (id: string) => void;
  getFilteredSuggestions: () => CopilotSuggestion[];

  createConversation: (title: string, workspace: CopilotWorkspace) => string;
  addMessage: (conversationId: string, message: CopilotMessage) => void;
  setActiveConversation: (id: string | null) => void;
  pinConversation: (id: string) => void;
  bookmarkConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  searchConversations: (query: string) => CopilotConversation[];
  getActiveConversation: () => CopilotConversation | undefined;
  getBookmarkedConversations: () => CopilotConversation[];
  getPinnedConversations: () => CopilotConversation[];
}

export const useCopilotStore = create<CopilotState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,
      suggestions: [],
      context: { workspace: "global" },
      conversations: [],
      activeConversationId: null,
      isAnalyzing: false,
      error: null,
      filterSeverity: null,
      filterCategory: null,

      createSession: (workspace: CopilotWorkspace, context: CopilotContext) => {
        const id = crypto.randomUUID();
        const now = Date.now();
        const session: CopilotSession = {
          id,
          workspace,
          context,
          suggestions: [],
          createdAt: now,
          updatedAt: now,
          isPinned: false,
          isBookmarked: false,
          title: `${workspace} session`,
        };
        set((state) => ({
          sessions: [session, ...state.sessions],
          activeSessionId: id,
        }));
        return id;
      },

      setActiveSession: (id: string | null) => set({ activeSessionId: id }),

      addSuggestion: (suggestion: CopilotSuggestion) =>
        set((state) => ({
          suggestions: [suggestion, ...state.suggestions],
        })),

      setSuggestions: (suggestions: CopilotSuggestion[]) =>
        set({ suggestions }),

      clearSuggestions: () => set({ suggestions: [] }),

      setContext: (partial: Partial<CopilotContext>) =>
        set((state) => ({
          context: { ...state.context, ...partial },
        })),

      setIsAnalyzing: (analyzing: boolean) => set({ isAnalyzing: analyzing }),
      setError: (error: string | null) => set({ error }),
      setFilterSeverity: (severity: string | null) => set({ filterSeverity: severity }),
      setFilterCategory: (category: string | null) => set({ filterCategory: category }),

      getActiveSession: () => {
        const state = get();
        return state.sessions.find((s) => s.id === state.activeSessionId);
      },

      pinSession: (id: string) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, isPinned: !s.isPinned } : s,
          ),
        })),

      bookmarkSession: (id: string) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, isBookmarked: !s.isBookmarked } : s,
          ),
        })),

      deleteSession: (id: string) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
          activeSessionId: state.activeSessionId === id ? null : state.activeSessionId,
        })),

      getFilteredSuggestions: () => {
        const state = get();
        let filtered = state.suggestions;
        if (state.filterSeverity) {
          filtered = filtered.filter((s) => s.severity === state.filterSeverity);
        }
        if (state.filterCategory) {
          filtered = filtered.filter((s) => s.category === state.filterCategory);
        }
        return filtered;
      },

      createConversation: (title: string, workspace: CopilotWorkspace) => {
        const id = crypto.randomUUID();
        const now = Date.now();
        const conversation: CopilotConversation = {
          id,
          sessionId: get().activeSessionId ?? "",
          title,
          messages: [],
          isPinned: false,
          isBookmarked: false,
          tags: [workspace],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          activeConversationId: id,
        }));
        return id;
      },

      addMessage: (conversationId: string, message: CopilotMessage) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, messages: [...c.messages, message], updatedAt: Date.now() }
              : c,
          ),
        })),

      setActiveConversation: (id: string | null) =>
        set({ activeConversationId: id }),

      pinConversation: (id: string) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, isPinned: !c.isPinned } : c,
          ),
        })),

      bookmarkConversation: (id: string) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, isBookmarked: !c.isBookmarked } : c,
          ),
        })),

      deleteConversation: (id: string) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          activeConversationId:
            state.activeConversationId === id ? null : state.activeConversationId,
        })),

      renameConversation: (id: string, title: string) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title, updatedAt: Date.now() } : c,
          ),
        })),

      searchConversations: (query: string) => {
        const state = get();
        const lower = query.toLowerCase();
        return state.conversations.filter(
          (c) =>
            c.title.toLowerCase().includes(lower) ||
            c.tags.some((t) => t.toLowerCase().includes(lower)) ||
            c.messages.some((m) => m.content.toLowerCase().includes(lower)),
        );
      },

      getActiveConversation: () => {
        const state = get();
        return state.conversations.find((c) => c.id === state.activeConversationId);
      },

      getBookmarkedConversations: () => {
        return get().conversations.filter((c) => c.isBookmarked);
      },

      getPinnedConversations: () => {
        return get().conversations.filter((c) => c.isPinned);
      },
    }),
    { name: "blockmind-copilot" },
  ),
);
