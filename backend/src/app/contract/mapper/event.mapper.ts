import { EventDecodeResult, DecodedEvent } from '../types/contract.types';

export interface EventResponse {
  events: Array<{
    eventName: string;
    signature: string;
    args: Record<string, unknown>;
    address: string;
    logIndex: number;
  }>;
}

export const eventMapper = {
  toResponse(result: EventDecodeResult): EventResponse {
    return {
      events: result.events.map((e) => ({
        eventName: e.eventName,
        signature: e.signature,
        args: e.args,
        address: e.address,
        logIndex: e.logIndex,
      })),
    };
  },
};
