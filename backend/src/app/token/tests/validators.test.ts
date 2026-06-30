import {
  validateTokenAddress,
  validateWalletAddress,
  validatePrivateKey,
  validateTokenId,
  validateAmount,
  validateStandard,
  validateSpender,
  validateOperator,
  validateApproved,
} from '../validator/token.validator';

describe('Token Validators', () => {
  describe('validateTokenAddress', () => {
    it('should return null for valid address', () => {
      expect(validateTokenAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')).toBeNull();
    });

    it('should return error for missing address', () => {
      expect(validateTokenAddress('')).toBe('Token address is required');
    });

    it('should return error for invalid address', () => {
      expect(validateTokenAddress('0x1234')).toBe('Invalid token address');
    });
  });

  describe('validateWalletAddress', () => {
    it('should return null for valid address', () => {
      expect(validateWalletAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')).toBeNull();
    });

    it('should return error for missing address', () => {
      expect(validateWalletAddress('')).toBe('Wallet address is required');
    });
  });

  describe('validatePrivateKey', () => {
    it('should return null for valid key with 0x prefix', () => {
      expect(validatePrivateKey('0x' + 'a'.repeat(64))).toBeNull();
    });

    it('should return null for valid key without prefix', () => {
      expect(validatePrivateKey('a'.repeat(64))).toBeNull();
    });

    it('should return error for short key', () => {
      expect(validatePrivateKey('0x1234')).toBe('Private key must be a 64-character hex string');
    });
  });

  describe('validateTokenId', () => {
    it('should return null for valid numeric string', () => {
      expect(validateTokenId('42')).toBeNull();
    });

    it('should return null for undefined', () => {
      expect(validateTokenId(undefined)).toBeNull();
    });

    it('should return error for non-numeric string', () => {
      expect(validateTokenId('abc')).toBe('Token ID must be a numeric string');
    });
  });

  describe('validateAmount', () => {
    it('should return null for valid amount', () => {
      expect(validateAmount('1000000')).toBeNull();
    });

    it('should return null for undefined', () => {
      expect(validateAmount(undefined)).toBeNull();
    });

    it('should return error for non-numeric string', () => {
      expect(validateAmount('abc')).toBe('Amount must be a numeric string');
    });
  });

  describe('validateStandard', () => {
    it('should return null for ERC20', () => {
      expect(validateStandard('ERC20')).toBeNull();
    });

    it('should return null for ERC721', () => {
      expect(validateStandard('ERC721')).toBeNull();
    });

    it('should return null for ERC1155', () => {
      expect(validateStandard('ERC1155')).toBeNull();
    });

    it('should return error for Unknown', () => {
      expect(validateStandard('Unknown')).not.toBeNull();
    });

    it('should return error for missing standard', () => {
      expect(validateStandard('')).toBe('Token standard is required');
    });
  });

  describe('validateSpender', () => {
    it('should return null for valid address', () => {
      expect(validateSpender('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')).toBeNull();
    });

    it('should return error for missing', () => {
      expect(validateSpender('')).toBe('Spender address is required');
    });
  });

  describe('validateOperator', () => {
    it('should return null for valid address', () => {
      expect(validateOperator('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')).toBeNull();
    });

    it('should return error for missing', () => {
      expect(validateOperator('')).toBe('Operator address is required');
    });
  });

  describe('validateApproved', () => {
    it('should return null for boolean', () => {
      expect(validateApproved(true)).toBeNull();
      expect(validateApproved(false)).toBeNull();
    });

    it('should return error for non-boolean', () => {
      expect(validateApproved('true')).toBe('Approved must be a boolean');
    });
  });
});
