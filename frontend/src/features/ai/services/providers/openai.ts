import type { AIProvider, AIProviderConfig, AIProviderResponse } from "../../types";

export class OpenAIProvider implements AIProvider {
  id = "openai" as const;
  name = "OpenAI";
  isConfigured = false;

  private apiKey: string;
  private model: string;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey ?? "";
    this.model = config.model ?? "gpt-4o-mini";
    this.isConfigured = this.apiKey.length > 0;
  }

  async sendMessage(
    messages: Array<{ role: string; content: string }>,
    config: AIProviderConfig,
  ): Promise<AIProviderResponse> {
    if (!this.isConfigured) {
      throw new Error("OpenAI API key is not configured.");
    }

    const baseUrl = config.baseUrl ?? "https://api.openai.com/v1";
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText} ${errorBody}`,
      );
    }

    const data = await response.json();
    const choice = data.choices?.[0];

    return {
      content: choice?.message?.content ?? "No response from OpenAI.",
      tokensUsed: data.usage?.total_tokens,
      model: data.model,
    };
  }
}
