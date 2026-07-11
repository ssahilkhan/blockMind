export interface DecodedEvent {
  eventName: string;
  signature: string;
  args: Record<string, unknown>;
  contract: string;
  logIndex: number;
  blockNumber: number;
  blockHash: string;
  transactionHash: string;
  from: string;
  to: string | null;
}

export interface EventListResponse {
  events: DecodedEvent[];
  total: number;
}

export interface RegistryEntry {
  signature: string;
  name: string;
  standard: string;
}

export interface RegistryInfo {
  standards: string[];
  events: RegistryEntry[];
  contracts: Array<{ address: string; label?: string }>;
}

export interface RecentEvent {
  eventName: string;
  contract: string;
  blockNumber: number;
  transactionHash: string;
  viewedAt: number;
}

export const STANDARD_BADGE_COLORS: Record<string, string> = {
  ERC20: "bg-blue-500/10 text-blue-600",
  ERC721: "bg-purple-500/10 text-purple-600",
  ERC1155: "bg-orange-500/10 text-orange-600",
  Custom: "bg-gray-500/10 text-gray-600",
};

export function guessStandardFromEventName(name: string): string {
  if (["Transfer", "Approval"].includes(name)) return "ERC20";
  if (["ApprovalForAll", "OwnershipTransferred"].includes(name)) return "ERC721";
  if (["TransferSingle", "TransferBatch"].includes(name)) return "ERC1155";
  return "Custom";
}
