import {
  securityAnalysisSchema,
  walletAnalysisSchema,
  contractAnalysisSchema,
  transactionAnalysisSchema,
  tokenAnalysisSchema,
} from "@/features/security/validators";

const VALID_ADDR = "0x" + "ab".repeat(20);
const VALID_TX = "0x" + "cd".repeat(32);

describe("Security Validators", () => {
  describe("securityAnalysisSchema", () => {
    it("accepts valid input", () => {
      expect(
        securityAnalysisSchema.safeParse({ type: "wallet", target: VALID_ADDR }).success,
      ).toBe(true);
    });

    it("rejects empty target", () => {
      expect(
        securityAnalysisSchema.safeParse({ type: "wallet", target: "" }).success,
      ).toBe(false);
    });

    it("rejects invalid type", () => {
      expect(
        securityAnalysisSchema.safeParse({ type: "invalid", target: VALID_ADDR }).success,
      ).toBe(false);
    });
  });

  describe("walletAnalysisSchema", () => {
    it("accepts valid address", () => {
      expect(walletAnalysisSchema.safeParse({ address: VALID_ADDR }).success).toBe(true);
    });

    it("rejects short address", () => {
      expect(walletAnalysisSchema.safeParse({ address: "0x123" }).success).toBe(false);
    });
  });

  describe("contractAnalysisSchema", () => {
    it("accepts valid address", () => {
      expect(contractAnalysisSchema.safeParse({ address: VALID_ADDR }).success).toBe(true);
    });
  });

  describe("transactionAnalysisSchema", () => {
    it("accepts valid hash", () => {
      expect(transactionAnalysisSchema.safeParse({ hash: VALID_TX }).success).toBe(true);
    });

    it("rejects short hash", () => {
      expect(transactionAnalysisSchema.safeParse({ hash: "0x123" }).success).toBe(false);
    });
  });

  describe("tokenAnalysisSchema", () => {
    it("accepts valid address", () => {
      expect(tokenAnalysisSchema.safeParse({ address: VALID_ADDR }).success).toBe(true);
    });
  });
});
