import { valuationService } from '../valuation/valuation.service';
import { AssetItem } from '../types/portfolio.types';
import { TokenStandard } from '../../token/types/token.types';

describe('Valuation Service', () => {
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
      name: 'Token',
      symbol: 'TKN',
      decimals: 18,
      balance: '500',
      balanceWei: null,
      standard: TokenStandard.ERC20,
      metadataURI: null,
    },
  ];

  it('should return valuation entries with null prices', () => {
    const result = valuationService.estimate(assets);
    expect(result).toHaveLength(2);
    expect(result[0].quantity).toBe('10.5');
    expect(result[0].priceUsd).toBeNull();
    expect(result[0].valueUsd).toBeNull();
    expect(result[1].quantity).toBe('500');
  });

  it('should return empty for empty assets', () => {
    const result = valuationService.estimate([]);
    expect(result).toHaveLength(0);
  });
});
