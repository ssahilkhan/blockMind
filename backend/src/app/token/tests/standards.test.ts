jest.mock('../../contract/caller/caller.service', () => ({
  callerService: {
    read: jest.fn(),
  },
}));

jest.mock('../../contract/executor/executor.service', () => ({
  executorService: {
    execute: jest.fn(),
  },
}));

jest.mock('../../contract/abi/abi.manager', () => ({
  abiManager: {
    getInterface: jest.fn(),
    validateABI: jest.fn(),
  },
}));

import { callerService } from '../../contract/caller/caller.service';
import { executorService } from '../../contract/executor/executor.service';
import { erc20Service } from '../standards/erc20/erc20.service';
import { erc721Service } from '../standards/erc721/erc721.service';
import { erc1155Service } from '../standards/erc1155/erc1155.service';
import { TokenStandard } from '../types/token.types';

const mockRead = callerService.read as jest.Mock;
const mockExecute = executorService.execute as jest.Mock;

describe('ERC20 Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get token name', async () => {
    mockRead.mockResolvedValue({ result: { 0: 'TestToken' } });
    const name = await erc20Service.name('0xtoken');
    expect(name).toBe('TestToken');
    expect(mockRead).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: 'name', contractAddress: '0xtoken' })
    );
  });

  it('should get token symbol', async () => {
    mockRead.mockResolvedValue({ result: { 0: 'TT' } });
    const symbol = await erc20Service.symbol('0xtoken');
    expect(symbol).toBe('TT');
  });

  it('should get decimals', async () => {
    mockRead.mockResolvedValue({ result: { 0: 18n } });
    const decimals = await erc20Service.decimals('0xtoken');
    expect(decimals).toBe(18);
  });

  it('should get totalSupply', async () => {
    mockRead.mockResolvedValue({ result: { 0: 1000000n } });
    const supply = await erc20Service.totalSupply('0xtoken');
    expect(supply).toBe('1000000');
  });

  it('should get balanceOf', async () => {
    mockRead.mockResolvedValue({ result: { 0: 500n } });
    const balance = await erc20Service.balanceOf('0xtoken', '0xwallet');
    expect(balance.balance).toBe('500');
    expect(balance.standard).toBe(TokenStandard.ERC20);
    expect(balance.tokenAddress).toBe('0xtoken');
  });

  it('should transfer', async () => {
    mockExecute.mockResolvedValue({ transactionHash: '0xtx' });
    const txHash = await erc20Service.transfer('0xkey', '0xtoken', '0xto', '100');
    expect(txHash).toBe('0xtx');
    expect(mockExecute).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: 'transfer', args: ['0xto', '100'] })
    );
  });

  it('should approve', async () => {
    mockExecute.mockResolvedValue({ transactionHash: '0xtx' });
    const txHash = await erc20Service.approve('0xkey', '0xtoken', '0xspender', '1000');
    expect(txHash).toBe('0xtx');
    expect(mockExecute).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: 'approve', args: ['0xspender', '1000'] })
    );
  });

  it('should get allowance', async () => {
    mockRead.mockResolvedValue({ result: { 0: 200n } });
    const allowance = await erc20Service.allowance('0xtoken', '0xowner', '0xspender');
    expect(allowance).toBe('200');
  });
});

describe('ERC721 Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get name', async () => {
    mockRead.mockResolvedValue({ result: { 0: 'MyNFT' } });
    const name = await erc721Service.name('0xnft');
    expect(name).toBe('MyNFT');
  });

  it('should get symbol', async () => {
    mockRead.mockResolvedValue({ result: { 0: 'NFT' } });
    const symbol = await erc721Service.symbol('0xnft');
    expect(symbol).toBe('NFT');
  });

  it('should get balanceOf', async () => {
    mockRead.mockResolvedValue({ result: { 0: 3n } });
    const balance = await erc721Service.balanceOf('0xnft', '0xwallet');
    expect(balance.balance).toBe('3');
    expect(balance.standard).toBe(TokenStandard.ERC721);
  });

  it('should get ownerOf', async () => {
    mockRead.mockResolvedValue({ result: { 0: '0xowner' } });
    const owner = await erc721Service.ownerOf('0xnft', '1');
    expect(owner).toBe('0xowner');
  });

  it('should do safeTransferFrom', async () => {
    mockExecute.mockResolvedValue({ transactionHash: '0xtx' });
    const txHash = await erc721Service.safeTransferFrom('0xkey', '0xnft', '0xfrom', '0xto', '1');
    expect(txHash).toBe('0xtx');
    expect(mockExecute).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: 'safeTransferFrom', args: ['0xfrom', '0xto', '1'] })
    );
  });

  it('should approve', async () => {
    mockExecute.mockResolvedValue({ transactionHash: '0xtx' });
    const txHash = await erc721Service.approve('0xkey', '0xnft', '0xapproved', '1');
    expect(txHash).toBe('0xtx');
  });

  it('should setApprovalForAll', async () => {
    mockExecute.mockResolvedValue({ transactionHash: '0xtx' });
    const txHash = await erc721Service.setApprovalForAll('0xkey', '0xnft', '0xoperator', true);
    expect(txHash).toBe('0xtx');
    expect(mockExecute).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: 'setApprovalForAll', args: ['0xoperator', true] })
    );
  });

  it('should getApproved', async () => {
    mockRead.mockResolvedValue({ result: { 0: '0xapproved' } });
    const approved = await erc721Service.getApproved('0xnft', '1');
    expect(approved).toBe('0xapproved');
  });

  it('should isApprovedForAll', async () => {
    mockRead.mockResolvedValue({ result: { 0: true } });
    const approved = await erc721Service.isApprovedForAll('0xnft', '0xowner', '0xoperator');
    expect(approved).toBe(true);
  });

  it('should get tokenURI', async () => {
    mockRead.mockResolvedValue({ result: { 0: 'https://example.com/token/1' } });
    const uri = await erc721Service.tokenURI('0xnft', '1');
    expect(uri).toBe('https://example.com/token/1');
  });
});

describe('ERC1155 Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get uri', async () => {
    mockRead.mockResolvedValue({ result: { 0: 'https://example.com/{id}' } });
    const uri = await erc1155Service.uri('0x1155', '1');
    expect(uri).toBe('https://example.com/{id}');
  });

  it('should get balanceOf with tokenId', async () => {
    mockRead.mockResolvedValue({ result: { 0: 10n } });
    const balance = await erc1155Service.balanceOf('0x1155', '0xwallet', '1');
    expect(balance.balance).toBe('10');
    expect(balance.tokenId).toBe('1');
    expect(balance.standard).toBe(TokenStandard.ERC1155);
  });

  it('should safeTransferFrom', async () => {
    mockExecute.mockResolvedValue({ transactionHash: '0xtx' });
    const txHash = await erc1155Service.safeTransferFrom('0xkey', '0x1155', '0xfrom', '0xto', '1', '100');
    expect(txHash).toBe('0xtx');
    expect(mockExecute).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: 'safeTransferFrom',
        args: ['0xfrom', '0xto', '1', '100', '0x'],
      })
    );
  });

  it('should setApprovalForAll', async () => {
    mockExecute.mockResolvedValue({ transactionHash: '0xtx' });
    const txHash = await erc1155Service.setApprovalForAll('0xkey', '0x1155', '0xoperator', true);
    expect(txHash).toBe('0xtx');
  });

  it('should isApprovedForAll', async () => {
    mockRead.mockResolvedValue({ result: { 0: false } });
    const approved = await erc1155Service.isApprovedForAll('0x1155', '0xowner', '0xoperator');
    expect(approved).toBe(false);
  });
});
