import {
  aiMessageSchema,
  conversationTitleSchema,
  providerConfigSchema,
  transactionHashInputSchema,
  contractAddressInputSchema,
  walletAddressInputSchema,
} from "@/features/ai/validators";

const VALID_TX = "0x" + "ab".repeat(32);
const VALID_ADDR = "0x" + "cd".repeat(20);

describe("AI Validators", () => {
  describe("aiMessageSchema", () => {
    it("accepts valid message", () => {
      expect(aiMessageSchema.safeParse({ content: "Hello" }).success).toBe(true);
    });

    it("rejects empty message", () => {
      expect(aiMessageSchema.safeParse({ content: "" }).success).toBe(false);
    });

    it("rejects very long message", () => {
      expect(aiMessageSchema.safeParse({ content: "x".repeat(10001) }).success).toBe(false);
    });

    it("accepts optional mode", () => {
      expect(
        aiMessageSchema.safeParse({ content: "Hi", mode: "transaction" }).success,
      ).toBe(true);
    });
  });

  describe("conversationTitleSchema", () => {
    it("accepts valid title", () => {
      expect(conversationTitleSchema.safeParse({ title: "My Chat" }).success).toBe(true);
    });

    it("rejects empty title", () => {
      expect(conversationTitleSchema.safeParse({ title: "" }).success).toBe(false);
    });

    it("rejects long title", () => {
      expect(conversationTitleSchema.safeParse({ title: "x".repeat(101) }).success).toBe(false);
    });
  });

  describe("providerConfigSchema", () => {
    it("accepts valid config", () => {
      expect(
        providerConfigSchema.safeParse({ id: "openai", apiKey: "sk-123" }).success,
      ).toBe(true);
    });

    it("accepts config without apiKey", () => {
      expect(providerConfigSchema.safeParse({ id: "ollama" }).success).toBe(true);
    });

    it("rejects invalid provider id", () => {
      expect(providerConfigSchema.safeParse({ id: "invalid" }).success).toBe(false);
    });
  });

  describe("transactionHashInputSchema", () => {
    it("accepts valid hash", () => {
      expect(transactionHashInputSchema.safeParse({ hash: VALID_TX }).success).toBe(true);
    });

    it("rejects short hash", () => {
      expect(transactionHashInputSchema.safeParse({ hash: "0x123" }).success).toBe(false);
    });

    it("rejects non-hex", () => {
      expect(
        transactionHashInputSchema.safeParse({
          hash: "0x" + "zz".repeat(32),
        }).success,
      ).toBe(false);
    });
  });

  describe("contractAddressInputSchema", () => {
    it("accepts valid address", () => {
      expect(
        contractAddressInputSchema.safeParse({ address: VALID_ADDR }).success,
      ).toBe(true);
    });

    it("rejects short address", () => {
      expect(
        contractAddressInputSchema.safeParse({ address: "0x123" }).success,
      ).toBe(false);
    });
  });

  describe("walletAddressInputSchema", () => {
    it("accepts valid address", () => {
      expect(
        walletAddressInputSchema.safeParse({ address: VALID_ADDR }).success,
      ).toBe(true);
    });

    it("rejects empty address", () => {
      expect(walletAddressInputSchema.safeParse({ address: "" }).success).toBe(false);
    });
  });
});
