import {
  analyzeWalletContext,
  analyzeWalletApprovals,
} from "@/features/copilot/assistants/wallet";
import type { CopilotContext } from "@/features/copilot/types";

function makeCtx(overrides: Partial<CopilotContext> = {}): CopilotContext {
  return { workspace: "wallet", ...overrides };
}

describe("Wallet Assistant", () => {
  describe("analyzeWalletContext", () => {
    it("returns empty for no wallet address", () => {
      const result = analyzeWalletContext(makeCtx());
      expect(result).toEqual([]);
    });

    it("returns overview when wallet address provided", () => {
      const result = analyzeWalletContext(makeCtx({ walletAddress: "0xABCDEF1234567890" }));
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Wallet Overview" }),
        ]),
      );
    });

    it("flags empty wallet when data.balance is '0'", () => {
      const result = analyzeWalletContext(
        makeCtx({ walletAddress: "0xABC" }),
        { balance: "0" },
      );
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Empty Wallet" }),
        ]),
      );
    });

    it("flags no transaction history when transactionCount is 0", () => {
      const result = analyzeWalletContext(
        makeCtx({ walletAddress: "0xABC" }),
        { transactionCount: 0 },
      );
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "No Transaction History" }),
        ]),
      );
    });

    it("flags many approvals when >10", () => {
      const approvals = Array.from({ length: 15 }, () => ({
        spender: "0x0000000000000000000000000000000000000001",
        amount: "100",
      }));
      const result = analyzeWalletContext(
        makeCtx({ walletAddress: "0xABC" }),
        { approvals },
      );
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Many Active Approvals" }),
        ]),
      );
    });

    it("flags unlimited approvals", () => {
      const result = analyzeWalletContext(
        makeCtx({ walletAddress: "0xABC" }),
        { approvals: [{ spender: "0xAAA", amount: "100", unlimited: true }] },
      );
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Unlimited Token Approvals" }),
        ]),
      );
    });
  });

  describe("analyzeWalletApprovals", () => {
    it("returns empty for no approvals", () => {
      expect(analyzeWalletApprovals([])).toEqual([]);
    });

    it("flags unlimited approvals", () => {
      const result = analyzeWalletApprovals([
        { spender: "0x0000000000000000000000000000000000000001", amount: "100", unlimited: true, tokenName: "USDC" },
      ]);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "1 Unlimited Approval(s)" }),
        ]),
      );
    });

    it("flags suspicious zero-address spenders", () => {
      const result = analyzeWalletApprovals([
        { spender: "0x0000000000000000000000000000000000000000", amount: "100" },
      ]);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Suspicious Spender Addresses" }),
        ]),
      );
    });
  });
});
