import { createProvider, getAvailableProviders } from "@/features/ai/services/providers";
import type { AIProviderConfig } from "@/features/ai/types";

const MOCK_CONFIG: AIProviderConfig = {
  id: "openai",
  apiKey: "sk-test",
  model: "gpt-4o-mini",
};

describe("Provider Abstraction", () => {
  describe("createProvider", () => {
    it("creates OpenAI provider", () => {
      const provider = createProvider("openai", MOCK_CONFIG);
      expect(provider.id).toBe("openai");
      expect(provider.name).toBe("OpenAI");
      expect(provider.isConfigured).toBe(true);
    });

    it("marks unconfigured when no API key", () => {
      const provider = createProvider("openai", { id: "openai" });
      expect(provider.isConfigured).toBe(false);
    });

    it("throws for anthropic", () => {
      expect(() => createProvider("anthropic", MOCK_CONFIG)).toThrow(
        "not yet implemented",
      );
    });

    it("throws for openrouter", () => {
      expect(() => createProvider("openrouter", MOCK_CONFIG)).toThrow(
        "not yet implemented",
      );
    });

    it("throws for ollama", () => {
      expect(() => createProvider("ollama", MOCK_CONFIG)).toThrow(
        "not yet implemented",
      );
    });
  });

  describe("getAvailableProviders", () => {
    it("returns 4 providers", () => {
      const providers = getAvailableProviders();
      expect(providers).toHaveLength(4);
    });

    it("includes openai", () => {
      const providers = getAvailableProviders();
      expect(providers.find((p) => p.id === "openai")).toBeDefined();
    });
  });
});

describe("OpenAI Provider", () => {
  it("throws when sending without API key", async () => {
    const provider = createProvider("openai", { id: "openai" });
    await expect(
      provider.sendMessage(
        [{ role: "user", content: "Hello" }],
        { id: "openai" },
      ),
    ).rejects.toThrow("API key is not configured");
  });
});
