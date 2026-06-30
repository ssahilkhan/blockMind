export interface RawBlock {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  transactions: string[];
  gasUsed: bigint;
  gasLimit: bigint;
  miner: string;
  extraData: string;
  difficulty: bigint;
  baseFeePerGas: bigint | null;
  size: number | null;
}

export interface RawTransaction {
  hash: string;
  blockNumber: number | null;
  blockHash: string | null;
  from: string;
  to: string | null;
  value: bigint;
  gasPrice: bigint;
  gasLimit: bigint;
  nonce: number;
  input: string;
}

export interface RawReceipt {
  transactionHash: string;
  blockNumber: number;
  blockHash: string;
  from: string;
  to: string | null;
  status: number;
  gasUsed: bigint;
  gasPrice: bigint;
  cumulativeGasUsed: bigint;
  contractAddress: string | null;
  logs: RawLog[];
}

export interface RawLog {
  address: string;
  topics: string[];
  data: string;
  logIndex: number;
}

export interface BlockResponse {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: string;
  transactionCount: number;
  transactions: string[];
  gasUsed: string;
  gasLimit: string;
  gasUsedPercent: string;
  miner: string;
  difficulty: string;
  baseFee: string | null;
  extraData: string;
  size: number | null;
}

export interface TransactionResponse {
  hash: string;
  blockNumber: number | null;
  blockHash: string | null;
  from: string;
  to: string | null;
  value: string;
  gasPrice: string;
  gasLimit: string;
  nonce: number;
  input: string;
}

export interface ReceiptResponse {
  transactionHash: string;
  blockNumber: number;
  blockHash: string;
  from: string;
  to: string | null;
  status: 'success' | 'failed';
  gasUsed: string;
  gasPrice: string;
  cumulativeGasUsed: string;
  contractAddress: string | null;
  logs: LogResponse[];
}

export interface LogResponse {
  address: string;
  topics: string[];
  data: string;
  logIndex: number;
}

export interface NetworkResponse {
  chainId: number;
  name: string;
  currency: string;
  latestBlock: number;
}

export interface GasResponse {
  gasPrice: string;
  baseFee: string | null;
}

export interface StatsResponse {
  latestBlock: number;
  gasPrice: string;
  chainId: number;
  network: string;
}

export interface SearchResult {
  type: 'block' | 'transaction' | 'address' | 'unknown';
  data: unknown;
}
