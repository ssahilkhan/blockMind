import { callerService } from '../../../contract/caller/caller.service';
import { executorService } from '../../../contract/executor/executor.service';
import { ERC1155_ABI } from '../../constants/token.constants';
import { TokenStandard, TokenBalance } from '../../types/token.types';

export const erc1155Service = {
  async uri(address: string, tokenId: string): Promise<string> {
    const result = await callerService.read({
      contractAddress: address,
      abi: ERC1155_ABI,
      functionName: 'uri',
      args: [tokenId],
    });
    const value = result.result as { 0?: string };
    return value[0] ?? '';
  },

  async balanceOf(address: string, wallet: string, tokenId: string): Promise<TokenBalance> {
    const result = await callerService.read({
      contractAddress: address,
      abi: ERC1155_ABI,
      functionName: 'balanceOf',
      args: [wallet, tokenId],
    });
    const value = result.result as { 0?: bigint };
    return {
      address: wallet,
      tokenAddress: address,
      balance: value[0] !== undefined ? value[0].toString() : '0',
      tokenId,
      standard: TokenStandard.ERC1155,
    };
  },

  async safeTransferFrom(
    privateKey: string,
    tokenAddress: string,
    from: string,
    to: string,
    tokenId: string,
    amount: string
  ): Promise<string> {
    const result = await executorService.execute({
      contractAddress: tokenAddress,
      abi: ERC1155_ABI,
      functionName: 'safeTransferFrom',
      args: [from, to, tokenId, amount, '0x'],
      privateKey,
    });
    return result.transactionHash;
  },

  async setApprovalForAll(privateKey: string, tokenAddress: string, operator: string, approved: boolean): Promise<string> {
    const result = await executorService.execute({
      contractAddress: tokenAddress,
      abi: ERC1155_ABI,
      functionName: 'setApprovalForAll',
      args: [operator, approved],
      privateKey,
    });
    return result.transactionHash;
  },

  async isApprovedForAll(tokenAddress: string, owner: string, operator: string): Promise<boolean> {
    const result = await callerService.read({
      contractAddress: tokenAddress,
      abi: ERC1155_ABI,
      functionName: 'isApprovedForAll',
      args: [owner, operator],
    });
    const value = result.result as { 0?: boolean };
    return value[0] === true;
  },
};
