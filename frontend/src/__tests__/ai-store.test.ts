import { useAIStore } from "@/features/ai/stores/ai-store";
import { useAIContextStore } from "@/features/ai/stores/context-store";

describe("AI Store", () => {
  beforeEach(() => {
    useAIStore.setState({
      conversations: [],
      activeConversationId: null,
      provider: "openai",
      providerConfig: { id: "openai", model: "gpt-4o-mini" },
      mode: "transaction",
      level: "beginner",
      isStreaming: false,
    });
  });

  describe("createConversation", () => {
    it("creates a new conversation", () => {
      const id = useAIStore.getState().createConversation("transaction");
      const state = useAIStore.getState();
      expect(state.conversations).toHaveLength(1);
      expect(state.conversations[0].id).toBe(id);
      expect(state.conversations[0].mode).toBe("transaction");
      expect(state.activeConversationId).toBe(id);
    });

    it("prepends new conversation", () => {
      useAIStore.getState().createConversation("transaction");
      useAIStore.getState().createConversation("contract");
      expect(useAIStore.getState().conversations).toHaveLength(2);
      expect(useAIStore.getState().conversations[0].mode).toBe("contract");
    });
  });

  describe("deleteConversation", () => {
    it("removes conversation", () => {
      const id = useAIStore.getState().createConversation("wallet");
      useAIStore.getState().deleteConversation(id);
      expect(useAIStore.getState().conversations).toHaveLength(0);
      expect(useAIStore.getState().activeConversationId).toBeNull();
    });

    it("clears active if deleted", () => {
      const id = useAIStore.getState().createConversation("wallet");
      useAIStore.getState().deleteConversation(id);
      expect(useAIStore.getState().activeConversationId).toBeNull();
    });

    it("does not clear active if different", () => {
      const id1 = useAIStore.getState().createConversation("wallet");
      const id2 = useAIStore.getState().createConversation("contract");
      useAIStore.getState().deleteConversation(id1);
      expect(useAIStore.getState().activeConversationId).toBe(id2);
    });
  });

  describe("renameConversation", () => {
    it("renames conversation", () => {
      const id = useAIStore.getState().createConversation("token");
      useAIStore.getState().renameConversation(id, "My Token Chat");
      expect(useAIStore.getState().conversations[0].title).toBe("My Token Chat");
    });
  });

  describe("addMessage", () => {
    it("adds message to conversation", () => {
      const id = useAIStore.getState().createConversation("event");
      const msg = {
        id: "msg-1",
        role: "user" as const,
        content: "Hello",
        timestamp: Date.now(),
      };
      useAIStore.getState().addMessage(id, msg);
      expect(useAIStore.getState().conversations[0].messages).toHaveLength(1);
      expect(useAIStore.getState().conversations[0].messages[0].content).toBe("Hello");
    });
  });

  describe("setMode/setLevel/setProvider", () => {
    it("updates mode", () => {
      useAIStore.getState().setMode("contract");
      expect(useAIStore.getState().mode).toBe("contract");
    });

    it("updates level", () => {
      useAIStore.getState().setLevel("developer");
      expect(useAIStore.getState().level).toBe("developer");
    });

    it("updates provider", () => {
      useAIStore.getState().setProvider("ollama");
      expect(useAIStore.getState().provider).toBe("ollama");
    });
  });

  describe("setStreaming", () => {
    it("toggles streaming state", () => {
      useAIStore.getState().setStreaming(true);
      expect(useAIStore.getState().isStreaming).toBe(true);
      useAIStore.getState().setStreaming(false);
      expect(useAIStore.getState().isStreaming).toBe(false);
    });
  });

  describe("setProviderConfig", () => {
    it("merges config", () => {
      useAIStore.getState().setProviderConfig({ apiKey: "sk-123" });
      expect(useAIStore.getState().providerConfig.apiKey).toBe("sk-123");
      expect(useAIStore.getState().providerConfig.id).toBe("openai");
    });
  });
});

describe("AI Context Store", () => {
  beforeEach(() => {
    useAIContextStore.setState({ context: { type: null } });
  });

  it("starts with null type", () => {
    expect(useAIContextStore.getState().context.type).toBeNull();
  });

  it("sets context", () => {
    useAIContextStore.getState().setContext({
      type: "wallet",
      walletAddress: "0x" + "aa".repeat(20),
    });
    expect(useAIContextStore.getState().context.type).toBe("wallet");
    expect(useAIContextStore.getState().context.walletAddress).toBe(
      "0x" + "aa".repeat(20),
    );
  });

  it("merges context", () => {
    useAIContextStore.getState().setContext({ type: "contract" });
    useAIContextStore.getState().setContext({
      contractAddress: "0x" + "bb".repeat(20),
    });
    expect(useAIContextStore.getState().context.type).toBe("contract");
    expect(useAIContextStore.getState().context.contractAddress).toBe(
      "0x" + "bb".repeat(20),
    );
  });

  it("clears context", () => {
    useAIContextStore.getState().setContext({
      type: "transaction",
      transactionHash: "0x" + "cc".repeat(32),
    });
    useAIContextStore.getState().clearContext();
    expect(useAIContextStore.getState().context.type).toBeNull();
    expect(useAIContextStore.getState().context.transactionHash).toBeUndefined();
  });
});
