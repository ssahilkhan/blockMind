export interface BuildAndSendDto {
  privateKey: string;
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

export interface EstimateGasDto {
  from: string;
  to?: string;
  value?: string;
  data?: string;
}

export interface SignTxDto {
  privateKey: string;
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

export interface BroadcastTxDto {
  signedTx: string;
}

export interface TrackTxDto {
  hash: string;
}
