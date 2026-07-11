import {
  compileSchema,
  deploySchema,
  interactSchema,
  encodeSchema,
  decodeSchema,
  eventDecodeSchema,
} from "@/lib/validators/contract";

const VALID_ADDR = "0x" + "ab".repeat(20);
const VALID_PK = "0x" + "cd".repeat(32);
const VALID_TX = "0x" + "ef".repeat(32);

describe("Contract Validators", () => {
  describe("compileSchema", () => {
    it("accepts valid source", () => {
      const result = compileSchema.safeParse({ source: "contract Foo {}" });
      expect(result.success).toBe(true);
    });

    it("rejects empty source", () => {
      const result = compileSchema.safeParse({ source: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("deploySchema", () => {
    it("accepts valid input", () => {
      const result = deploySchema.safeParse({ privateKey: VALID_PK });
      expect(result.success).toBe(true);
    });

    it("accepts with constructor args", () => {
      const result = deploySchema.safeParse({
        privateKey: VALID_PK,
        constructorArgs: "[1, 2]",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid private key", () => {
      const result = deploySchema.safeParse({ privateKey: "bad" });
      expect(result.success).toBe(false);
    });
  });

  describe("interactSchema", () => {
    it("accepts valid address + abi", () => {
      const result = interactSchema.safeParse({
        address: VALID_ADDR,
        abi: JSON.stringify([{ type: "function" }]),
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid address", () => {
      const result = interactSchema.safeParse({
        address: "not-addr",
        abi: "[]",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty abi", () => {
      const result = interactSchema.safeParse({
        address: VALID_ADDR,
        abi: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("encodeSchema", () => {
    it("accepts valid input", () => {
      const result = encodeSchema.safeParse({
        functionName: "transfer",
        args: '["0x...", 100]',
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty function name", () => {
      const result = encodeSchema.safeParse({ functionName: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("decodeSchema", () => {
    it("accepts valid calldata", () => {
      const result = decodeSchema.safeParse({ data: "0x6d4ce63c" });
      expect(result.success).toBe(true);
    });

    it("rejects empty data", () => {
      const result = decodeSchema.safeParse({ data: "" });
      expect(result.success).toBe(false);
    });

    it("rejects non-hex data", () => {
      const result = decodeSchema.safeParse({ data: "hello" });
      expect(result.success).toBe(false);
    });
  });

  describe("eventDecodeSchema", () => {
    it("accepts valid tx hash", () => {
      const result = eventDecodeSchema.safeParse({ txHash: VALID_TX });
      expect(result.success).toBe(true);
    });

    it("rejects short hash", () => {
      const result = eventDecodeSchema.safeParse({ txHash: "0x123" });
      expect(result.success).toBe(false);
    });
  });
});
