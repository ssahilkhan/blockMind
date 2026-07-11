import {
  buildCopilotSystemPrompt,
  buildCopilotQuickActionPrompt,
  buildCopilotFollowUpPrompt,
  WORKSPACE_SYSTEM_PROMPTS,
  ACTION_PROMPTS,
} from "@/features/copilot/services/prompts";
import type { CopilotContext } from "@/features/copilot/types";

describe("Copilot Prompts", () => {
  it("buildCopilotSystemPrompt returns string with workspace context", () => {
    const prompt = buildCopilotSystemPrompt("contract", "review");
    expect(prompt).toContain("Solidity");
    expect(prompt).toContain("review");
    expect(prompt).toContain("BlockMind");
  });

  it("buildCopilotSystemPrompt falls back to global", () => {
    const prompt = buildCopilotSystemPrompt("global");
    expect(prompt).toContain("BlockMind Developer Copilot");
  });

  it("buildCopilotQuickActionPrompt returns messages array", () => {
    const ctx: CopilotContext = { workspace: "contract" };
    const messages = buildCopilotQuickActionPrompt("explain", "contract", ctx);
    expect(messages.length).toBe(2);
    expect(messages[0].role).toBe("system");
    expect(messages[1].role).toBe("user");
  });

  it("buildCopilotFollowUpPrompt returns messages array", () => {
    const ctx: CopilotContext = { workspace: "wallet" };
    const prior = [{ role: "user", content: "Hi" }];
    const messages = buildCopilotFollowUpPrompt("What about gas?", "wallet", ctx, prior);
    expect(messages.length).toBeGreaterThanOrEqual(2);
    expect(messages[messages.length - 1].role).toBe("user");
    expect(messages[messages.length - 1].content).toContain("gas");
  });

  it("WORKSPACE_SYSTEM_PROMPTS covers all workspaces", () => {
    const keys = Object.keys(WORKSPACE_SYSTEM_PROMPTS);
    expect(keys).toContain("contract");
    expect(keys).toContain("transaction");
    expect(keys).toContain("wallet");
    expect(keys).toContain("token");
    expect(keys).toContain("event");
    expect(keys).toContain("portfolio");
    expect(keys).toContain("global");
  });

  it("ACTION_PROMPTS covers all action types", () => {
    const keys = Object.keys(ACTION_PROMPTS);
    expect(keys).toContain("explain");
    expect(keys).toContain("optimize");
    expect(keys).toContain("review");
    expect(keys).toContain("summarize");
    expect(keys).toContain("document");
    expect(keys).toContain("audit");
    expect(keys).toContain("fix");
  });
});
