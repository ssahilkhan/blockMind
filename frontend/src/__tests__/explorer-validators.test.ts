import { searchSchema } from "@/lib/validators/explorer";

describe("Explorer Validators", () => {
  describe("searchSchema", () => {
    it("accepts a valid block number", () => {
      const result = searchSchema.safeParse({ query: "123" });
      expect(result.success).toBe(true);
    });

    it("accepts a valid block hash (0x + 64 hex)", () => {
      const hash = "0x" + "ab".repeat(32);
      const result = searchSchema.safeParse({ query: hash });
      expect(result.success).toBe(true);
    });

    it("accepts a valid tx hash (0x + 64 hex)", () => {
      const hash = "0x" + "cd".repeat(32);
      const result = searchSchema.safeParse({ query: hash });
      expect(result.success).toBe(true);
    });

    it("accepts 0x prefix with hex chars", () => {
      const result = searchSchema.safeParse({ query: "0xabc" });
      expect(result.success).toBe(true);
    });

    it("rejects empty string", () => {
      const result = searchSchema.safeParse({ query: "" });
      expect(result.success).toBe(false);
    });

    it("rejects random text", () => {
      const result = searchSchema.safeParse({ query: "hello world" });
      expect(result.success).toBe(false);
    });
  });
});
