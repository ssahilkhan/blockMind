import {
  analyzeTokenContext,
  analyzeTokenApproval,
} from "@/features/copilot/assistants/token";
import type { CopilotContext } from "@/features/copilot/types";

function makeCtx(overrides: Partial<CopilotContext> = {}): CopilotContext {
  return { workspace: "token", ...overrides };
}

describe("Token Assistant", () => {
  describe("analyzeTokenContext", () => {
    it("returns overview if only token address", () => {
      const result = analyzeTokenContext(makeCtx({ tokenAddress: "0xABC" }));
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Token Overview" }),
        ]),
      );
    });

    it("returns empty if no token address and no data", () => {
      expect(analyzeTokenContext(makeCtx())).toEqual([]);
    });

    it("flags ERC-20 standard info", () => {
      const result = analyzeTokenContext(makeCtx(), { standard: "ERC20" });
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "ERC20 Token Standard" }),
        ]),
      );
    });

    it("flags unusual decimals (>18)", () => {
      const result = analyzeTokenContext(makeCtx(), { decimals: 24 });
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Unusual Decimals" }),
        ]),
      );
    });

    it("flags paused token", () => {
      const result = analyzeTokenContext(makeCtx(), { paused: true });
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Token is Paused" }),
        ]),
      );
    });

    it("flags unverified contract", () => {
      const result = analyzeTokenContext(makeCtx(), { isVerified: false });
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Unverified Token" }),
        ]),
      );
    });

    it("flags mint capability", () => {
      const result = analyzeTokenContext(makeCtx(), { hasMintCapability: true });
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Mint Function Detected" }),
        ]),
      );
    });

    it("flags zero total supply", () => {
      const result = analyzeTokenContext(makeCtx(), { totalSupply: "0" });
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Zero Total Supply" }),
        ]),
      );
    });
  });

  describe("analyzeTokenApproval", () => {
    it("flags unlimited allowance", () => {
      const result = analyzeTokenApproval(
        "USDC",
        "0x0000000000000000000000000000000000000001",
        "115792089237316195423570985008687907853269984665640564039457584007913129639935",
      );
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Unlimited Approval for USDC" }),
        ]),
      );
    });

    it("flags approval to zero address", () => {
      const result = analyzeTokenApproval(
        "USDC",
        "0x0000000000000000000000000000000000000000",
        "100",
      );
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Approval to Zero Address" }),
        ]),
      );
    });

    it("returns empty for normal approval", () => {
      const result = analyzeTokenApproval(
        "USDC",
        "0x0000000000000000000000000000000000000001",
        "1000",
      );
      expect(result).toEqual([]);
    });
  });
});
