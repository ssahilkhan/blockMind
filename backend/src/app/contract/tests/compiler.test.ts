import { compilerService } from '../compiler/compiler.service';

jest.mock('solc', () => {
  const mockSolc = {
    compile: jest.fn(),
    version: jest.fn().mockReturnValue('0.8.28+commit.0000000'),
  };
  return mockSolc;
});

const mockSolc = require('solc') as jest.Mocked<{
  compile: jest.Mock;
  version: jest.Mock;
}>;

const SAMPLE_SOURCE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract Test {
  uint256 public value;
  constructor(uint256 _v) { value = _v; }
  function get() public view returns (uint256) { return value; }
}
`;

function makeSuccessOutput(): string {
  return JSON.stringify({
    contracts: {
      'contract.sol': {
        Test: {
          abi: [
            { type: 'constructor', inputs: [{ name: '_v', type: 'uint256' }] },
            { type: 'function', name: 'get', outputs: [{ type: 'uint256' }], stateMutability: 'view' },
            { type: 'function', name: 'value', outputs: [{ type: 'uint256' }], stateMutability: 'view' },
          ],
          evm: {
            bytecode: { object: '60806040' },
            deployedBytecode: { object: '60806040' },
          },
          metadata: '{"compiler":{"version":"0.8.28"}}',
        },
      },
    },
  });
}

function makeErrorOutput(): string {
  return JSON.stringify({
    errors: [
      {
        message: 'ParserError: Expected identifier but got "invalid"',
        severity: 'error',
        sourceLocation: { startLine: 3, startColumn: 5 },
      },
    ],
  });
}

describe('compilerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('compile', () => {
    it('should return successful compilation result', () => {
      mockSolc.compile.mockReturnValue(makeSuccessOutput());

      const result = compilerService.compile({ source: SAMPLE_SOURCE });

      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
      expect(result.result!.contractName).toBe('Test');
      expect(result.result!.bytecode).toBe('60806040');
      expect(result.result!.abi).toBeDefined();
      expect(result.result!.compilerVersion).toBe('0.8.28+commit.0000000');
      expect(Array.isArray(result.result!.abi)).toBe(true);
    });

    it('should return errors on compilation failure', () => {
      mockSolc.compile.mockReturnValue(makeErrorOutput());

      const result = compilerService.compile({ source: SAMPLE_SOURCE });

      expect(result.success).toBe(false);
      expect(result.result).toBeUndefined();
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].severity).toBe('error');
    });

    it('should handle no contracts in output', () => {
      mockSolc.compile.mockReturnValue(
        JSON.stringify({ contracts: { 'contract.sol': {} } })
      );

      const result = compilerService.compile({ source: '// just a comment' });

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].message).toContain('No contracts found');
    });

    it('should pass correct input structure to solc', () => {
      mockSolc.compile.mockReturnValue(makeSuccessOutput());

      compilerService.compile({ source: SAMPLE_SOURCE });

      const inputArg = JSON.parse(mockSolc.compile.mock.calls[0][0]);
      expect(inputArg.language).toBe('Solidity');
      expect(inputArg.sources['contract.sol'].content).toBe(SAMPLE_SOURCE);
      expect(inputArg.settings.outputSelection['*']['*']).toContain('abi');
      expect(inputArg.settings.outputSelection['*']['*']).toContain('evm.bytecode');
    });
  });
});
