import {
  eventSearchSchema,
  blockRangeSchema,
  txHashSearchSchema,
} from "@/lib/validators/events";

const VALID_TX = "0x" + "ab".repeat(32);

describe("Event Validators", () => {
  describe("eventSearchSchema", () => {
    it("accepts empty search (all optional)", () => {
      expect(eventSearchSchema.safeParse({}).success).toBe(true);
    });

    it("accepts contract only", () => {
      expect(
        eventSearchSchema.safeParse({ contract: "0x" + "aa".repeat(20) }).success,
      ).toBe(true);
    });

    it("accepts event name only", () => {
      expect(eventSearchSchema.safeParse({ event: "Transfer" }).success).toBe(true);
    });

    it("accepts all fields", () => {
      expect(
        eventSearchSchema.safeParse({
          contract: "0x" + "aa".repeat(20),
          event: "Transfer",
          txHash: VALID_TX,
          wallet: "0x" + "bb".repeat(20),
        }).success,
      ).toBe(true);
    });
  });

  describe("blockRangeSchema", () => {
    it("accepts valid range", () => {
      expect(
        blockRangeSchema.safeParse({ fromBlock: "0", toBlock: "10" }).success,
      ).toBe(true);
    });

    it("accepts same block", () => {
      expect(
        blockRangeSchema.safeParse({ fromBlock: "100", toBlock: "100" }).success,
      ).toBe(true);
    });

    it("rejects to < from", () => {
      expect(
        blockRangeSchema.safeParse({ fromBlock: "10", toBlock: "5" }).success,
      ).toBe(false);
    });

    it("rejects range > 100", () => {
      expect(
        blockRangeSchema.safeParse({ fromBlock: "0", toBlock: "200" }).success,
      ).toBe(false);
    });

    it("rejects non-numeric", () => {
      expect(
        blockRangeSchema.safeParse({ fromBlock: "abc", toBlock: "10" }).success,
      ).toBe(false);
    });

    it("rejects empty fields", () => {
      expect(
        blockRangeSchema.safeParse({ fromBlock: "", toBlock: "10" }).success,
      ).toBe(false);
    });
  });

  describe("txHashSearchSchema", () => {
    it("accepts valid tx hash", () => {
      expect(txHashSearchSchema.safeParse({ txHash: VALID_TX }).success).toBe(true);
    });

    it("rejects short hash", () => {
      expect(txHashSearchSchema.safeParse({ txHash: "0x123" }).success).toBe(false);
    });

    it("rejects empty hash", () => {
      expect(txHashSearchSchema.safeParse({ txHash: "" }).success).toBe(false);
    });
  });
});
