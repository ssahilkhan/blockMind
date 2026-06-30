import { eventRegistry } from '../registry/event.registry';
import { eventListener } from '../listener/event.listener';
import { applyFilter } from '../filter/event.filter';
import { eventMapper } from '../mapper/event.mapper';
import { FilterCriteria, DecodedEventResult } from '../types/events.types';
import { logger } from '../../logger';

import type {
  EventListResponse,
  RegistryInfoResponse,
} from '../mapper/event.mapper';

function parseCustomABI(abiRaw?: string): unknown[] | undefined {
  if (!abiRaw) return undefined;
  try {
    return JSON.parse(abiRaw) as unknown[];
  } catch {
    return undefined;
  }
}

export const eventService = {
  init(): void {
    eventRegistry.init();
    logger.info('Event service initialized');
  },

  async getEventsFromReceipt(txHash: string, abiRaw?: string): Promise<EventListResponse> {
    const customABI = parseCustomABI(abiRaw);
    const result = await eventListener.getEventsFromReceipt(txHash, customABI);
    return eventMapper.toEventListResponse(result);
  },

  async getEventsByBlock(blockNumber: number, abiRaw?: string): Promise<EventListResponse> {
    const customABI = parseCustomABI(abiRaw);
    const result = await eventListener.getEventsByBlock(blockNumber, customABI);
    return eventMapper.toEventListResponse(result);
  },

  async getEventsBetweenBlocks(from: number, to: number, abiRaw?: string): Promise<EventListResponse> {
    const customABI = parseCustomABI(abiRaw);
    const result = await eventListener.getEventsBetweenBlocks(from, to, customABI);
    return eventMapper.toEventListResponse(result);
  },

  async searchEvents(filter: FilterCriteria, abiRaw?: string): Promise<EventListResponse> {
    logger.info('Searching events', { filter });

    const customABI = parseCustomABI(abiRaw);
    let result: DecodedEventResult;

    if (filter.txHash) {
      result = await eventListener.getEventsFromReceipt(filter.txHash, customABI);
    } else if (filter.fromBlock !== undefined && filter.toBlock !== undefined) {
      result = await eventListener.getEventsBetweenBlocks(filter.fromBlock, filter.toBlock, customABI);
    } else if (filter.fromBlock !== undefined) {
      result = await eventListener.getEventsByBlock(filter.fromBlock, customABI);
    } else {
      const chain = (await import('../../chain/services/chain.service')).getChainService();
      const latest = await chain.getLatestBlock();
      result = await eventListener.getEventsByBlock(latest.number, customABI);
    }

    const filtered = applyFilter(result.events, filter);

    return eventMapper.toEventListResponse({ events: filtered, total: filtered.length });
  },

  getRegistry(): RegistryInfoResponse {
    const info = eventRegistry.getRegistryInfo();
    return eventMapper.toRegistryResponse(info);
  },

  registerContract(address: string, abi: unknown[], label?: string): void {
    eventRegistry.registerContract(address, abi, label);
  },

  registerABI(label: string, abi: unknown[]): void {
    eventRegistry.registerABI(label, abi);
  },
};
