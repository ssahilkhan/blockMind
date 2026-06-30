export interface RegisteredContract {
  address: string;
  abi: unknown[];
  label?: string;
}

export interface RegistryEntry {
  signature: string;
  name: string;
  standard: string;
}

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

export interface DecodedEventResult {
  events: DecodedEvent[];
  total: number;
}

export interface FilterCriteria {
  contract?: string;
  eventName?: string;
  wallet?: string;
  fromBlock?: number;
  toBlock?: number;
  txHash?: string;
}

export interface RegistryInfo {
  standards: string[];
  events: RegistryEntry[];
  contracts: RegisteredContract[];
}
