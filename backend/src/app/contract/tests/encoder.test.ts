import { encoderService } from '../encoder/encoder.service';

const COUNTER_ABI = [
  {
    type: 'constructor',
    inputs: [{ name: '_initialValue', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getCounter',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'increment',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
];

describe('encoderService', () => {
  describe('encodeConstructor', () => {
    it('should encode constructor arguments', () => {
      const encoded = encoderService.encodeConstructor(COUNTER_ABI, [42]);
      expect(encoded).toMatch(/^0x[0-9a-fA-F]+$/);
      expect(encoded.length).toBeGreaterThan(2);
    });

    it('should encode zero value', () => {
      const encoded = encoderService.encodeConstructor(COUNTER_ABI, [0]);
      expect(encoded).toMatch(/^0x[0-9a-fA-F]+$/);
    });
  });

  describe('encodeFunction', () => {
    it('should encode function data without arguments', () => {
      const result = encoderService.encodeFunction(COUNTER_ABI, 'getCounter', []);
      expect(result.encoded).toMatch(/^0x[0-9a-fA-F]+$/);
      expect(result.functionSignature).toBeDefined();
    });

    it('should throw for unknown function', () => {
      expect(() => {
        encoderService.encodeFunction(COUNTER_ABI, 'nonexistent', []);
      }).toThrow('not found in ABI');
    });
  });

  describe('encode', () => {
    it('should encode constructor when type is constructor', () => {
      const result = encoderService.encode({
        type: 'constructor',
        abi: COUNTER_ABI,
        args: [100],
      });
      expect(result.encoded).toMatch(/^0x[0-9a-fA-F]+$/);
    });

    it('should encode function when type is function', () => {
      const result = encoderService.encode({
        type: 'function',
        abi: COUNTER_ABI,
        functionName: 'increment',
        args: [],
      });
      expect(result.encoded).toMatch(/^0x[0-9a-fA-F]+$/);
    });
  });
});
