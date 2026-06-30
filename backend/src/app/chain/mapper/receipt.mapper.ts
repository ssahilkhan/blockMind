import { ethers } from 'ethers';
import { RawReceipt, ReceiptResponse } from '../types';

export const receiptMapper = {
  toResponse(raw: RawReceipt): ReceiptResponse {
    return {
      transactionHash: raw.transactionHash,
      blockNumber: raw.blockNumber,
      blockHash: raw.blockHash,
      from: raw.from,
      to: raw.to,
      status: raw.status === 1 ? 'success' : 'failed',
      gasUsed: raw.gasUsed.toString(),
      gasPrice: ethers.formatUnits(raw.gasPrice, 'gwei') + ' gwei',
      cumulativeGasUsed: raw.cumulativeGasUsed.toString(),
      contractAddress: raw.contractAddress,
      logs: raw.logs.map((log) => ({
        address: log.address,
        topics: log.topics,
        data: log.data,
        logIndex: log.logIndex,
      })),
    };
  },
};
