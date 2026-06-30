import { ethers } from 'ethers';
import { RawBlock, BlockResponse } from '../types';

export const blockMapper = {
  toResponse(raw: RawBlock): BlockResponse {
    const gasUsedPercent =
      raw.gasLimit > 0n
        ? ((Number(raw.gasUsed) / Number(raw.gasLimit)) * 100).toFixed(2) + '%'
        : '0%';

    return {
      number: raw.number,
      hash: raw.hash,
      parentHash: raw.parentHash,
      timestamp: new Date(raw.timestamp * 1000).toISOString(),
      transactionCount: raw.transactions.length,
      transactions: raw.transactions,
      gasUsed: raw.gasUsed.toString(),
      gasLimit: raw.gasLimit.toString(),
      gasUsedPercent,
      miner: raw.miner,
      difficulty: raw.difficulty.toString(),
      baseFee: raw.baseFeePerGas
        ? ethers.formatUnits(raw.baseFeePerGas, 'gwei') + ' gwei'
        : null,
      extraData: raw.extraData,
      size: raw.size,
    };
  },
};
