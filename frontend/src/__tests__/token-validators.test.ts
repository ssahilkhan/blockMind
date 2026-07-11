import {
  tokenAddressSchema,
  balanceLookupSchema,
  tokenTransferSchema,
  approveSchema,
  allowanceSchema,
  nftLookupSchema,
} from "@/lib/validators/token";

const VALID_ADDR = "0x" + "ab".repeat(20);
const VALID_PK = "0x" + "cd".repeat(32);

describe("Token Validators", () => {
  describe("tokenAddressSchema", () => {
    it("accepts valid address", () => {
      expect(tokenAddressSchema.safeParse({ address: VALID_ADDR }).success).toBe(true);
    });

    it("rejects invalid address", () => {
      expect(tokenAddressSchema.safeParse({ address: "bad" }).success).toBe(false);
    });

    it("rejects empty address", () => {
      expect(tokenAddressSchema.safeParse({ address: "" }).success).toBe(false);
    });
  });

  describe("balanceLookupSchema", () => {
    it("accepts valid input", () => {
      expect(
        balanceLookupSchema.safeParse({
          tokenAddress: VALID_ADDR,
          walletAddress: VALID_ADDR,
        }).success,
      ).toBe(true);
    });

    it("accepts with tokenId", () => {
      expect(
        balanceLookupSchema.safeParse({
          tokenAddress: VALID_ADDR,
          walletAddress: VALID_ADDR,
          tokenId: "1",
        }).success,
      ).toBe(true);
    });

    it("rejects invalid wallet address", () => {
      expect(
        balanceLookupSchema.safeParse({
          tokenAddress: VALID_ADDR,
          walletAddress: "bad",
        }).success,
      ).toBe(false);
    });
  });

  describe("tokenTransferSchema", () => {
    it("accepts valid input", () => {
      expect(
        tokenTransferSchema.safeParse({
          to: VALID_ADDR,
          amount: "100",
          privateKey: VALID_PK,
        }).success,
      ).toBe(true);
    });

    it("rejects non-numeric amount", () => {
      expect(
        tokenTransferSchema.safeParse({
          to: VALID_ADDR,
          amount: "abc",
          privateKey: VALID_PK,
        }).success,
      ).toBe(false);
    });

    it("rejects invalid private key", () => {
      expect(
        tokenTransferSchema.safeParse({
          to: VALID_ADDR,
          amount: "100",
          privateKey: "bad",
        }).success,
      ).toBe(false);
    });
  });

  describe("approveSchema", () => {
    it("accepts valid input", () => {
      expect(
        approveSchema.safeParse({
          spender: VALID_ADDR,
          amount: "1000",
          privateKey: VALID_PK,
        }).success,
      ).toBe(true);
    });

    it("rejects empty spender", () => {
      expect(
        approveSchema.safeParse({
          spender: "",
          amount: "1000",
          privateKey: VALID_PK,
        }).success,
      ).toBe(false);
    });
  });

  describe("allowanceSchema", () => {
    it("accepts valid input", () => {
      expect(
        allowanceSchema.safeParse({
          owner: VALID_ADDR,
          spender: VALID_ADDR,
        }).success,
      ).toBe(true);
    });

    it("rejects invalid owner", () => {
      expect(
        allowanceSchema.safeParse({
          owner: "bad",
          spender: VALID_ADDR,
        }).success,
      ).toBe(false);
    });
  });

  describe("nftLookupSchema", () => {
    it("accepts valid token ID", () => {
      expect(nftLookupSchema.safeParse({ tokenId: "1" }).success).toBe(true);
    });

    it("accepts large token ID", () => {
      expect(nftLookupSchema.safeParse({ tokenId: "999999" }).success).toBe(true);
    });

    it("rejects non-numeric token ID", () => {
      expect(nftLookupSchema.safeParse({ tokenId: "abc" }).success).toBe(false);
    });

    it("rejects empty token ID", () => {
      expect(nftLookupSchema.safeParse({ tokenId: "" }).success).toBe(false);
    });
  });
});
