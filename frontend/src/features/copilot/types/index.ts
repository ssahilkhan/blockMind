export type CopilotSeverity = "info" | "suggestion" | "warning" | "critical";

export type CopilotCategory =
  | "security"
  | "gas"
  | "best-practice"
  | "optimization"
  | "documentation"
  | "review";

export type CopilotWorkspace =
  | "contract"
  | "transaction"
  | "wallet"
  | "token"
  | "event"
  | "portfolio"
  | "global";

export type CopilotActionType =
  | "explain"
  | "optimize"
  | "review"
  | "summarize"
  | "document"
  | "audit"
  | "fix";

export interface CopilotSuggestion {
  id: string;
  workspace: CopilotWorkspace;
  category: CopilotCategory;
  severity: CopilotSeverity;
  title: string;
  description: string;
  details?: string;
  action?: CopilotAction;
  source: string;
  timestamp: number;
}

export interface CopilotAction {
  id: string;
  type: CopilotActionType;
  label: string;
  description: string;
  workspace: CopilotWorkspace;
  payload?: Record<string, unknown>;
}

export interface CopilotContext {
  workspace: CopilotWorkspace;
  contractAddress?: string;
  contractSource?: string;
  transactionHash?: string;
  transactionData?: {
    to?: string;
    value?: string;
    data?: string;
    gasPrice?: string;
  };
  walletAddress?: string;
  tokenAddress?: string;
  eventName?: string;
  blockNumber?: number;
  chainId?: number;
  metadata?: Record<string, unknown>;
}

export interface CopilotSession {
  id: string;
  workspace: CopilotWorkspace;
  context: CopilotContext;
  suggestions: CopilotSuggestion[];
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
  isBookmarked: boolean;
  title: string;
}

export interface CopilotRule {
  id: string;
  workspace: CopilotWorkspace;
  name: string;
  description: string;
  enabled: boolean;
  check: (context: CopilotContext) => CopilotSuggestion[];
}

export interface CopilotConversation {
  id: string;
  sessionId: string;
  title: string;
  messages: CopilotMessage[];
  isPinned: boolean;
  isBookmarked: boolean;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  workspace?: CopilotWorkspace;
  suggestionIds?: string[];
}

export interface CopilotQuickAction {
  id: string;
  type: CopilotActionType;
  label: string;
  icon: string;
  description: string;
}

export const SEVERITY_COLORS: Record<CopilotSeverity, string> = {
  info: "text-blue-500 bg-blue-500/10",
  suggestion: "text-purple-500 bg-purple-500/10",
  warning: "text-yellow-500 bg-yellow-500/10",
  critical: "text-red-500 bg-red-500/10",
};

export const SEVERITY_BORDER_COLORS: Record<CopilotSeverity, string> = {
  info: "border-blue-500/30",
  suggestion: "border-purple-500/30",
  warning: "border-yellow-500/30",
  critical: "border-red-500/30",
};

export const CATEGORY_LABELS: Record<CopilotCategory, string> = {
  security: "Security",
  gas: "Gas",
  "best-practice": "Best Practice",
  optimization: "Optimization",
  documentation: "Documentation",
  review: "Review",
};

export const WORKSPACE_LABELS: Record<CopilotWorkspace, string> = {
  contract: "Contract Studio",
  transaction: "Transaction Studio",
  wallet: "Wallet Workspace",
  token: "Token Explorer",
  event: "Event Explorer",
  portfolio: "Portfolio",
  global: "Global",
};

export const QUICK_ACTIONS: CopilotQuickAction[] = [
  { id: "explain-code", type: "explain", label: "Explain Code", icon: "BookOpen", description: "Explain the current code or contract" },
  { id: "explain-contract", type: "explain", label: "Explain Contract", icon: "FileCode2", description: "Explain the contract's purpose and functions" },
  { id: "optimize-gas", type: "optimize", label: "Optimize Gas", icon: "Zap", description: "Find gas optimization opportunities" },
  { id: "review-security", type: "review", label: "Review Security", icon: "ShieldCheck", description: "Run security analysis" },
  { id: "summarize-changes", type: "summarize", label: "Summarize Changes", icon: "ListChecks", description: "Summarize recent changes or activity" },
  { id: "generate-docs", type: "document", label: "Generate Docs", icon: "FileText", description: "Generate documentation" },
  { id: "generate-audit", type: "audit", label: "Audit Notes", icon: "ClipboardCheck", description: "Generate audit notes and findings" },
];
