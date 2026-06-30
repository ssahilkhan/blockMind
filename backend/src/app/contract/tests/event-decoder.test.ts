import { ethers } from 'ethers';
import { eventDecoderService } from '../event-decoder/event-decoder.service';

const COUNTER_ABI = [
  {
    type: 'event',
    name: 'CounterUpdated',
    inputs: [
      { name: 'value', type: 'uint256', indexed: false },
    ],
    anonymous: false,
  },
];

const ERC20_TRANSFER_ABI = [
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    anonymous: false,
  },
];

const COUNTER_TOPIC = ethers.id('CounterUpdated(uint256)');
const TRANSFER_TOPIC = ethers.id('Transfer(address,address,uint256)');

describe('eventDecoderService', () => {
  describe('decodeEvents', () => {
    it('should decode CounterUpdated event', () => {
      const topics = [COUNTER_TOPIC];
      const data = ethers.AbiCoder.defaultAbiCoder().encode(['uint256'], [1]);

      const result = eventDecoderService.decodeEvents({
        abi: COUNTER_ABI,
        logs: [
          {
            address: '0x1234567890123456789012345678901234567890',
            topics,
            data,
          },
        ],
      });

      expect(result.events).toHaveLength(1);
      expect(result.events[0].eventName).toBe('CounterUpdated');
      expect(result.events[0].address).toBe('0x1234567890123456789012345678901234567890');
    });

    it('should decode ERC20 Transfer event', () => {
      const topics = [
        TRANSFER_TOPIC,
        '0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266',
        '0x00000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c8',
      ];
      const data = ethers.AbiCoder.defaultAbiCoder().encode(['uint256'], [100]);

      const result = eventDecoderService.decodeEvents({
        abi: ERC20_TRANSFER_ABI,
        logs: [
          {
            address: '0xtoken',
            topics,
            data,
          },
        ],
      });

      expect(result.events).toHaveLength(1);
      expect(result.events[0].eventName).toBe('Transfer');
    });

    it('should skip logs that do not match the ABI', () => {
      const result = eventDecoderService.decodeEvents({
        abi: COUNTER_ABI,
        logs: [
          {
            address: '0x0000000000000000000000000000000000000000',
            topics: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
            data: '0x',
          },
        ],
      });

      expect(result.events).toHaveLength(0);
    });

    it('should handle empty logs array', () => {
      const result = eventDecoderService.decodeEvents({
        abi: COUNTER_ABI,
        logs: [],
      });

      expect(result.events).toHaveLength(0);
    });
  });
});
