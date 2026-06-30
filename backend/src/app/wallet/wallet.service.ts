import { ethers } from 'ethers';
import { getChainService } from '../chain/services/chain.service';
import {
  CreatedWallet,
  ImportedWallet,
  ImportedMnemonicWallet,
  AddressValidationResult,
  WalletDetails,
  BalanceResult,
  VerificationResult,
} from './wallet.types';
import { DEFAULT_DERIVATION_PATH } from './wallet.constants';

function getPublicKey(wallet: object): string {
  return (wallet as { signingKey: { publicKey: string } }).signingKey.publicKey;
}

export const walletService = {
  createWallet(): CreatedWallet {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      publicKey: getPublicKey(wallet),
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase ?? '',
      path: wallet.path || DEFAULT_DERIVATION_PATH,
    };
  },

  importFromPrivateKey(privateKey: string): ImportedWallet {
    const wallet = new ethers.Wallet(privateKey);
    return {
      address: wallet.address,
      publicKey: getPublicKey(wallet),
    };
  },

  importFromMnemonic(
    mnemonic: string,
    path: string = DEFAULT_DERIVATION_PATH
  ): ImportedMnemonicWallet {
    const wallet = ethers.HDNodeWallet.fromPhrase(mnemonic, undefined, path);
    return {
      address: wallet.address,
      publicKey: getPublicKey(wallet),
      privateKey: wallet.privateKey,
      path,
    };
  },

  validateAddress(address: string): AddressValidationResult {
    const valid = ethers.isAddress(address);
    if (!valid) {
      return { valid: false, checksum: false };
    }
    const checksummed = ethers.getAddress(address);
    return {
      valid: true,
      checksum: address === checksummed,
    };
  },

  async getWalletDetails(
    address: string
  ): Promise<WalletDetails> {
    const chain = getChainService();
    const [balance, txCount, network] = await Promise.all([
      chain.getBalance(address),
      chain.getTransactionCount(address),
      chain.getNetwork(),
    ]);
    return {
      address,
      balance: balance.balance,
      balanceWei: balance.balanceWei,
      nonce: txCount,
      transactionCount: txCount,
      chainId: network.chainId,
      network: network.name,
    };
  },

  async getBalance(
    address: string
  ): Promise<BalanceResult> {
    const chain = getChainService();
    const [balance, network] = await Promise.all([
      chain.getBalance(address),
      chain.getNetwork(),
    ]);
    return {
      address,
      balance: balance.balance,
      balanceWei: balance.balanceWei,
      network: network.name,
      chainId: network.chainId,
    };
  },

  signMessage(privateKey: string, message: string): string {
    const wallet = new ethers.Wallet(privateKey);
    return wallet.signMessageSync(message);
  },

  verifySignature(message: string, signature: string): VerificationResult {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return {
      valid: ethers.isAddress(recoveredAddress),
      recoveredAddress,
    };
  },
};
