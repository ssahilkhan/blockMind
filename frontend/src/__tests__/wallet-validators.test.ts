import {
  importPrivateKeySchema,
  importMnemonicSchema,
  lookupAddressSchema,
  signMessageSchema,
  verifySignatureSchema,
} from "@/lib/validators";

describe("Wallet Validators", () => {
  describe("importPrivateKeySchema", () => {
    it("accepts valid private key", () => {
      const result = importPrivateKeySchema.safeParse({
        privateKey: "0x" + "a".repeat(64),
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty key", () => {
      const result = importPrivateKeySchema.safeParse({ privateKey: "" });
      expect(result.success).toBe(false);
    });

    it("rejects invalid format", () => {
      const result = importPrivateKeySchema.safeParse({
        privateKey: "not-a-key",
      });
      expect(result.success).toBe(false);
    });

    it("rejects short key", () => {
      const result = importPrivateKeySchema.safeParse({
        privateKey: "0x" + "a".repeat(10),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("importMnemonicSchema", () => {
    it("accepts valid 12-word mnemonic", () => {
      const mnemonic = Array(12).fill("word").join(" ");
      const result = importMnemonicSchema.safeParse({ mnemonic });
      expect(result.success).toBe(true);
    });

    it("rejects empty mnemonic", () => {
      const result = importMnemonicSchema.safeParse({ mnemonic: "" });
      expect(result.success).toBe(false);
    });

    it("rejects short mnemonic", () => {
      const result = importMnemonicSchema.safeParse({
        mnemonic: "one two three",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("lookupAddressSchema", () => {
    it("accepts valid address", () => {
      const result = lookupAddressSchema.safeParse({
        address: "0x" + "ab".repeat(20),
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid address", () => {
      const result = lookupAddressSchema.safeParse({
        address: "not-an-address",
      });
      expect(result.success).toBe(false);
    });

    it("rejects short address", () => {
      const result = lookupAddressSchema.safeParse({
        address: "0x123",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("signMessageSchema", () => {
    it("accepts valid input", () => {
      const result = signMessageSchema.safeParse({
        privateKey: "0x" + "a".repeat(64),
        message: "Hello, world!",
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing message", () => {
      const result = signMessageSchema.safeParse({
        privateKey: "0x" + "a".repeat(64),
        message: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("verifySignatureSchema", () => {
    it("accepts valid input", () => {
      const result = verifySignatureSchema.safeParse({
        message: "Hello",
        signature: "0x" + "ab".repeat(32),
        address: "0x" + "cd".repeat(20),
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing signature", () => {
      const result = verifySignatureSchema.safeParse({
        message: "Hello",
        signature: "",
        address: "0x" + "cd".repeat(20),
      });
      expect(result.success).toBe(false);
    });
  });
});
