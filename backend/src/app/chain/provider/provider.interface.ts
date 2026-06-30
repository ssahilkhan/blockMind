import {
  RawBlock,
  RawTransaction,
  RawReceipt,
} from '../types';

export interface IChainProvider {
  getBlock(blockNumberOrHash: number | string): Promise<RawBlock | null>;
  getTransaction(txHash: string): Promise<RawTransaction | null>;
  getReceipt(txHash: string): Promise<RawReceipt | null>;
  getBalance(address: string): Promise<bigint>;
  getTransactionCount(address: string): Promise<number>;
  getBlockNumber(): Promise<number>;
  getGasPrice(): Promise<bigint>;
  getNetwork(): Promise<{ chainId: number; name: string }>;
  isConnected(): boolean;
}
