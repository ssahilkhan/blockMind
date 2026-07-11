import {
  buildTransactionSchema,
  estimateGasSchema,
  trackTxSchema,
} from "@/lib/validators/transaction";

const VALID_ADDR = "0x" + "ab".repeat(20);
const VALID_PK = "0x" + "cd".repeat(32);
const VALID_TX_HASH = "0x" + "ef".repeat(32);

describe("Transaction Validators", () => {
  describe("buildTransactionSchema", () => {
    it("accepts valid input", () => {
      const result = buildTransactionSchema.safeParse({
        from: VALID_ADDR,
        to: VALID_ADDR,
        value: "1.5",
        privateKey: VALID_PK,
      });
      expect(result.success).toBe(true);
    });

    it("accepts with optional fields", () => {
      const result = buildTransactionSchema.safeParse({
        from: VALID_ADDR,
        to: VALID_ADDR,
        value: "0.1",
        data: "0x",
        gasLimit: "21000",
        gasPrice: "20000000000",
        privateKey: VALID_PK,
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing from", () => {
      const result = buildTransactionSchema.safeParse({
        to: VALID_ADDR,
        value: "1",
        privateKey: VALID_PK,
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid to address", () => {
      const result = buildTransactionSchema.safeParse({
        from: VALID_ADDR,
        to: "not-an-address",
        value: "1",
        privateKey: VALID_PK,
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid value", () => {
      const result = buildTransactionSchema.safeParse({
        from: VALID_ADDR,
        to: VALID_ADDR,
        value: "abc",
        privateKey: VALID_PK,
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid private key", () => {
      const result = buildTransactionSchema.safeParse({
        from: VALID_ADDR,
        to: VALID_ADDR,
        value: "1",
        privateKey: "bad-key",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("estimateGasSchema", () => {
    it("accepts valid input", () => {
      const result = estimateGasSchema.safeParse({
        from: VALID_ADDR,
        to: VALID_ADDR,
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing from", () => {
      const result = estimateGasSchema.safeParse({ to: VALID_ADDR });
      expect(result.success).toBe(false);
    });
  });

  describe("trackTxSchema", () => {
    it("accepts valid tx hash", () => {
      const result = trackTxSchema.safeParse({ hash: VALID_TX_HASH });
      expect(result.success).toBe(true);
    });

    it("rejects short hash", () => {
      const result = trackTxSchema.safeParse({ hash: "0x123" });
      expect(result.success).toBe(false);
    });

    it("rejects empty hash", () => {
      const result = trackTxSchema.safeParse({ hash: "" });
      expect(result.success).toBe(false);
    });
  });
});
