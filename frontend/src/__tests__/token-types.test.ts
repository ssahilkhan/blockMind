import { STANDARD_COLORS, STANDARD_LABELS, type TokenStandardType, type RecentToken, type RecentTransfer } from "@/types/token";

describe("Token Types", () => {
  describe("STANDARD_COLORS", () => {
    it("has colors for all standards", () => {
      expect(STANDARD_COLORS.ERC20).toBeDefined();
      expect(STANDARD_COLORS.ERC721).toBeDefined();
      expect(STANDARD_COLORS.ERC1155).toBeDefined();
      expect(STANDARD_COLORS.Unknown).toBeDefined();
    });
  });

  describe("STANDARD_LABELS", () => {
    it("has labels for all standards", () => {
      expect(STANDARD_LABELS.ERC20).toContain("Fungible");
      expect(STANDARD_LABELS.ERC721).toContain("Non-Fungible");
      expect(STANDARD_LABELS.ERC1155).toContain("Multi-Token");
      expect(STANDARD_LABELS.Unknown).toContain("Unknown");
    });
  });

  describe("types compile", () => {
    it("creates RecentToken", () => {
      const token: RecentToken = {
        address: "0x" + "aa".repeat(20),
        name: "Test",
        symbol: "TST",
        standard: "ERC20",
        viewedAt: Date.now(),
      };
      expect(token.address).toHaveLength(42);
    });

    it("creates RecentTransfer", () => {
      const transfer: RecentTransfer = {
        hash: "0x" + "bb".repeat(32),
        tokenAddress: "0x" + "cc".repeat(20),
        to: "0x" + "dd".repeat(20),
        amount: "100",
        standard: "ERC20",
        timestamp: Date.now(),
      };
      expect(transfer.amount).toBe("100");
    });
  });
});
