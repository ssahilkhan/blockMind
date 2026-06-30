import { ethers } from 'ethers';
import { walletService } from './wallet.service';

describe('Wallet Service', () => {
  describe('createWallet', () => {
    it('should return a valid wallet with all fields', () => {
      const result = walletService.createWallet();

      expect(result.address).toBeDefined();
      expect(ethers.isAddress(result.address)).toBe(true);

      expect(result.publicKey).toBeDefined();
      expect(result.publicKey).toMatch(/^0x04[0-9a-fA-F]{128}$/);

      expect(result.privateKey).toBeDefined();
      expect(result.privateKey).toMatch(/^0x[0-9a-fA-F]{64}$/);

      expect(result.mnemonic).toBeDefined();
      expect(result.mnemonic.split(/\s+/).length).toBe(12);

      expect(result.path).toBe("m/44'/60'/0'/0/0");
    });
  });

  describe('importFromPrivateKey', () => {
    it('should derive correct address and public key from a private key', () => {
      const created = walletService.createWallet();
      const imported = walletService.importFromPrivateKey(created.privateKey);

      expect(imported.address).toBe(created.address);
      expect(imported.publicKey).toBe(created.publicKey);
    });

    it('should work with a known private key', () => {
      const privateKey = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
      const result = walletService.importFromPrivateKey(privateKey);

      expect(ethers.isAddress(result.address)).toBe(true);
      expect(result.publicKey).toMatch(/^0x04[0-9a-fA-F]{128}$/);
    });
  });

  describe('importFromMnemonic', () => {
    it('should derive a wallet from a mnemonic with the default path', () => {
      const created = walletService.createWallet();
      if (!created.mnemonic) return;

      const result = walletService.importFromMnemonic(created.mnemonic);

      expect(result.address).toBe(created.address);
      expect(result.privateKey).toBe(created.privateKey);
      expect(result.path).toBe("m/44'/60'/0'/0/0");
    });

    it('should derive different wallets with different paths', () => {
      const created = walletService.createWallet();
      if (!created.mnemonic) return;

      const defaultPath = walletService.importFromMnemonic(created.mnemonic);
      const customPath = walletService.importFromMnemonic(
        created.mnemonic,
        "m/44'/60'/0'/0/1"
      );

      expect(defaultPath.address).not.toBe(customPath.address);
      expect(defaultPath.privateKey).not.toBe(customPath.privateKey);
    });
  });

  describe('validateAddress', () => {
    it('should return valid for a correct address', () => {
      const wallet = walletService.createWallet();
      const result = walletService.validateAddress(wallet.address);

      expect(result.valid).toBe(true);
    });

    it('should detect checksum correctness', () => {
      const checksummed = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed';
      const lower = checksummed.toLowerCase();

      const checksumResult = walletService.validateAddress(checksummed);
      expect(checksumResult.valid).toBe(true);
      expect(checksumResult.checksum).toBe(true);

      const lowerResult = walletService.validateAddress(lower);
      expect(lowerResult.valid).toBe(true);
      expect(lowerResult.checksum).toBe(false);
    });

    it('should return invalid for a bad address', () => {
      const result = walletService.validateAddress('0x1234');
      expect(result.valid).toBe(false);
      expect(result.checksum).toBe(false);
    });

    it('should return invalid for empty string', () => {
      const result = walletService.validateAddress('');
      expect(result.valid).toBe(false);
    });
  });

  describe('signMessage and verifySignature', () => {
    it('should sign a message and verify it back', () => {
      const wallet = walletService.createWallet();
      const message = 'Hello BlockMind';

      const signature = walletService.signMessage(wallet.privateKey, message);
      expect(signature).toMatch(/^0x[0-9a-fA-F]{130}$/);

      const verification = walletService.verifySignature(message, signature);
      expect(verification.valid).toBe(true);
      expect(verification.recoveredAddress.toLowerCase()).toBe(
        wallet.address.toLowerCase()
      );
    });

    it('should fail verification with wrong message', () => {
      const wallet = walletService.createWallet();
      const signature = walletService.signMessage(wallet.privateKey, 'Message A');

      const verification = walletService.verifySignature('Message B', signature);
      expect(verification.recoveredAddress.toLowerCase()).not.toBe(
        wallet.address.toLowerCase()
      );
    });

    it('should produce deterministic signatures for the same key and message', () => {
      const wallet = walletService.createWallet();
      const message = 'deterministic test';

      const sig1 = walletService.signMessage(wallet.privateKey, message);
      const sig2 = walletService.signMessage(wallet.privateKey, message);

      expect(sig1).toBe(sig2);
    });
  });

  describe('import validation failures', () => {
    it('should throw on invalid private key', () => {
      expect(() => walletService.importFromPrivateKey('not-a-key')).toThrow();
    });

    it('should throw on invalid mnemonic', () => {
      expect(() =>
        walletService.importFromMnemonic('this is not a valid mnemonic phrase')
      ).toThrow();
    });
  });
});
