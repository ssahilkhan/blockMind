import {
  RawBlock,
  RawTransaction,
  RawReceipt,
} from '../types';

export interface EstimateGasParams {
  from: string;
  to?: string;
  value?: bigint;
  data?: string;
}

export interface IChainProvider {
  getBlock(blockNumberOrHash: number | string): Promise<RawBlock | null>;
  getTransaction(txHash: string): Promise<RawTransaction | null>;
  getReceipt(txHash: string): Promise<RawReceipt | null>;
  getBalance(address: string): Promise<bigint>;
  getTransactionCount(address: string): Promise<number>;
  getBlockNumber(): Promise<number>;
  getGasPrice(): Promise<bigint>;
  estimateGas(params: EstimateGasParams): Promise<bigint>;
  sendTransaction(signedTx: string): Promise<string>;
  call(params: { to: string; data: string }): Promise<string>;
  getNetwork(): Promise<{ chainId: number; name: string }>;
  isConnected(): boolean;
}
