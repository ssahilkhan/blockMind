import { callerService } from '../../../contract/caller/caller.service';
import { executorService } from '../../../contract/executor/executor.service';
import { ERC20_ABI } from '../../constants/token.constants';
import { TokenBalance } from '../../types/token.types';
import { TokenStandard } from '../../types/token.types';

export const erc20Service = {
  async name(address: string): Promise<string> {
    const result = await callerService.read({
      contractAddress: address,
      abi: ERC20_ABI,
      functionName: 'name',
      args: [],
    });
    const value = result.result as { 0?: string };
    return value[0] ?? '';
  },

  async symbol(address: string): Promise<string> {
    const result = await callerService.read({
      contractAddress: address,
      abi: ERC20_ABI,
      functionName: 'symbol',
      args: [],
    });
    const value = result.result as { 0?: string };
    return value[0] ?? '';
  },

  async decimals(address: string): Promise<number> {
    const result = await callerService.read({
      contractAddress: address,
      abi: ERC20_ABI,
      functionName: 'decimals',
      args: [],
    });
    const value = result.result as { 0?: bigint };
    return value[0] !== undefined ? Number(value[0]) : 18;
  },

  async totalSupply(address: string): Promise<string> {
    const result = await callerService.read({
      contractAddress: address,
      abi: ERC20_ABI,
      functionName: 'totalSupply',
      args: [],
    });
    const value = result.result as { 0?: bigint };
    return value[0] !== undefined ? value[0].toString() : '0';
  },

  async balanceOf(address: string, wallet: string): Promise<TokenBalance> {
    const result = await callerService.read({
      contractAddress: address,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [wallet],
    });
    const value = result.result as { 0?: bigint };
    return {
      address: wallet,
      tokenAddress: address,
      balance: value[0] !== undefined ? value[0].toString() : '0',
      standard: TokenStandard.ERC20,
    };
  },

  async transfer(privateKey: string, tokenAddress: string, to: string, amount: string): Promise<string> {
    const result = await executorService.execute({
      contractAddress: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [to, amount],
      privateKey,
    });
    return result.transactionHash;
  },

  async approve(privateKey: string, tokenAddress: string, spender: string, amount: string): Promise<string> {
    const result = await executorService.execute({
      contractAddress: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spender, amount],
      privateKey,
    });
    return result.transactionHash;
  },

  async allowance(tokenAddress: string, owner: string, spender: string): Promise<string> {
    const result = await callerService.read({
      contractAddress: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: [owner, spender],
    });
    const value = result.result as { 0?: bigint };
    return value[0] !== undefined ? value[0].toString() : '0';
  },
};
