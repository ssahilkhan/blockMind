import { decoderService } from '../decoder/decoder.service';
import { encoderService } from '../encoder/encoder.service';

const TEST_ABI = [
  {
    type: 'function',
    name: 'set',
    inputs: [{ name: 'x', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'get',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
];

describe('decoderService', () => {
  describe('decodeFunction', () => {
    it('should decode function name and arguments from calldata', () => {
      const calldata = encoderService.encodeFunction(TEST_ABI, 'set', [42]);
      const decoded = decoderService.decodeFunction(TEST_ABI, calldata.encoded);

      expect(decoded.functionName).toBe('set');
      expect(decoded.args).toBeDefined();
    });

    it('should decode function with no arguments', () => {
      const calldata = encoderService.encodeFunction(TEST_ABI, 'get', []);
      const decoded = decoderService.decodeFunction(TEST_ABI, calldata.encoded);

      expect(decoded.functionName).toBe('get');
    });

    it('should throw for unknown ABI', () => {
      expect(() => {
        decoderService.decodeFunction([], '0xdeadbeef');
      }).toThrow();
    });
  });

  describe('decodeInput', () => {
    it('should decode input data', () => {
      const calldata = encoderService.encodeFunction(TEST_ABI, 'set', [99]);
      const decoded = decoderService.decodeInput(TEST_ABI, calldata.encoded);

      expect(decoded.functionName).toBe('set');
      expect(decoded.signature).toBeDefined();
    });
  });
});
