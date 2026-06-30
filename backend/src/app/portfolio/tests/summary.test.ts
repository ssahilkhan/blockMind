import { summaryService } from '../summary/summary.service';
import { AssetItem, NFTItem, HistoryEntry } from '../types/portfolio.types';
import { TokenStandard } from '../../token/types/token.types';

describe('Summary Service', () => {
  const wallet = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

  const assets: AssetItem[] = [
    {
      type: 'native',
      contractAddress: null,
      tokenId: null,
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      balance: '10.5',
      balanceWei: '10500000000000000000',
      standard: 'native',
      metadataURI: null,
    },
    {
      type: 'ERC20',
      contractAddress: '0x1111111111111111111111111111111111111111',
      tokenId: null,
      name: 'TokenA',
      symbol: 'TA',
      decimals: 18,
      balance: '500',
      balanceWei: null,
      standard: TokenStandard.ERC20,
      metadataURI: null,
    },
  ];

  const nfts: NFTItem[] = [
    { contractAddress: '0x2222222222222222222222222222222222222222', tokenId: '1', name: 'NFT1', symbol: 'NFT', metadataURI: null, standard: TokenStandard.ERC721 },
    { contractAddress: '0x3333333333333333333333333333333333333333', tokenId: '5', name: 'NFT2', symbol: 'NFT', metadataURI: null, standard: TokenStandard.ERC721 },
  ];

  const history: HistoryEntry[] = [
    { eventName: 'Transfer', contract: '0x1111111111111111111111111111111111111111', transactionHash: '0xaaa', blockNumber: 5, timestamp: null, args: {}, standard: 'ERC20' },
    { eventName: 'Transfer', contract: '0x1111111111111111111111111111111111111111', transactionHash: '0xbbb', blockNumber: 10, timestamp: null, args: {}, standard: 'ERC20' },
    { eventName: 'Transfer', contract: '0x2222222222222222222222222222222222222222', transactionHash: '0xccc', blockNumber: 15, timestamp: null, args: {}, standard: 'ERC721' },
  ];

  it('should generate summary with all fields', () => {
    const result = summaryService.generateSummary(wallet, assets, nfts, '10.5', history);
    expect(result.totalAssets).toBe(2);
    expect(result.tokenCount).toBe(1);
    expect(result.nftCount).toBe(2);
    expect(result.ethBalance).toBe('10.5');
    expect(result.totalTransactions).toBe(3);
    expect(result.firstActivity).toBe('5');
    expect(result.latestActivity).toBe('15');
  });

  it('should handle empty assets', () => {
    const result = summaryService.generateSummary(wallet, [], [], '0', []);
    expect(result.totalAssets).toBe(0);
    expect(result.tokenCount).toBe(0);
    expect(result.nftCount).toBe(0);
    expect(result.ethBalance).toBe('0');
    expect(result.totalTransactions).toBe(0);
    expect(result.firstActivity).toBeNull();
    expect(result.latestActivity).toBeNull();
  });

  it('should handle single history entry', () => {
    const singleHistory = [{ eventName: 'Transfer', contract: '0x111', transactionHash: '0xaaa', blockNumber: 42, timestamp: null, args: {}, standard: 'ERC20' }];
    const result = summaryService.generateSummary(wallet, assets, nfts, '10.5', singleHistory);
    expect(result.totalTransactions).toBe(1);
    expect(result.firstActivity).toBe('42');
    expect(result.latestActivity).toBe('42');
  });
});
