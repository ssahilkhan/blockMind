import { callerService } from '../../../contract/caller/caller.service';
import { executorService } from '../../../contract/executor/executor.service';
import { ERC721_ABI } from '../../constants/token.constants';
import { TokenStandard, TokenBalance } from '../../types/token.types';

export const erc721Service = {
  async name(address: string): Promise<string> {
    const result = await callerService.read({
      contractAddress: address,
      abi: ERC721_ABI,
      functionName: 'name',
      args: [],
    });
    const value = result.result as { 0?: string };
    return value[0] ?? '';
  },

  async symbol(address: string): Promise<string> {
    const result = await callerService.read({
      contractAddress: address,
      abi: ERC721_ABI,
      functionName: 'symbol',
      args: [],
    });
    const value = result.result as { 0?: string };
    return value[0] ?? '';
  },

  async balanceOf(address: string, wallet: string): Promise<TokenBalance> {
    const result = await callerService.read({
      contractAddress: address,
      abi: ERC721_ABI,
      functionName: 'balanceOf',
      args: [wallet],
    });
    const value = result.result as { 0?: bigint };
    return {
      address: wallet,
      tokenAddress: address,
      balance: value[0] !== undefined ? value[0].toString() : '0',
      standard: TokenStandard.ERC721,
    };
  },

  async ownerOf(address: string, tokenId: string): Promise<string> {
    const result = await callerService.read({
      contractAddress: address,
      abi: ERC721_ABI,
      functionName: 'ownerOf',
      args: [tokenId],
    });
    const value = result.result as { 0?: string };
    if (!value[0]) throw new Error('Token not found');
    return value[0];
  },

  async safeTransferFrom(privateKey: string, tokenAddress: string, from: string, to: string, tokenId: string): Promise<string> {
    const result = await executorService.execute({
      contractAddress: tokenAddress,
      abi: ERC721_ABI,
      functionName: 'safeTransferFrom',
      args: [from, to, tokenId],
      privateKey,
    });
    return result.transactionHash;
  },

  async approve(privateKey: string, tokenAddress: string, approved: string, tokenId: string): Promise<string> {
    const result = await executorService.execute({
      contractAddress: tokenAddress,
      abi: ERC721_ABI,
      functionName: 'approve',
      args: [approved, tokenId],
      privateKey,
    });
    return result.transactionHash;
  },

  async setApprovalForAll(privateKey: string, tokenAddress: string, operator: string, approved: boolean): Promise<string> {
    const result = await executorService.execute({
      contractAddress: tokenAddress,
      abi: ERC721_ABI,
      functionName: 'setApprovalForAll',
      args: [operator, approved],
      privateKey,
    });
    return result.transactionHash;
  },

  async getApproved(tokenAddress: string, tokenId: string): Promise<string> {
    const result = await callerService.read({
      contractAddress: tokenAddress,
      abi: ERC721_ABI,
      functionName: 'getApproved',
      args: [tokenId],
    });
    const value = result.result as { 0?: string };
    return value[0] ?? '0x0000000000000000000000000000000000000000';
  },

  async isApprovedForAll(tokenAddress: string, owner: string, operator: string): Promise<boolean> {
    const result = await callerService.read({
      contractAddress: tokenAddress,
      abi: ERC721_ABI,
      functionName: 'isApprovedForAll',
      args: [owner, operator],
    });
    const value = result.result as { 0?: boolean };
    return value[0] === true;
  },

  async tokenURI(tokenAddress: string, tokenId: string): Promise<string> {
    const result = await callerService.read({
      contractAddress: tokenAddress,
      abi: ERC721_ABI,
      functionName: 'tokenURI',
      args: [tokenId],
    });
    const value = result.result as { 0?: string };
    return value[0] ?? '';
  },
};
