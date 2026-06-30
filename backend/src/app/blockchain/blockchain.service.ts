import { ethers } from 'ethers';
import { config } from '../config';
import { logger } from '../logger';

let provider: ethers.JsonRpcProvider | null = null;
let connected = false;

export const blockchainService = {
  async connect(): Promise<void> {
    provider = new ethers.JsonRpcProvider(config.RPC_URL);
    try {
      await provider.getNetwork();
      connected = true;
      logger.info('Connected to blockchain', { rpc: config.RPC_URL });
    } catch (err) {
      connected = false;
      logger.error('Failed to connect to blockchain', {
        rpc: config.RPC_URL,
        error: (err as Error).message,
      });
      throw err;
    }
  },

  isConnected(): boolean {
    return connected;
  },

  getProvider(): ethers.JsonRpcProvider {
    if (!provider) {
      throw new Error('Blockchain provider not initialized. Call connect() first.');
    }
    return provider;
  },

  async getChainId(): Promise<number> {
    const network = await this.getProvider().getNetwork();
    return Number(network.chainId);
  },

  async getBlockNumber(): Promise<number> {
    return this.getProvider().getBlockNumber();
  },

  async getNetwork(): Promise<{ chainId: number; name: string }> {
    const network = await this.getProvider().getNetwork();
    return { chainId: Number(network.chainId), name: network.name || 'unknown' };
  },

  async getGasPrice(): Promise<string> {
    const feeData = await this.getProvider().getFeeData();
    if (!feeData.gasPrice) {
      return '0 ETH';
    }
    return `${ethers.formatEther(feeData.gasPrice)} ETH`;
  },
};
