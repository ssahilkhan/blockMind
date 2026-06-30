import { ethers } from 'ethers';
import { abiManager } from '../abi/abi.manager';
import { logger } from '../../logger';
import { EventDecodeRequest, EventDecodeResult, DecodedEvent } from '../types/contract.types';

function formatArgs(parsed: ethers.Result): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (typeof (parsed as { toObject?: () => Record<string, unknown> }).toObject === 'function') {
    const obj = (parsed as { toObject: () => Record<string, unknown> }).toObject();
    for (const key of Object.keys(obj)) {
      result[key] = formatValue(obj[key]);
    }
  } else {
    for (const key of Object.keys(parsed)) {
      if (isNaN(Number(key))) {
        result[key] = formatValue(parsed[key]);
      }
    }
  }
  return result;
}

function formatValue(value: unknown): unknown {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (value instanceof ethers.Result) {
    return formatArgs(value);
  }
  if (Array.isArray(value)) {
    return value.map(formatValue);
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
