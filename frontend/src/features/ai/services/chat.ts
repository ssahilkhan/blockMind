import type {
  AIMessage,
  AIContext,
  AIProviderConfig,
  AIMode,
  AILevel,
  QuickAction,
} from "../types";
import { createProvider } from "./providers";
import { buildExplainPrompt, buildQuickActionPrompt, buildFollowUpPrompt } from "./prompts";
import { gatherContextPayloads } from "./context-gathering";

export interface ChatRequest {
  input: string;
  mode: AIMode;
  level: AILevel;
  context: AIContext;
  providerConfig: AIProviderConfig;
  priorMessages: AIMessage[];
  quickAction?: QuickAction;
}

export interface ChatResponse {
  message: AIMessage;
  tokensUsed?: number;
}

export async function sendMessage(request: ChatRequest): Promise<ChatResponse> {
  const { input, mode, level, context, providerConfig, priorMessages, quickAction } =
    request;

  const contextPayloads = await gatherContextPayloads(context);
  const provider = createProvider(providerConfig.id, providerConfig);

  const priorFormatted = priorMessages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  let messages: Array<{ role: string; content: string }>;

  if (quickAction) {
    messages = buildQuickActionPrompt(quickAction, mode, level, contextPayloads);
  } else if (priorMessages.length > 0) {
    messages = buildFollowUpPrompt(
      input,
      mode,
      level,
      contextPayloads,
      priorFormatted,
    );
  } else {
    messages = buildExplainPrompt(mode, level, contextPayloads, input);
  }

  const response = await provider.sendMessage(messages, providerConfig);

  const assistantMessage: AIMessage = {
    id: crypto.randomUUID(),
    role: "assistant",
    content: response.content,
    timestamp: Date.now(),
    mode,
    quickAction,
  };

  return {
    message: assistantMessage,
    tokensUsed: response.tokensUsed,
  };
}
