import {
  validateSoliditySource,
  validateABI,
  validateBytecode,
  validatePrivateKey,
  validateContractAddress,
  validateFunctionName,
  validateConstructorArgs,
  validateFunctionArgs,
  validateEncodeType,
  validateCalldata,
  validateTxHash,
  validateValue,
} from '../validator/contract.validator';

describe('Contract Validators', () => {
  describe('validateSoliditySource', () => {
    it('should return null for valid source', () => {
      expect(validateSoliditySource('contract Foo {}')).toBeNull();
    });

    it('should return error for empty source', () => {
      expect(validateSoliditySource('')).toBe('Solidity source is required');
    });

    it('should return error for source without contract keyword', () => {
      expect(validateSoliditySource('just some text')).toBe(
        'Source must contain at least one contract, interface, or library definition'
      );
    });

    it('should accept interface as valid', () => {
      expect(validateSoliditySource('interface IFoo {}')).toBeNull();
    });
  });

  describe('validateABI', () => {
    it('should return null for valid ABI', () => {
      expect(validateABI([{ type: 'function', name: 'foo', inputs: [], outputs: [] }])).toBeNull();
    });

    it('should return error for non-array', () => {
      expect(validateABI({} as unknown[])).toBe('ABI must be an array');
    });
  });

  describe('validateBytecode', () => {
    it('should return null for valid bytecode', () => {
      expect(validateBytecode('0x60806040')).toBeNull();
      expect(validateBytecode('60806040')).toBeNull();
    });

    it('should return error for empty string', () => {
      expect(validateBytecode('')).toBe('Bytecode is required');
    });

    it('should return error for non-hex string', () => {
      expect(validateBytecode('not-hex')).toBe('Bytecode must be a hex string');
    });
  });

  describe('validatePrivateKey', () => {
    it('should return null for valid key', () => {
      expect(validatePrivateKey('0x' + 'a'.repeat(64))).toBeNull();
    });

    it('should return error for short key', () => {
      expect(validatePrivateKey('0x1234')).toBe(
        'Private key must be a 64-character hex string'
      );
    });

    it('should accept key without 0x prefix', () => {
      expect(validatePrivateKey('a'.repeat(64))).toBeNull();
    });
  });

  describe('validateContractAddress', () => {
    it('should return null for valid address', () => {
      expect(validateContractAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')).toBeNull();
    });

    it('should return error for invalid address', () => {
      expect(validateContractAddress('0x1234')).toBe('Invalid Ethereum address');
    });
  });

  describe('validateFunctionName', () => {
    it('should return null for valid name', () => {
      expect(validateFunctionName('getCounter')).toBeNull();
    });

    it('should return error for empty name', () => {
      expect(validateFunctionName('')).toBe('Function name is required');
    });
  });

  describe('validateEncodeType', () => {
    it('should accept constructor', () => {
      expect(validateEncodeType('constructor')).toBeNull();
    });

    it('should accept function', () => {
      expect(validateEncodeType('function')).toBeNull();
    });

    it('should reject other values', () => {
      expect(validateEncodeType('event')).toBe("Type must be 'constructor' or 'function'");
    });
  });

  describe('validateCalldata', () => {
    it('should return null for valid calldata', () => {
      expect(validateCalldata('0x1234')).toBeNull();
    });

    it('should return error if not starting with 0x', () => {
      expect(validateCalldata('1234')).toBe('Calldata must start with 0x');
    });
  });

  describe('validateTxHash', () => {
    it('should return null for valid hash', () => {
      expect(validateTxHash('0x' + 'a'.repeat(64))).toBeNull();
    });

    it('should return error for invalid hash', () => {
      expect(validateTxHash('0xshort')).toBe(
        'Transaction hash must be a 64-character hex string prefixed with 0x'
      );
    });
  });

  describe('validateValue', () => {
    it('should return null for valid value', () => {
      expect(validateValue('1.5')).toBeNull();
    });

    it('should return null for undefined', () => {
      expect(validateValue(undefined)).toBeNull();
    });

    it('should return error for negative value', () => {
      expect(validateValue('-1')).toBe('Value must be a valid number string');
    });
  });
});
