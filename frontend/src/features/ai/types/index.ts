export type AIMode = "transaction" | "contract" | "wallet" | "token" | "event";

export type AILevel = "beginner" | "developer";

export type AIProviderID = "openai" | "anthropic" | "openrouter" | "ollama";

export type MessageRole = "user" | "assistant" | "system";

export interface AIMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  mode?: AIMode;
  quickAction?: QuickAction;
}

export type QuickAction = "explain" | "summarize" | "risks" | "simplify" | "developer";

export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  mode: AIMode;
  context: AIContext;
  createdAt: number;
  updatedAt: number;
}

export interface AIContext {
  type: AIMode | "portfolio" | null;
  walletAddress?: string;
  transactionHash?: string;
  contractAddress?: string;
  tokenAddress?: string;
  eventName?: string;
  blockNumber?: number;
  chainId?: number;
}

export interface AIProviderConfig {
  id: AIProviderID;
  name?: string;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export interface AIProviderResponse {
  content: string;
  tokensUsed?: number;
  model?: string;
}

export interface AIProvider {
  id: AIProviderID;
  name: string;
  isConfigured: boolean;
  sendMessage(
    messages: Array<{ role: string; content: string }>,
    config: AIProviderConfig,
  ): Promise<AIProviderResponse>;
}

export interface ConversationExport {
  version: "1.0";
  exportedAt: number;
  conversation: AIConversation;
}

export interface ContextPayload {
  label: string;
  data: string;
}
