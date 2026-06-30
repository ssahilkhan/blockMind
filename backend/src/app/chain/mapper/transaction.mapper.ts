import { ethers } from 'ethers';
import { RawTransaction, TransactionResponse } from '../types';

export const transactionMapper = {
  toResponse(raw: RawTransaction): TransactionResponse {
    return {
      hash: raw.hash,
      blockNumber: raw.blockNumber,
      blockHash: raw.blockHash,
      from: raw.from,
      to: raw.to,
      value: ethers.formatEther(raw.value) + ' ETH',
      gasPrice: ethers.formatUnits(raw.gasPrice, 'gwei') + ' gwei',
      gasLimit: raw.gasLimit.toString(),
      nonce: raw.nonce,
      input: raw.input,
    };
  },
};
