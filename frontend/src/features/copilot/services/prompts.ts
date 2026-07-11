import type { CopilotContext, CopilotWorkspace, CopilotActionType } from "../types";

const WORKSPACE_SYSTEM_PROMPTS: Record<CopilotWorkspace, string> = {
  contract:
    "You are a Solidity smart contract expert. Analyze contracts for security vulnerabilities, " +
    "gas optimizations, best practices, and code quality. Be specific about findings and provide " +
    "actionable suggestions with code examples when appropriate.",
  transaction:
    "You are a blockchain transaction analyst. Analyze transactions for gas optimization, " +
    "security risks, value protection, and suspicious patterns. Explain what each part of the " +
    "transaction does in clear terms.",
  wallet:
    "You are a blockchain wallet security advisor. Analyze wallet health, approval risks, " +
    "dormancy, balance management, and security best practices. Prioritize actionable security advice.",
  token:
    "You are a token standards expert. Explain ERC-20, ERC-721, ERC-1155 tokens, their " +
    "implications, approval mechanics, minting risks, and interaction safety.",
  event:
    "You are a blockchain event decoder. Explain decoded events, their parameters, what state " +
    "changes they represent, and how they relate to the transaction lifecycle.",
  portfolio:
    "You are a portfolio analyst. Provide insights on asset distribution, activity patterns, " +
    "risk assessment, and portfolio optimization for blockchain wallets.",
  global:
    "You are BlockMind Developer Copilot, an expert blockchain development assistant. " +
    "Help developers understand, optimize, and secure their blockchain applications.",
};

const ACTION_PROMPTS: Record<CopilotActionType, string> = {
  explain: "Provide a clear, detailed explanation of the provided code or data.",
  optimize: "Analyze for optimization opportunities (gas, performance, cost).",
  review: "Perform a thorough code or security review with specific findings.",
  summarize: "Provide a concise summary of the key points and implications.",
  document: "Generate comprehensive documentation for the code or contract.",
  audit: "Perform a security audit and produce structured audit notes.",
  fix: "Identify issues and suggest specific fixes with code examples.",
};

export function buildCopilotSystemPrompt(
  workspace: CopilotWorkspace,
  actionType?: CopilotActionType,
): string {
  const base = WORKSPACE_SYSTEM_PROMPTS[workspace] ?? WORKSPACE_SYSTEM_PROMPTS.global;
  const action = actionType ? ACTION_PROMPTS[actionType] : "";

  return (
    `${base}\n\n` +
    `You are part of BlockMind, a professional blockchain development platform.\n` +
    `Always provide specific, actionable advice. Reference concrete line numbers or functions when possible.\n` +
    `Format responses with clear sections, bullet points, and code blocks.\n` +
    `${action ? `\nSpecific task: ${action}\n` : ""}` +
    `Rules:\n` +
    `- Only analyze data provided. Do not hallucinate.\n` +
    `- If data is insufficient, say so.\n` +
    `- Be concise but thorough.\n` +
    `- Prioritize critical security issues first.\n`
  );
}

export function buildCopilotQuickActionPrompt(
  actionType: CopilotActionType,
  workspace: CopilotWorkspace,
  context: CopilotContext,
): Array<{ role: string; content: string }> {
  const system = buildCopilotSystemPrompt(workspace, actionType);
  const contextBlock = formatCopilotContext(context);

  return [
    { role: "system", content: system },
    {
      role: "user",
      content: `${ACTION_PROMPTS[actionType]}\n\n${contextBlock}`,
    },
  ];
}

export function buildCopilotFollowUpPrompt(
  question: string,
  workspace: CopilotWorkspace,
  context: CopilotContext,
  priorMessages: Array<{ role: string; content: string }>,
): Array<{ role: string; content: string }> {
  const system = buildCopilotSystemPrompt(workspace);
  const contextBlock = formatCopilotContext(context);

  return [
    { role: "system", content: system + contextBlock },
    ...priorMessages.slice(-10),
    { role: "user", content: question },
  ];
}

function formatCopilotContext(context: CopilotContext): string {
  const parts: string[] = [];
  parts.push(`\nCurrent workspace: ${context.workspace}`);

  if (context.contractAddress) parts.push(`Contract: ${context.contractAddress}`);
  if (context.contractSource) parts.push(`Source:\n${context.contractSource}`);
  if (context.transactionHash) parts.push(`Transaction: ${context.transactionHash}`);
  if (context.transactionData) {
    parts.push(`Tx Data: to=${context.transactionData.to ?? "N/A"}, value=${context.transactionData.value ?? "0"}, data=${context.transactionData.data?.slice(0, 100) ?? "0x"}`);
  }
  if (context.walletAddress) parts.push(`Wallet: ${context.walletAddress}`);
  if (context.tokenAddress) parts.push(`Token: ${context.tokenAddress}`);
  if (context.eventName) parts.push(`Event: ${context.eventName}`);
  if (context.blockNumber) parts.push(`Block: ${context.blockNumber}`);
  if (context.metadata) {
    parts.push(`Metadata: ${JSON.stringify(context.metadata, null, 2).slice(0, 500)}`);
  }

  return parts.join("\n");
}

export { WORKSPACE_SYSTEM_PROMPTS, ACTION_PROMPTS };
