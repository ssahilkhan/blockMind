import {
  STANDARD_BADGE_COLORS,
  guessStandardFromEventName,
  type DecodedEvent,
  type RecentEvent,
  type RegistryEntry,
  type RegistryInfo,
} from "@/types/events";

describe("Event Types", () => {
  describe("STANDARD_BADGE_COLORS", () => {
    it("has colors for all standards", () => {
      expect(STANDARD_BADGE_COLORS.ERC20).toBeDefined();
      expect(STANDARD_BADGE_COLORS.ERC721).toBeDefined();
      expect(STANDARD_BADGE_COLORS.ERC1155).toBeDefined();
      expect(STANDARD_BADGE_COLORS.Custom).toBeDefined();
    });
  });

  describe("guessStandardFromEventName", () => {
    it("identifies ERC20 events", () => {
      expect(guessStandardFromEventName("Transfer")).toBe("ERC20");
      expect(guessStandardFromEventName("Approval")).toBe("ERC20");
    });

    it("identifies ERC721 events", () => {
      expect(guessStandardFromEventName("ApprovalForAll")).toBe("ERC721");
      expect(guessStandardFromEventName("OwnershipTransferred")).toBe("ERC721");
    });

    it("identifies ERC1155 events", () => {
      expect(guessStandardFromEventName("TransferSingle")).toBe("ERC1155");
      expect(guessStandardFromEventName("TransferBatch")).toBe("ERC1155");
    });

    it("returns Custom for unknown events", () => {
      expect(guessStandardFromEventName("SomeCustomEvent")).toBe("Custom");
      expect(guessStandardFromEventName("Upgraded")).toBe("Custom");
    });
  });

  describe("types compile", () => {
    it("creates DecodedEvent", () => {
      const event: DecodedEvent = {
        eventName: "Transfer",
        signature: "Transfer(address,address,uint256)",
        args: { from: "0xaaa", to: "0xbbb", value: "100" },
        contract: "0xccc",
        logIndex: 0,
        blockNumber: 1,
        blockHash: "0xddd",
        transactionHash: "0xeee",
        from: "0xaaa",
        to: "0xbbb",
      };
      expect(event.eventName).toBe("Transfer");
    });

    it("creates RecentEvent", () => {
      const recent: RecentEvent = {
        eventName: "Approval",
        contract: "0xaaa",
        blockNumber: 42,
        transactionHash: "0xbbb",
        viewedAt: Date.now(),
      };
      expect(recent.blockNumber).toBe(42);
    });

    it("creates RegistryEntry", () => {
      const entry: RegistryEntry = {
        signature: "ERC20:Transfer",
        name: "Transfer",
        standard: "ERC20",
      };
      expect(entry.name).toBe("Transfer");
    });

    it("creates RegistryInfo", () => {
      const info: RegistryInfo = {
        standards: ["ERC20", "ERC721"],
        events: [],
        contracts: [],
      };
      expect(info.standards).toHaveLength(2);
    });
  });
});
