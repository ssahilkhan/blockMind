import { STANDARD_EVENT_ABIS } from '../constants/events.constants';
import { RegisteredContract, RegistryEntry, RegistryInfo } from '../types/events.types';
import { logger } from '../../logger';

const contracts: RegisteredContract[] = [];
const customABIs: Map<string, unknown[]> = new Map();

export const eventRegistry = {
  init(): void {
    contracts.length = 0;
    customABIs.clear();
    logger.info('Event registry initialized with standard ABIs', {
      standards: Object.keys(STANDARD_EVENT_ABIS),
    });
  },

  registerContract(address: string, abi: unknown[], label?: string): void {
    const lower = address.toLowerCase();
    const existing = contracts.findIndex((c) => c.address.toLowerCase() === lower);
    if (existing >= 0) {
      contracts[existing] = { address: lower, abi, label };
    } else {
      contracts.push({ address: lower, abi, label });
    }
    logger.info('Contract registered in event registry', { address: lower, label });
  },

  registerABI(label: string, abi: unknown[]): void {
    customABIs.set(label, abi);
    logger.info('Custom ABI registered', { label });
  },

  findABI(address: string): unknown[] | null {
    const lower = address.toLowerCase();
    const registered = contracts.find((c) => c.address.toLowerCase() === lower);
    if (registered) return registered.abi;
    return null;
  },

  getStandardABIs(): Map<string, unknown[]> {
    const result = new Map<string, unknown[]>();
    for (const [standard, abi] of Object.entries(STANDARD_EVENT_ABIS)) {
      result.set(standard, abi);
    }
    for (const [label, abi] of customABIs) {
      result.set(label, abi);
    }
    return result;
  },

  getRegistryInfo(): RegistryInfo {
    const eventsList: RegistryEntry[] = [];
    for (const [standard, abi] of Object.entries(STANDARD_EVENT_ABIS)) {
      for (const entry of abi) {
        const item = entry as { name?: string; type?: string };
        if (item.type === 'event' && item.name) {
          eventsList.push({ signature: `${standard}:${item.name}`, name: item.name, standard });
        }
      }
    }
    return {
      standards: Object.keys(STANDARD_EVENT_ABIS),
      events: eventsList,
      contracts: [...contracts],
    };
  },

  guessStandardFromABI(abi: unknown[]): string {
    const names = new Set(
      abi
        .filter((e) => (e as { type?: string }).type === 'event')
        .map((e) => (e as { name?: string }).name)
    );
    if (names.has('TransferSingle') || names.has('TransferBatch')) return 'ERC1155';
    if (names.has('ApprovalForAll') && !names.has('TransferSingle')) return 'ERC721';
    if (names.has('Transfer') && names.has('Approval')) return 'ERC20';
    return 'Custom';
  },
};
