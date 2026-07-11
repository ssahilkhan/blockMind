import { analyzeTransactionPreSend } from "@/features/copilot/assistants/transaction";
import type { CopilotContext } from "@/features/copilot/types";

function makeCtx(overrides: Partial<CopilotContext> = {}): CopilotContext {
  return { workspace: "transaction", ...overrides };
}

describe("Transaction Assistant", () => {
  it("returns 'No Transaction Data' when no tx data", () => {
    const result = analyzeTransactionPreSend(makeCtx());
    expect(result).toEqual([
      expect.objectContaining({ title: "No Transaction Data" }),
    ]);
  });

  it("flags high-value transfer (>10 ETH parsed as number)", () => {
    const ctx = makeCtx({
      transactionData: { to: "0xABC", value: "100", data: "0x" },
    });
    const result = analyzeTransactionPreSend(ctx);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "High Value Transfer" }),
      ]),
    );
  });

  it("flags contract interaction (non-empty data)", () => {
    const ctx = makeCtx({
      transactionData: { to: "0xABC", value: "0", data: "0xa9059cbb000000000000000000000000" },
    });
    const result = analyzeTransactionPreSend(ctx);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "Contract Interaction Detected" }),
      ]),
    );
  });

  it("flags ERC-20 approval (0x095ea7b3)", () => {
    const ctx = makeCtx({
      transactionData: { to: "0xABC", value: "0", data: "0x095ea7b3000000000000000000000000" },
    });
    const result = analyzeTransactionPreSend(ctx);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "ERC-20 Approval Detected" }),
      ]),
    );
  });

  it("flags high gas price (>100 Gwei)", () => {
    const ctx = makeCtx({
      transactionData: { to: "0xABC", value: "0", data: "0x", gasPrice: "200000000000" },
    });
    const result = analyzeTransactionPreSend(ctx);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "High Gas Price" }),
      ]),
    );
  });

  it("flags contract deployment (no to address)", () => {
    const ctx = makeCtx({
      transactionData: { to: "", value: "0", data: "0x6080604052" },
    });
    const result = analyzeTransactionPreSend(ctx);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "Contract Deployment" }),
      ]),
    );
  });

  it("flags zero-address recipient", () => {
    const ctx = makeCtx({
      transactionData: { to: "0x0000000000000000000000000000000000000000", value: "0", data: "0x" },
    });
    const result = analyzeTransactionPreSend(ctx);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "Zero Address Target" }),
      ]),
    );
  });

  it("flags large calldata (>1000 chars data)", () => {
    const data = "0x" + "ab".repeat(501);
    const ctx = makeCtx({
      transactionData: { to: "0xABC", value: "0", data },
    });
    const result = analyzeTransactionPreSend(ctx);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "Large Calldata" }),
      ]),
    );
  });
});
