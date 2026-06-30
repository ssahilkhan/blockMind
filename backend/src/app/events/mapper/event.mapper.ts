import { DecodedEvent, DecodedEventResult, RegistryInfo } from '../types/events.types';

export interface DecodedEventResponse {
  eventName: string;
  signature: string;
  args: Record<string, unknown>;
  contract: string;
  logIndex: number;
  blockNumber: number;
  blockHash: string;
  transactionHash: string;
  from: string;
  to: string | null;
}

export interface EventListResponse {
  events: DecodedEventResponse[];
  total: number;
}

export interface RegistryInfoResponse {
  standards: string[];
  events: Array<{ signature: string; name: string; standard: string }>;
  contracts: Array<{ address: string; label?: string }>;
}

export const eventMapper = {
  toEventResponse(event: DecodedEvent): DecodedEventResponse {
    return {
      eventName: event.eventName,
      signature: event.signature,
      args: event.args,
      contract: event.contract,
      logIndex: event.logIndex,
      blockNumber: event.blockNumber,
      blockHash: event.blockHash,
      transactionHash: event.transactionHash,
      from: event.from,
      to: event.to,
    };
  },

  toEventListResponse(result: DecodedEventResult): EventListResponse {
    return {
      events: result.events.map((e) => this.toEventResponse(e)),
      total: result.total,
    };
  },

  toRegistryResponse(info: RegistryInfo): RegistryInfoResponse {
    return {
      standards: info.standards,
      events: info.events,
      contracts: info.contracts.map((c) => ({
        address: c.address,
        label: c.label,
      })),
    };
  },
};
