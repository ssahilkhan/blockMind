export interface BuildTransactionParams {
  to?: string;
  value?: string;
  data?: string;
  nonce?: number;
  gasLimit?: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  chainId?: number;
}

export interface EstimateGasParams {
  from: string;
  to?: string;
  value?: string;
  data?: string;
}

export interface GasEstimateResult {
  gasEstimation: string;
  gasEstimationWei: string;
}

export interface BroadcastResult {
  transactionHash: string;
}

export interface TrackResult {
  status: 'pending' | 'confirmed' | 'failed';
  confirmations?: number;
  blockNumber?: number;
  receipt?: {
    transactionHash: string;
    blockNumber: number;
    blockHash: string;
    from: string;
    to: string | null;
    status: 'success' | 'failed';
    gasUsed: string;
    gasPrice: string;
    contractAddress: string | null;
  };
  error?: string;
}
