jest.mock('../../contract/caller/caller.service', () => ({
  callerService: {
    read: jest.fn(),
  },
}));

jest.mock('../../chain/services/chain.service', () => ({
  getChainService: jest.fn(),
}));

import { callerService } from '../../contract/caller/caller.service';
import { getChainService } from '../../chain/services/chain.service';
import { tokenDetector } from '../detector/token.detector';
import { TokenStandard } from '../types/token.types';

const mockRead = callerService.read as jest.Mock;
const mockGetChainService = getChainService as jest.Mock;
const mockCall = jest.fn();

describe('tokenDetector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetChainService.mockReturnValue({ call: mockCall });
  });

  it('should detect ERC20 via ERC165', async () => {
    mockRead
      .mockResolvedValueOnce({ result: { 0: true } })  // supportsERC165
      .mockResolvedValueOnce({ result: { 0: true } }); // supportsERC20

    const result = await tokenDetector.detectStandard('0xtoken');
    expect(result.standard).toBe(TokenStandard.ERC20);
    expect(result.supportsERC165).toBe(true);
  });

  it('should detect ERC721 via ERC165', async () => {
    mockRead
      .mockResolvedValueOnce({ result: { 0: true } })   // supportsERC165
      .mockResolvedValueOnce({ result: { 0: false } })  // not ERC20
      .mockResolvedValueOnce({ result: { 0: true } });  // is ERC721

    const result = await tokenDetector.detectStandard('0xnft');
    expect(result.standard).toBe(TokenStandard.ERC721);
    expect(result.supportsERC165).toBe(true);
  });

  it('should detect ERC1155 via ERC165', async () => {
    mockRead
      .mockResolvedValueOnce({ result: { 0: true } })   // supportsERC165
      .mockResolvedValueOnce({ result: { 0: false } })  // not ERC20
      .mockResolvedValueOnce({ result: { 0: false } })  // not ERC721
      .mockResolvedValueOnce({ result: { 0: true } });  // is ERC1155

    const result = await tokenDetector.detectStandard('0x1155');
    expect(result.standard).toBe(TokenStandard.ERC1155);
    expect(result.supportsERC165).toBe(true);
  });

  it('should return Unknown when no standard matches', async () => {
    mockRead
      .mockResolvedValueOnce({ result: { 0: false } });  // not ERC165

    mockCall
      .mockRejectedValueOnce(new Error('not 1155'))  // balanceOf(address,uint256) fails
      .mockRejectedValueOnce(new Error('not ERC20'))  // totalSupply fails
      .mockResolvedValueOnce('0x' + '0'.repeat(64));  // ownerOf returns zero address (not ERC721)

    const result = await tokenDetector.detectStandard('0xunknown');
    expect(result.standard).toBe(TokenStandard.Unknown);
    expect(result.supportsERC165).toBe(false);
  });

  it('should detect ERC1155 via fallback', async () => {
    mockRead
      .mockResolvedValueOnce({ result: { 0: false } }); // not ERC165

    mockCall
      .mockResolvedValueOnce('0x' + '0'.repeat(63) + '1'); // balanceOf(address,uint256) returns nonzero

    const result = await tokenDetector.detectStandard('0x1155');
    expect(result.standard).toBe(TokenStandard.ERC1155);
    expect(result.supportsERC165).toBe(false);
  });

  it('should detect ERC20 via fallback', async () => {
    mockRead
      .mockResolvedValueOnce({ result: { 0: false } }); // not ERC165

    mockCall
      .mockRejectedValueOnce(new Error('not 1155'))  // balanceOf(address,uint256) fails
      .mockResolvedValueOnce('0x' + '0'.repeat(63) + '1'); // totalSupply returns nonzero

    const result = await tokenDetector.detectStandard('0xtoken');
    expect(result.standard).toBe(TokenStandard.ERC20);
    expect(result.supportsERC165).toBe(false);
  });

  it('should detect ERC721 via fallback when ownerOf reverts', async () => {
    mockRead
      .mockResolvedValueOnce({ result: { 0: false } }); // not ERC165

    mockCall
      .mockRejectedValueOnce(new Error('not 1155'))  // balanceOf(address,uint256) fails
      .mockRejectedValueOnce(new Error('not ERC20'))  // totalSupply fails
      .mockRejectedValueOnce(new Error('ownerOf: token does not exist')); // ownerOf reverts = function exists

    const result = await tokenDetector.detectStandard('0xnft');
    expect(result.standard).toBe(TokenStandard.ERC721);
    expect(result.supportsERC165).toBe(false);
  });

  it('should return Unknown when fallback also fails', async () => {
    mockRead
      .mockResolvedValueOnce({ result: { 0: false } }); // not ERC165

    mockCall
      .mockRejectedValueOnce(new Error('fail'))  // 1155 fails
      .mockRejectedValueOnce(new Error('fail'))  // ERC20 fails
      .mockResolvedValueOnce('0x');               // ownerOf returns empty (function doesn't exist)

    const result = await tokenDetector.detectStandard('0xunknown');
    expect(result.standard).toBe(TokenStandard.Unknown);
  });
});
