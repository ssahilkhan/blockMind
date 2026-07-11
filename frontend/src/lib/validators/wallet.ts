import { z } from "zod";

const ETH_ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;
const PRIVATE_KEY_REGEX = /^0x[0-9a-fA-F]{64}$/;

export const privateKeyField = z
  .string()
  .min(1, "Private key is required")
  .regex(PRIVATE_KEY_REGEX, "Invalid private key format (0x + 64 hex characters)");

export const mnemonicField = z
  .string()
  .min(1, "Mnemonic is required")
  .refine(
    (val) => val.trim().split(/\s+/).length >= 12,
    "Mnemonic must be at least 12 words",
  );

export const addressField = z
  .string()
  .min(1, "Address is required")
  .regex(ETH_ADDRESS_REGEX, "Invalid Ethereum address format (0x + 40 hex characters)");

export const messageField = z
  .string()
  .min(1, "Message is required");

export const importPrivateKeySchema = z.object({
  privateKey: privateKeyField,
});

export const importMnemonicSchema = z.object({
  mnemonic: mnemonicField,
});

export const lookupAddressSchema = z.object({
  address: addressField,
});

export const signMessageSchema = z.object({
  privateKey: privateKeyField,
  message: messageField,
});

export const verifySignatureSchema = z.object({
  message: messageField,
  signature: z.string().min(1, "Signature is required"),
  address: addressField,
});

export type ImportPrivateKeyInput = z.infer<typeof importPrivateKeySchema>;
export type ImportMnemonicInput = z.infer<typeof importMnemonicSchema>;
export type LookupAddressInput = z.infer<typeof lookupAddressSchema>;
export type SignMessageInput = z.infer<typeof signMessageSchema>;
export type VerifySignatureInput = z.infer<typeof verifySignatureSchema>;
