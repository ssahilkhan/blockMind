import { useCopilotStore } from "@/features/copilot/stores/copilot-store";
import type { CopilotSuggestion, CopilotMessage } from "@/features/copilot/types";

beforeEach(() => {
  useCopilotStore.setState({
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
  });
});

describe("Copilot Store", () => {
  it("has correct initial state", () => {
    const state = useCopilotStore.getState();
    expect(state.suggestions).toEqual([]);
    expect(state.isAnalyzing).toBe(false);
    expect(state.conversations).toEqual([]);
    expect(state.activeConversationId).toBeNull();
  });

  it("setSuggestions stores suggestions", () => {
    const suggestions: CopilotSuggestion[] = [
      {
        id: "1",
        workspace: "global",
        category: "security",
        severity: "critical",
        title: "Test",
        description: "Desc",
        source: "test",
        timestamp: Date.now(),
      },
    ];
    useCopilotStore.getState().setSuggestions(suggestions);
    expect(useCopilotStore.getState().suggestions).toHaveLength(1);
  });

  it("setIsAnalyzing toggles analysis state", () => {
    useCopilotStore.getState().setIsAnalyzing(true);
    expect(useCopilotStore.getState().isAnalyzing).toBe(true);
    useCopilotStore.getState().setIsAnalyzing(false);
    expect(useCopilotStore.getState().isAnalyzing).toBe(false);
  });

  it("createConversation creates and activates", () => {
    const id = useCopilotStore.getState().createConversation("Test Conv", "global");
    const state = useCopilotStore.getState();
    expect(state.conversations).toHaveLength(1);
    expect(state.conversations[0].title).toBe("Test Conv");
    expect(state.activeConversationId).toBe(id);
  });

  it("addMessage adds message to conversation", () => {
    const convId = useCopilotStore.getState().createConversation("Test", "global");
    const msg: CopilotMessage = {
      id: "msg-1",
      role: "user",
      content: "Hello",
      timestamp: Date.now(),
    };
    useCopilotStore.getState().addMessage(convId, msg);
    const conv = useCopilotStore.getState().conversations.find((c) => c.id === convId);
    expect(conv?.messages).toHaveLength(1);
  });

  it("pinConversation toggles pin", () => {
    const convId = useCopilotStore.getState().createConversation("Test", "global");
    expect(useCopilotStore.getState().conversations[0].isPinned).toBe(false);
    useCopilotStore.getState().pinConversation(convId);
    expect(useCopilotStore.getState().conversations[0].isPinned).toBe(true);
    useCopilotStore.getState().pinConversation(convId);
    expect(useCopilotStore.getState().conversations[0].isPinned).toBe(false);
  });

  it("bookmarkConversation toggles bookmark", () => {
    const convId = useCopilotStore.getState().createConversation("Test", "global");
    expect(useCopilotStore.getState().conversations[0].isBookmarked).toBe(false);
    useCopilotStore.getState().bookmarkConversation(convId);
    expect(useCopilotStore.getState().conversations[0].isBookmarked).toBe(true);
    useCopilotStore.getState().bookmarkConversation(convId);
    expect(useCopilotStore.getState().conversations[0].isBookmarked).toBe(false);
  });

  it("deleteConversation removes conversation", () => {
    const convId = useCopilotStore.getState().createConversation("Test", "global");
    expect(useCopilotStore.getState().conversations).toHaveLength(1);
    useCopilotStore.getState().deleteConversation(convId);
    expect(useCopilotStore.getState().conversations).toHaveLength(0);
  });

  it("setFilterSeverity stores filter", () => {
    useCopilotStore.getState().setFilterSeverity("critical");
    expect(useCopilotStore.getState().filterSeverity).toBe("critical");
    useCopilotStore.getState().setFilterSeverity(null);
    expect(useCopilotStore.getState().filterSeverity).toBeNull();
  });

  it("setFilterCategory stores filter", () => {
    useCopilotStore.getState().setFilterCategory("security");
    expect(useCopilotStore.getState().filterCategory).toBe("security");
    useCopilotStore.getState().setFilterCategory(null);
    expect(useCopilotStore.getState().filterCategory).toBeNull();
  });

  it("getFilteredSuggestions applies filters", () => {
    const s1: CopilotSuggestion = {
      id: "1",
      workspace: "global",
      category: "security",
      severity: "critical",
      title: "Critical Sec",
      description: "Desc",
      source: "test",
      timestamp: Date.now(),
    };
    const s2: CopilotSuggestion = {
      id: "2",
      workspace: "global",
      category: "gas",
      severity: "warning",
      title: "Gas Warning",
      description: "Desc",
      source: "test",
      timestamp: Date.now(),
    };
    useCopilotStore.getState().setSuggestions([s1, s2]);
    expect(useCopilotStore.getState().getFilteredSuggestions()).toHaveLength(2);

    useCopilotStore.getState().setFilterSeverity("critical");
    expect(useCopilotStore.getState().getFilteredSuggestions()).toHaveLength(1);
  });

  it("renameConversation updates title", () => {
    const convId = useCopilotStore.getState().createConversation("Old Title", "global");
    useCopilotStore.getState().renameConversation(convId, "New Title");
    expect(useCopilotStore.getState().conversations[0].title).toBe("New Title");
  });

  it("searchConversations finds by title", () => {
    useCopilotStore.getState().createConversation("Foo bar", "global");
    useCopilotStore.getState().createConversation("Baz qux", "global");
    const results = useCopilotStore.getState().searchConversations("foo");
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe("Foo bar");
  });
});
