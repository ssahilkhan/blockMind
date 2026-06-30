export interface CreatedWallet {
  address: string;
  publicKey: string;
  privateKey: string;
  mnemonic: string;
  path: string;
}

export interface ImportedWallet {
  address: string;
  publicKey: string;
}

export interface ImportedMnemonicWallet {
  address: string;
  publicKey: string;
  privateKey: string;
  path: string;
}

export interface AddressValidationResult {
  valid: boolean;
  checksum: boolean;
}

export interface WalletDetails {
  address: string;
  balance: string;
  balanceWei: string;
  nonce: number;
  transactionCount: number;
  chainId: number;
  network: string;
}

export interface BalanceResult {
  address: string;
  balance: string;
  balanceWei: string;
  network: string;
  chainId: number;
}

export interface SignatureResult {
  signature: string;
}

export interface VerificationResult {
  valid: boolean;
  recoveredAddress: string;
}
