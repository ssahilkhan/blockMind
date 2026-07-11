import type { AIProvider, AIProviderConfig, AIProviderID } from "../../types";
import { OpenAIProvider } from "./openai";

export function createProvider(id: AIProviderID, config: AIProviderConfig): AIProvider {
  switch (id) {
    case "openai":
      return new OpenAIProvider(config);
    case "anthropic":
      throw new Error("Anthropic provider not yet implemented.");
    case "openrouter":
      throw new Error("OpenRouter provider not yet implemented.");
    case "ollama":
      throw new Error("Ollama provider not yet implemented.");
    default:
      throw new Error(`Unknown provider: ${id}`);
  }
}

export function getAvailableProviders(): Array<{ id: AIProviderID; name: string }> {
  return [
    { id: "openai", name: "OpenAI" },
    { id: "anthropic", name: "Anthropic" },
    { id: "openrouter", name: "OpenRouter" },
    { id: "ollama", name: "Local Ollama" },
  ];
}
