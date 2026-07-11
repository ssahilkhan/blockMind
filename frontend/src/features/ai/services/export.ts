import type { AIConversation, ConversationExport } from "../types";

export function exportConversationMarkdown(conversation: AIConversation): string {
  const lines: string[] = [
    `# ${conversation.title}`,
    "",
    `**Mode:** ${conversation.mode}`,
    `**Created:** ${new Date(conversation.createdAt).toISOString()}`,
    `**Exported:** ${new Date().toISOString()}`,
    "",
    "---",
    "",
  ];

  for (const msg of conversation.messages) {
    const role = msg.role === "user" ? "**You**" : "**BlockMind AI**";
    const time = new Date(msg.timestamp).toLocaleTimeString();
    lines.push(`${role} (${time}):`);
    lines.push("");
    lines.push(msg.content);
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}

export function exportConversationJSON(
  conversation: AIConversation,
): ConversationExport {
  return {
    version: "1.0",
    exportedAt: Date.now(),
    conversation,
  };
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
