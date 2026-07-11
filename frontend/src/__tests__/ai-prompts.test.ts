import {
  buildSystemPrompt,
  buildExplainPrompt,
  buildQuickActionPrompt,
  buildFollowUpPrompt,
  LEVEL_INSTRUCTIONS,
  MODE_CONTEXT_INSTRUCTIONS,
} from "@/features/ai/services/prompts";
import type { ContextPayload } from "@/features/ai/types";

const SAMPLE_PAYLOADS: ContextPayload[] = [
  { label: "Transaction Status", data: '{"status":"confirmed","blockNumber":42}' },
  { label: "Transaction Events", data: '[{"event":"Transfer"}]' },
];

describe("Prompt Builders", () => {
  describe("buildSystemPrompt", () => {
    it("includes mode and level instructions", () => {
      const prompt = buildSystemPrompt("transaction", "beginner");
      expect(prompt).toContain("BlockMind AI");
      expect(prompt).toContain("transaction");
      expect(prompt).toContain("beginner");
      expect(prompt).toContain(LEVEL_INSTRUCTIONS.beginner);
      expect(prompt).toContain(MODE_CONTEXT_INSTRUCTIONS.transaction);
    });

    it("uses developer level instructions", () => {
      const prompt = buildSystemPrompt("contract", "developer");
      expect(prompt).toContain("developer");
      expect(prompt).toContain(LEVEL_INSTRUCTIONS.developer);
    });

    it("covers all modes", () => {
      const modes = ["transaction", "contract", "wallet", "token", "event"] as const;
      for (const mode of modes) {
        const prompt = buildSystemPrompt(mode, "beginner");
        expect(prompt).toContain(MODE_CONTEXT_INSTRUCTIONS[mode]);
      }
    });
  });

  describe("buildExplainPrompt", () => {
    it("returns system + user messages", () => {
      const messages = buildExplainPrompt("transaction", "beginner", SAMPLE_PAYLOADS);
      expect(messages).toHaveLength(2);
      expect(messages[0].role).toBe("system");
      expect(messages[1].role).toBe("user");
    });

    it("includes context payload data", () => {
      const messages = buildExplainPrompt("transaction", "beginner", SAMPLE_PAYLOADS);
      expect(messages[1].content).toContain("Transaction Status");
      expect(messages[1].content).toContain("confirmed");
    });

    it("includes user query when provided", () => {
      const messages = buildExplainPrompt(
        "contract",
        "beginner",
        SAMPLE_PAYLOADS,
        "What does this contract do?",
      );
      expect(messages[1].content).toContain("What does this contract do?");
    });

    it("uses default query when none provided", () => {
      const messages = buildExplainPrompt("wallet", "beginner", []);
      expect(messages[1].content).toContain("wallet");
    });
  });

  describe("buildQuickActionPrompt", () => {
    it("returns system + user messages", () => {
      const messages = buildQuickActionPrompt("risks", "contract", "developer", SAMPLE_PAYLOADS);
      expect(messages).toHaveLength(2);
      expect(messages[0].role).toBe("system");
      expect(messages[1].role).toBe("user");
    });

    it("includes risk instructions for risks action", () => {
      const messages = buildQuickActionPrompt("risks", "contract", "developer", []);
      expect(messages[1].content).toContain("risk");
    });

    it("includes summarize instructions for summarize action", () => {
      const messages = buildQuickActionPrompt("summarize", "wallet", "beginner", []);
      expect(messages[1].content).toContain("brief");
    });

    it("includes simplify instructions", () => {
      const messages = buildQuickActionPrompt("simplify", "token", "beginner", []);
      expect(messages[1].content).toContain("beginner");
    });

    it("includes developer instructions for developer action", () => {
      const messages = buildQuickActionPrompt("developer", "contract", "developer", []);
      expect(messages[1].content).toContain("technical");
    });
  });

  describe("buildFollowUpPrompt", () => {
    it("includes prior messages", () => {
      const prior = [
        { role: "user", content: "What is this?" },
        { role: "assistant", content: "It is a transfer." },
      ];
      const messages = buildFollowUpPrompt(
        "How much was transferred?",
        "transaction",
        "beginner",
        SAMPLE_PAYLOADS,
        prior,
      );
      expect(messages.length).toBeGreaterThanOrEqual(3);
      const userMessages = messages.filter((m) => m.role === "user");
      expect(userMessages).toHaveLength(2);
      expect(userMessages[1].content).toContain("How much was transferred?");
    });

    it("limits prior messages to last 10", () => {
      const prior = Array.from({ length: 20 }, (_, i) => ({
        role: i % 2 === 0 ? "user" : "assistant",
        content: `Message ${i}`,
      }));
      const messages = buildFollowUpPrompt(
        "New question",
        "transaction",
        "beginner",
        [],
        prior,
      );
      expect(messages.length).toBeLessThanOrEqual(12);
    });
  });
});
