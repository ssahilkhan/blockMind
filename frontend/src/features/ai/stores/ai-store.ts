import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AIConversation,
  AIMessage,
  AIMode,
  AILevel,
  AIProviderID,
  AIProviderConfig,
} from "../types";

interface AIState {
  conversations: AIConversation[];
  activeConversationId: string | null;
  provider: AIProviderID;
  providerConfig: AIProviderConfig;
  mode: AIMode;
  level: AILevel;
  isStreaming: boolean;

  createConversation: (mode: AIMode) => string;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: AIMessage) => void;
  setMode: (mode: AIMode) => void;
  setLevel: (level: AILevel) => void;
  setProvider: (provider: AIProviderID) => void;
  setProviderConfig: (config: Partial<AIProviderConfig>) => void;
  setStreaming: (streaming: boolean) => void;
  getActiveConversation: () => AIConversation | undefined;
}

export const useAIStore = create<AIState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      provider: "openai",
      providerConfig: { id: "openai", model: "gpt-4o-mini" },
      mode: "transaction",
      level: "beginner",
      isStreaming: false,

      createConversation: (mode: AIMode) => {
        const id = crypto.randomUUID();
        const now = Date.now();
        const conversation: AIConversation = {
          id,
          title: `New ${mode} chat`,
          messages: [],
          mode,
          context: { type: mode },
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          activeConversationId: id,
        }));
        return id;
      },

      deleteConversation: (id: string) => {
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          activeConversationId:
            state.activeConversationId === id ? null : state.activeConversationId,
        }));
      },

      renameConversation: (id: string, title: string) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title, updatedAt: Date.now() } : c,
          ),
        }));
      },

      setActiveConversation: (id: string | null) => {
        set({ activeConversationId: id });
      },

      addMessage: (conversationId: string, message: AIMessage) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [...c.messages, message],
                  updatedAt: Date.now(),
                }
              : c,
          ),
        }));
      },

      setMode: (mode: AIMode) => set({ mode }),
      setLevel: (level: AILevel) => set({ level }),
      setProvider: (provider: AIProviderID) => set({ provider }),

      setProviderConfig: (config: Partial<AIProviderConfig>) => {
        set((state) => ({
          providerConfig: { ...state.providerConfig, ...config },
        }));
      },

      setStreaming: (streaming: boolean) => set({ isStreaming: streaming }),

      getActiveConversation: () => {
        const state = get();
        return state.conversations.find(
          (c) => c.id === state.activeConversationId,
        );
      },
    }),
    {
      name: "blockmind-ai",
    },
  ),
);
