import { portfolioMapper } from '../mapper/portfolio.mapper';
import { AssetItem, BalanceEntry, NFTItem, HistoryEntry, PortfolioSummary } from '../types/portfolio.types';
import { TokenStandard } from '../../token/types/token.types';

describe('Portfolio Mapper', () => {
  const mockAsset: AssetItem = {
    type: 'ERC20',
    contractAddress: '0x1111111111111111111111111111111111111111',
    tokenId: null,
    name: 'TestToken',
    symbol: 'TT',
    decimals: 18,
    balance: '1000',
    balanceWei: null,
    standard: TokenStandard.ERC20,
    metadataURI: null,
  };

  const mockBalance: BalanceEntry = {
    type: 'native',
    contractAddress: null,
    tokenId: null,
    balance: '10.5',
    balanceWei: '10500000000000000000',
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    standard: 'native',
  };

  const mockNFT: NFTItem = {
    contractAddress: '0x2222222222222222222222222222222222222222',
    tokenId: '1',
    name: 'TestNFT',
    symbol: 'TNFT',
    metadataURI: 'https://example.com/token/1',
    standard: TokenStandard.ERC721,
  };

  const mockHistory: HistoryEntry = {
    eventName: 'Transfer',
    contract: '0x1111111111111111111111111111111111111111',
    transactionHash: '0x' + 'a'.repeat(64),
    blockNumber: 10,
    timestamp: null,
    args: { from: '0xaaa', to: '0xbbb', value: '100' },
    standard: 'ERC20',
  };

  it('should map asset to response', () => {
    const result = portfolioMapper.toAssetResponse(mockAsset);
    expect(result.type).toBe('ERC20');
    expect(result.name).toBe('TestToken');
    expect(result.balance).toBe('1000');
  });

  it('should map balance to response', () => {
    const result = portfolioMapper.toBalanceResponse(mockBalance);
    expect(result.type).toBe('native');
    expect(result.balance).toBe('10.5');
    expect(result.balanceWei).toBe('10500000000000000000');
  });

  it('should map NFT to response', () => {
    const result = portfolioMapper.toNFTResponse(mockNFT);
    expect(result.contractAddress).toBe('0x2222222222222222222222222222222222222222');
    expect(result.tokenId).toBe('1');
    expect(result.metadataURI).toBe('https://example.com/token/1');
  });

  it('should map history to response', () => {
    const result = portfolioMapper.toHistoryResponse(mockHistory);
    expect(result.eventName).toBe('Transfer');
    expect(result.blockNumber).toBe(10);
    expect(result.args.value).toBe('100');
  });

  it('should map summary to response', () => {
    const summary: PortfolioSummary = {
      totalAssets: 5,
      tokenCount: 2,
      nftCount: 1,
      ethBalance: '10.5',
      totalTransactions: 20,
      firstActivity: '1',
      latestActivity: '50',
    };
    const result = portfolioMapper.toSummaryResponse(summary);
    expect(result.totalAssets).toBe(5);
    expect(result.nftCount).toBe(1);
    expect(result.ethBalance).toBe('10.5');
  });

  it('should map full portfolio response', () => {
    const summary: PortfolioSummary = {
      totalAssets: 1,
      tokenCount: 0,
      nftCount: 0,
      ethBalance: '10.5',
      totalTransactions: 0,
      firstActivity: null,
      latestActivity: null,
    };

    const result = portfolioMapper.toPortfolioResponse(
      '0xwallet',
      [mockAsset],
      [mockBalance],
      [mockNFT],
      [mockHistory],
      summary
    );
    expect(result.wallet).toBe('0xwallet');
    expect(result.assets).toHaveLength(1);
    expect(result.balances).toHaveLength(1);
    expect(result.nfts).toHaveLength(1);
    expect(result.history).toHaveLength(1);
    expect(result.summary.totalAssets).toBe(1);
  });
});
