import { ethers } from 'ethers';
import { abiManager } from '../abi/abi.manager';
import { logger } from '../../logger';
import { EventDecodeRequest, EventDecodeResult, DecodedEvent } from '../types/contract.types';

function formatArgs(parsed: ethers.Result): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(parsed)) {
    if (isNaN(Number(key))) {
      result[key] = formatValue(parsed[key]);
    }
  }
  return result;
}

function formatValue(value: unknown): unknown {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (value instanceof ethers.Result || Array.isArray(value)) {
    const arr = value as ArrayLike<unknown>;
    const result: Record<string, unknown> = {};
    for (let i = 0; i < arr.length; i++) {
      const namedKey = Object.keys(arr).find(
        (k) => k !== String(i) && !isNaN(Number(k)) === false
      );
      result[namedKey || i.toString()] = formatValue(arr[i]);
    }
    return result;
  }
  return value;
}

export const eventDecoderService = {
  decodeEvents(request: EventDecodeRequest): EventDecodeResult {
    const iface = abiManager.getInterface(request.abi);
    const events: DecodedEvent[] = [];

    for (let i = 0; i < request.logs.length; i++) {
      const log = request.logs[i];
      try {
        const parsed = iface.parseLog({
          topics: log.topics,
          data: log.data,
        });

        if (parsed) {
          events.push({
            eventName: parsed.name,
            signature: parsed.signature,
            args: formatArgs(parsed.args),
            address: log.address,
            logIndex: i,
          });
        }
      } catch {
        // Skip logs that don't match the ABI
      }
    }

    logger.info('Events decoded', { eventCount: events.length });
    return { events };
  },
};
