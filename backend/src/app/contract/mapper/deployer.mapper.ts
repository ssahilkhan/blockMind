import { DeployResult } from '../types/contract.types';

export interface DeployResponse {
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
  gasUsed: string;
  status: string;
}

export const deployerMapper = {
  toResponse(result: DeployResult): DeployResponse {
    return {
      contractAddress: result.contractAddress,
      transactionHash: result.transactionHash,
      blockNumber: result.blockNumber,
      gasUsed: result.gasUsed,
      status: result.status,
    };
  },
};
