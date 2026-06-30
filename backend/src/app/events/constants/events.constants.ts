import { ERC20_ABI, ERC721_ABI, ERC1155_ABI } from '../../token/constants/token.constants';

function extractEvents(abi: unknown[]): unknown[] {
  return abi.filter((entry) => {
    const item = entry as { type?: string };
    return item.type === 'event';
  });
}

export const ERC20_EVENTS = extractEvents(ERC20_ABI);
export const ERC721_EVENTS = extractEvents(ERC721_ABI);
export const ERC1155_EVENTS = extractEvents(ERC1155_ABI);

export const STANDARD_EVENT_ABIS: Record<string, unknown[]> = {
  ERC20: ERC20_EVENTS,
  ERC721: ERC721_EVENTS,
  ERC1155: ERC1155_EVENTS,
};

export const MAX_BLOCK_RANGE = 100;
export const MAX_BLOCKS_PER_SCAN = 10;
