import {
  getRules,
  runRules,
  getWorkspaceSuggestions,
  resetEngineId,
} from "@/features/copilot/engine";
import type { CopilotContext, CopilotWorkspace } from "@/features/copilot/types";

function makeCtx(ws: CopilotWorkspace = "global"): CopilotContext {
  return { workspace: ws };
}

describe("Copilot Engine", () => {
  beforeEach(() => {
    resetEngineId();
  });

  it("getRules returns default rules with check function", () => {
    const rules = getRules();
    expect(rules.length).toBeGreaterThan(0);
    expect(rules[0]).toHaveProperty("id");
    expect(rules[0]).toHaveProperty("check");
    expect(typeof rules[0].check).toBe("function");
  });

  it("runRules returns suggestions from matching rules", () => {
    const suggestions = runRules(makeCtx("wallet"), []);
    expect(Array.isArray(suggestions)).toBe(true);
    suggestions.forEach((s) => {
      expect(s).toHaveProperty("id");
      expect(s).toHaveProperty("severity");
      expect(s).toHaveProperty("category");
      expect(s).toHaveProperty("title");
    });
  });

  it("getWorkspaceSuggestions returns suggestions for any workspace", () => {
    const workspaces: CopilotWorkspace[] = [
      "contract", "transaction", "wallet", "token", "event", "portfolio", "global",
    ];
    workspaces.forEach((ws) => {
      const suggestions = getWorkspaceSuggestions(ws, makeCtx(ws));
      expect(Array.isArray(suggestions)).toBe(true);
    });
  });

  it("suggestions have unique IDs", () => {
    const suggestions = getWorkspaceSuggestions("global", makeCtx("global"));
    const ids = suggestions.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
