export interface ReceiptEventsDto {
  txHash: string;
  abi?: string;
}

export interface BlockEventsDto {
  number: number;
  abi?: string;
}

export interface RangeEventsDto {
  from: number;
  to: number;
  abi?: string;
}

export interface SearchEventsDto {
  contract?: string;
  event?: string;
  wallet?: string;
  fromBlock?: number;
  toBlock?: number;
  txHash?: string;
  abi?: string;
}
