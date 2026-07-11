import {
  exportConversationMarkdown,
  exportConversationJSON,
} from "@/features/ai/services/export";
import type { AIConversation } from "@/features/ai/types";

const MOCK_CONVERSATION: AIConversation = {
  id: "conv-1",
  title: "Test Conversation",
  messages: [
    {
      id: "msg-1",
      role: "user",
      content: "Explain this transaction",
      timestamp: 1700000000000,
    },
    {
      id: "msg-2",
      role: "assistant",
      content: "This transaction transferred 100 tokens.",
      timestamp: 1700000001000,
    },
  ],
  mode: "transaction",
  context: { type: "transaction", transactionHash: "0x" + "ab".repeat(32) },
  createdAt: 1700000000000,
  updatedAt: 1700000001000,
};

describe("Export Service", () => {
  describe("exportConversationMarkdown", () => {
    it("generates markdown with title", () => {
      const md = exportConversationMarkdown(MOCK_CONVERSATION);
      expect(md).toContain("# Test Conversation");
    });

    it("includes mode", () => {
      const md = exportConversationMarkdown(MOCK_CONVERSATION);
      expect(md).toContain("transaction");
    });

    it("includes messages", () => {
      const md = exportConversationMarkdown(MOCK_CONVERSATION);
      expect(md).toContain("Explain this transaction");
      expect(md).toContain("100 tokens");
    });

    it("labels user and assistant", () => {
      const md = exportConversationMarkdown(MOCK_CONVERSATION);
      expect(md).toContain("**You**");
      expect(md).toContain("**BlockMind AI**");
    });

    it("includes separators", () => {
      const md = exportConversationMarkdown(MOCK_CONVERSATION);
      expect(md).toContain("---");
    });
  });

  describe("exportConversationJSON", () => {
    it("returns export object with version", () => {
      const json = exportConversationJSON(MOCK_CONVERSATION);
      expect(json.version).toBe("1.0");
    });

    it("includes exportedAt timestamp", () => {
      const json = exportConversationJSON(MOCK_CONVERSATION);
      expect(typeof json.exportedAt).toBe("number");
      expect(json.exportedAt).toBeGreaterThan(0);
    });

    it("includes full conversation", () => {
      const json = exportConversationJSON(MOCK_CONVERSATION);
      expect(json.conversation.id).toBe("conv-1");
      expect(json.conversation.messages).toHaveLength(2);
    });
  });
});
