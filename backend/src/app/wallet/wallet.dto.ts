export interface ImportPrivateKeyDto {
  privateKey: string;
}

export interface ImportMnemonicDto {
  mnemonic: string;
  path?: string;
}

export interface SignMessageDto {
  privateKey: string;
  message: string;
}

export interface VerifySignatureDto {
  message: string;
  signature: string;
}
