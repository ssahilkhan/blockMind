import {
  analyzeContractContext,
  analyzeContractABI,
  analyzeContractCode,
} from "@/features/copilot/assistants/contract";
import type { CopilotContext } from "@/features/copilot/types";

function makeContext(overrides: Partial<CopilotContext> = {}): CopilotContext {
  return { workspace: "contract", ...overrides };
}

describe("Contract Assistant", () => {
  describe("analyzeContractCode", () => {
    it("returns info when no source provided", () => {
      const result = analyzeContractCode({});
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "No contract source provided" }),
        ]),
      );
    });

    it("flags outdated solidity version", () => {
      const result = analyzeContractCode({ source: "pragma solidity ^0.7.0;" });
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Outdated Solidity Version" }),
        ]),
      );
    });

    it("flags selfdestruct", () => {
      const result = analyzeContractCode({ source: "function destroy() external { selfdestruct(payable(msg.sender)); }" });
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Selfdestruct Detected" }),
        ]),
      );
    });

    it("flags delegatecall", () => {
      const result = analyzeContractCode({ source: "target.delegatecall(data)" });
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Delegatecall Usage" }),
        ]),
      );
    });

    it("flags tx.origin with require", () => {
      const result = analyzeContractCode({ source: "require(msg.sender == tx.origin)" });
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "tx.origin for Authorization" }),
        ]),
      );
    });

    it("flags block.timestamp with require", () => {
      const result = analyzeContractCode({ source: "require(block.timestamp > deadline);" });
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Block Timestamp Dependency" }),
        ]),
      );
    });

    it("flags ecrecover / signature usage", () => {
      const result = analyzeContractCode({ source: "address signer = ecrecover(hash, v, r, s);" });
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Signature Verification" }),
        ]),
      );
    });

    it("flags no events", () => {
      const result = analyzeContractCode({ source: "function foo() external {}" });
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "No Events Defined" }),
        ]),
      );
    });

    it("flags high public function count (>10)", () => {
      const fns = Array.from({ length: 15 }, (_, i) => `function f${i}() external {}`).join("\n");
      const result = analyzeContractCode({ source: fns });
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "High Public Function Count" }),
        ]),
      );
    });

    it("flags payable without receive/fallback", () => {
      const result = analyzeContractCode({ source: "function deposit() external payable {}" });
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "No Receive/Fallback Function" }),
        ]),
      );
    });

    it("flags many public mappings (>5)", () => {
      const mappings = Array.from({ length: 7 }, (_, i) => `mapping(address => uint256) public bal${i};`).join("\n");
      const result = analyzeContractCode({ source: mappings });
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Many Public Mappings" }),
        ]),
      );
    });
  });

  describe("analyzeContractABI", () => {
    it("returns empty for empty ABI", () => {
      expect(analyzeContractABI([])).toEqual([]);
    });

    it("flags state changes without events", () => {
      const abi = [{ type: "function", name: "foo", stateMutability: "nonpayable" }];
      const result = analyzeContractABI(abi as any);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "State Changes Without Events" }),
        ]),
      );
    });

    it("flags payable functions without receive", () => {
      const abi = [
        { type: "function", name: "foo", stateMutability: "payable" },
        { type: "function", name: "bar", stateMutability: "view" },
      ];
      const result = analyzeContractABI(abi as any);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Payable Functions Without Receive" }),
        ]),
      );
    });

    it("flags read-only contract", () => {
      const abi = [
        { type: "function", name: "foo", stateMutability: "view" },
        { type: "function", name: "bar", stateMutability: "pure" },
      ];
      const result = analyzeContractABI(abi as any);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Read-Only Contract" }),
        ]),
      );
    });
  });

  describe("analyzeContractContext", () => {
    it("returns empty if no source or ABI", () => {
      expect(analyzeContractContext(makeContext())).toEqual([]);
    });

    it("returns source analysis if source present", () => {
      const result = analyzeContractContext(makeContext({ contractSource: "function foo() external {}" }));
      expect(result.length).toBeGreaterThan(0);
    });

    it("returns ABI analysis if ABI in metadata", () => {
      const result = analyzeContractContext(
        makeContext({ metadata: { abi: [{ type: "function", name: "foo", stateMutability: "nonpayable" }] } }),
      );
      expect(result.length).toBeGreaterThan(0);
    });

    it("returns contract verification suggestion if address present", () => {
      const result = analyzeContractContext(makeContext({ contractAddress: "0xABCDEF" }));
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Contract Verification" }),
        ]),
      );
    });
  });
});
