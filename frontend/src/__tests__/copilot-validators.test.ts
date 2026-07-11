import {
  copilotContextSchema,
  copilotSuggestionSchema,
  copilotMessageSchema,
  copilotConversationSchema,
  quickActionSchema,
} from "@/features/copilot/validators";

describe("Copilot Validators", () => {
  describe("copilotContextSchema", () => {
    it("validates minimal context", () => {
      const result = copilotContextSchema.safeParse({ workspace: "global" });
      expect(result.success).toBe(true);
    });

    it("validates full context", () => {
      const ctx = {
        workspace: "contract",
        contractAddress: "0xABC",
        contractSource: "pragma solidity ^0.8.0;",
        transactionHash: "0x123",
        transactionData: { to: "0xABC", value: "0", data: "0x" },
        walletAddress: "0xDEF",
        tokenAddress: "0xGHI",
        blockNumber: 12345,
        chainId: 1,
      };
      const result = copilotContextSchema.safeParse(ctx);
      expect(result.success).toBe(true);
    });

    it("rejects invalid workspace", () => {
      const result = copilotContextSchema.safeParse({ workspace: "invalid" });
      expect(result.success).toBe(false);
    });
  });

  describe("copilotSuggestionSchema", () => {
    it("validates a valid suggestion", () => {
      const s = {
        id: "test-1",
        workspace: "global",
        category: "security",
        severity: "critical",
        title: "Test",
        description: "Description",
        source: "test",
        timestamp: Date.now(),
      };
      const result = copilotSuggestionSchema.safeParse(s);
      expect(result.success).toBe(true);
    });

    it("rejects invalid severity", () => {
      const s = {
        id: "1", workspace: "global", category: "security",
        severity: "invalid", title: "T", description: "D",
        source: "test", timestamp: Date.now(),
      };
      expect(copilotSuggestionSchema.safeParse(s).success).toBe(false);
    });
  });

  describe("copilotMessageSchema", () => {
    it("validates user message", () => {
      const result = copilotMessageSchema.safeParse({
        id: "1", role: "user", content: "Hello", timestamp: Date.now(),
      });
      expect(result.success).toBe(true);
    });

    it("validates assistant message with workspace", () => {
      const result = copilotMessageSchema.safeParse({
        id: "1", role: "assistant", content: "Hello",
        timestamp: Date.now(), workspace: "global",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid role", () => {
      const result = copilotMessageSchema.safeParse({
        id: "1", role: "system", content: "Hello", timestamp: Date.now(),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("copilotConversationSchema", () => {
    it("validates a conversation", () => {
      const conv = {
        id: "1",
        sessionId: "s1",
        title: "Test",
        messages: [{ id: "1", role: "user", content: "Hi", timestamp: Date.now() }],
        isPinned: false,
        isBookmarked: false,
        tags: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const result = copilotConversationSchema.safeParse(conv);
      expect(result.success).toBe(true);
    });

    it("rejects missing sessionId", () => {
      const conv = {
        id: "1",
        title: "Test",
        messages: [],
        isPinned: false,
        isBookmarked: false,
        tags: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      expect(copilotConversationSchema.safeParse(conv).success).toBe(false);
    });
  });

  describe("quickActionSchema", () => {
    it("validates a quick action", () => {
      const result = quickActionSchema.safeParse({
        type: "explain",
        workspace: "contract",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid type", () => {
      expect(quickActionSchema.safeParse({ type: "invalid", workspace: "global" }).success).toBe(false);
    });
  });
});
