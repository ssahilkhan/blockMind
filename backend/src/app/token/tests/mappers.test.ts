import { tokenMapper } from '../mapper/token.mapper';
import {
  DetectionResult,
  TokenMetadata,
  TokenBalanceResult,
  TokenBalance,
  TransferResult,
  ApprovalResult,
  AllowanceResult,
  GetApprovedResult,
  IsApprovedForAllResult,
  NFTMetadata,
} from '../types/token.types';
import { TokenStandard } from '../types/token.types';

describe('tokenMapper', () => {
  describe('toDetectionResponse', () => {
    it('should map detection result', () => {
      const result: DetectionResult = {
        address: '0xtoken',
        standard: TokenStandard.ERC20,
        supportsERC165: true,
      };
      const response = tokenMapper.toDetectionResponse(result);
      expect(response.address).toBe('0xtoken');
      expect(response.standard).toBe('ERC20');
      expect(response.supportsERC165).toBe(true);
    });
  });

  describe('toMetadataResponse', () => {
    it('should map ERC20 metadata', () => {
      const metadata: TokenMetadata = {
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        totalSupply: '1000000',
        standard: TokenStandard.ERC20,
      };
      const response = tokenMapper.toMetadataResponse(metadata);
      expect(response.name).toBe('USD Coin');
      expect(response.symbol).toBe('USDC');
      expect(response.decimals).toBe(6);
      expect(response.standard).toBe('ERC20');
    });
  });

  describe('toBalanceResponse', () => {
    it('should map balance result', () => {
      const result: TokenBalanceResult = {
        balances: [
          {
            address: '0xwallet',
            tokenAddress: '0xtoken',
            balance: '1000',
            standard: TokenStandard.ERC20,
          },
        ],
      };
      const response = tokenMapper.toBalanceResponse(result);
      expect(response.balances).toHaveLength(1);
      expect(response.balances[0].balance).toBe('1000');
      expect(response.balances[0].standard).toBe('ERC20');
    });

    it('should map ERC1155 balance with tokenId', () => {
      const result: TokenBalanceResult = {
        balances: [
          {
            address: '0xwallet',
            tokenAddress: '0xtoken',
            balance: '5',
            tokenId: '1',
            standard: TokenStandard.ERC1155,
          },
        ],
      };
      const response = tokenMapper.toBalanceResponse(result);
      expect(response.balances[0].tokenId).toBe('1');
      expect(response.balances[0].standard).toBe('ERC1155');
    });
  });

  describe('toTransferResponse', () => {
    it('should map ERC20 transfer result', () => {
      const result: TransferResult = {
        transactionHash: '0xtx',
        tokenAddress: '0xtoken',
        from: '0xfrom',
        to: '0xto',
        amount: '100',
        standard: TokenStandard.ERC20,
      };
      const response = tokenMapper.toTransferResponse(result);
      expect(response.transactionHash).toBe('0xtx');
      expect(response.amount).toBe('100');
      expect(response.standard).toBe('ERC20');
    });

    it('should map ERC721 transfer result', () => {
      const result: TransferResult = {
        transactionHash: '0xtx',
        tokenAddress: '0xtoken',
        from: '0xfrom',
        to: '0xto',
        tokenId: '42',
        standard: TokenStandard.ERC721,
      };
      const response = tokenMapper.toTransferResponse(result);
      expect(response.tokenId).toBe('42');
      expect(response.amount).toBeUndefined();
    });
  });

  describe('toApprovalResponse', () => {
    it('should map approval result', () => {
      const result: ApprovalResult = {
        transactionHash: '0xtx',
        tokenAddress: '0xtoken',
        owner: '0xowner',
        spender: '0xspender',
        amount: '1000',
        standard: TokenStandard.ERC20,
      };
      const response = tokenMapper.toApprovalResponse(result);
      expect(response.owner).toBe('0xowner');
      expect(response.spender).toBe('0xspender');
      expect(response.amount).toBe('1000');
    });
  });

  describe('toAllowanceResponse', () => {
    it('should map allowance result', () => {
      const result: AllowanceResult = {
        tokenAddress: '0xtoken',
        owner: '0xowner',
        spender: '0xspender',
        allowance: '500',
        standard: TokenStandard.ERC20,
      };
      const response = tokenMapper.toAllowanceResponse(result);
      expect(response.allowance).toBe('500');
      expect(response.owner).toBe('0xowner');
    });
  });

  describe('toGetApprovedResponse', () => {
    it('should map getApproved result', () => {
      const result: GetApprovedResult = {
        tokenAddress: '0xtoken',
        tokenId: '1',
        approved: '0xapproved',
      };
      const response = tokenMapper.toGetApprovedResponse(result);
      expect(response.tokenId).toBe('1');
      expect(response.approved).toBe('0xapproved');
    });
  });

  describe('toIsApprovedForAllResponse', () => {
    it('should map isApprovedForAll result', () => {
      const result: IsApprovedForAllResult = {
        tokenAddress: '0xtoken',
        owner: '0xowner',
        operator: '0xoperator',
        approved: true,
      };
      const response = tokenMapper.toIsApprovedForAllResponse(result);
      expect(response.approved).toBe(true);
      expect(response.operator).toBe('0xoperator');
    });
  });

  describe('toNFTMetadataResponse', () => {
    it('should map NFT metadata', () => {
      const metadata: NFTMetadata = {
        owner: '0xowner',
        tokenURI: 'https://example.com/token/1',
        tokenId: '1',
        contractAddress: '0xnft',
      };
      const response = tokenMapper.toNFTMetadataResponse(metadata);
      expect(response.owner).toBe('0xowner');
      expect(response.tokenURI).toBe('https://example.com/token/1');
      expect(response.tokenId).toBe('1');
      expect(response.contractAddress).toBe('0xnft');
    });
  });
});
