import type { AIMode, AILevel, AIContext, ContextPayload } from "../types";

const LEVEL_INSTRUCTIONS: Record<AILevel, string> = {
  beginner:
    "Explain blockchain concepts in simple, everyday language. Avoid jargon. Use analogies. " +
    "Define technical terms when you must use them. Aim for clarity over precision.",
  developer:
    "Use precise blockchain terminology. Include technical details like gas, ABI encoding, " +
    "event topics, and contract storage patterns. Be concise and technical.",
};

const MODE_CONTEXT_INSTRUCTIONS: Record<AIMode, string> = {
  transaction:
    "You are explaining a blockchain transaction. Cover: what happened, who was involved, " +
    "gas used, success/failure status, events emitted, and value transferred.",
  contract:
    "You are explaining a smart contract. Cover: its purpose, key functions and what they do, " +
    "events it emits, potential risks or vulnerabilities, and access control patterns.",
  wallet:
    "You are explaining a blockchain wallet/address. Cover: token balances, NFT holdings, " +
    "recent transaction activity, and any notable patterns.",
  token:
    "You are explaining a token (ERC20, ERC721, or ERC1155). Cover: token standard, " +
    "metadata, supply, ownership, approvals, and transfer history.",
  event:
    "You are explaining a decoded blockchain event. Cover: what the event means, " +
    "its parameters, what state changed, and how it relates to the transaction.",
};

function formatContextPayloads(payloads: ContextPayload[]): string {
  if (payloads.length === 0) return "";
  return (
    "\n\nHere is the blockchain data I have collected for you to explain:\n\n" +
    payloads.map((p) => `--- ${p.label} ---\n${p.data}`).join("\n\n")
  );
}

export function buildSystemPrompt(mode: AIMode, level: AILevel): string {
  return (
    `You are BlockMind AI, an expert blockchain assistant built into the BlockMind dashboard. ` +
    `Your purpose is to help users understand blockchain data clearly and accurately.\n\n` +
    `Mode: ${mode}\n` +
    `Audience level: ${level}\n\n` +
    `${LEVEL_INSTRUCTIONS[level]}\n\n` +
    `${MODE_CONTEXT_INSTRUCTIONS[mode]}\n\n` +
    `Rules:\n` +
    `- Only explain data that is provided to you. Do not hallucinate addresses, amounts, or events.\n` +
    `- If data is missing or incomplete, say so honestly.\n` +
    `- Be concise. Prefer structured answers with bullet points.\n` +
    `- For risks, be specific about what could go wrong.\n`
  );
}

export function buildExplainPrompt(
  mode: AIMode,
  level: AILevel,
  contextPayloads: ContextPayload[],
  userQuery?: string,
): Array<{ role: string; content: string }> {
  const system = buildSystemPrompt(mode, level);
  const dataBlock = formatContextPayloads(contextPayloads);

  const userContent = userQuery
    ? `Please explain the following:\n${userQuery}${dataBlock}`
    : `Please explain this ${mode} in detail.${dataBlock}`;

  return [
    { role: "system", content: system },
    { role: "user", content: userContent },
  ];
}

export function buildQuickActionPrompt(
  action: string,
  mode: AIMode,
  level: AILevel,
  contextPayloads: ContextPayload[],
): Array<{ role: string; content: string }> {
  const system = buildSystemPrompt(mode, level);
  const dataBlock = formatContextPayloads(contextPayloads);

  const actionInstructions: Record<string, string> = {
    explain: "Explain this blockchain data in detail, highlighting the most important aspects.",
    summarize:
      "Provide a brief, clear summary of this blockchain data in 2-3 sentences.",
    risks:
      "Identify any potential risks, vulnerabilities, or concerns in this blockchain data. " +
      "Be specific about what could go wrong.",
    simplify:
      "Explain this blockchain data as if teaching a complete beginner. " +
      "Use everyday analogies and avoid all technical jargon.",
    developer:
      "Provide a deep technical analysis of this blockchain data. " +
      "Include details about gas, ABI encoding, storage patterns, and protocol-level concerns.",
  };

  return [
    { role: "system", content: system },
    {
      role: "user",
      content: `${actionInstructions[action] ?? actionInstructions.explain}${dataBlock}`,
    },
  ];
}

export function buildFollowUpPrompt(
  question: string,
  mode: AIMode,
  level: AILevel,
  contextPayloads: ContextPayload[],
  priorMessages: Array<{ role: string; content: string }>,
): Array<{ role: string; content: string }> {
  const system = buildSystemPrompt(mode, level);
  const dataBlock = formatContextPayloads(contextPayloads);

  const messages: Array<{ role: string; content: string }> = [
    { role: "system", content: system + dataBlock },
    ...priorMessages.slice(-10),
    { role: "user", content: question },
  ];

  return messages;
}

export { LEVEL_INSTRUCTIONS, MODE_CONTEXT_INSTRUCTIONS };
