import type { CopilotContext, CopilotActionType, CopilotWorkspace } from "../types";
import type { AIProviderConfig } from "@/features/ai/types";
import { createProvider } from "@/features/ai/services/providers";
import { buildCopilotQuickActionPrompt, buildCopilotFollowUpPrompt } from "./prompts";

export interface CopilotChatRequest {
  input: string;
  workspace: CopilotWorkspace;
  context: CopilotContext;
  providerConfig: AIProviderConfig;
  priorMessages?: Array<{ role: string; content: string }>;
  actionType?: CopilotActionType;
}

export interface CopilotChatResponse {
  content: string;
  tokensUsed?: number;
}

export async function sendCopilotMessage(
  request: CopilotChatRequest,
): Promise<CopilotChatResponse> {
  const { input, workspace, context, providerConfig, priorMessages, actionType } = request;
  const provider = createProvider(providerConfig.id, providerConfig);

  let messages: Array<{ role: string; content: string }>;

  if (priorMessages && priorMessages.length > 0) {
    messages = buildCopilotFollowUpPrompt(input, workspace, context, priorMessages);
  } else if (actionType) {
    messages = buildCopilotQuickActionPrompt(actionType, workspace, context);
  } else {
    messages = buildCopilotQuickActionPrompt("review", workspace, context);
    messages[1] = { role: "user", content: input };
  }

  const response = await provider.sendMessage(messages, providerConfig);

  return {
    content: response.content,
    tokensUsed: response.tokensUsed,
  };
}
