import {
  parseAbi,
  functionSignature,
  formatSolidityType,
  SAMPLE_COUNTER_SOL,
  type AbiFunction,
} from "@/types/contract";

describe("ABI Utilities", () => {
  const sampleAbi = [
    {
      type: "function",
      name: "count",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "increment",
      inputs: [],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "add",
      inputs: [
        { name: "a", type: "uint256" },
        { name: "b", type: "uint256" },
      ],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "pure",
    },
    {
      type: "event",
      name: "CountChanged",
      inputs: [{ name: "newCount", type: "uint256", indexed: false }],
    },
    {
      type: "constructor",
      inputs: [{ name: "initial", type: "uint256" }],
    },
  ];

  describe("parseAbi", () => {
    it("parses functions correctly", () => {
      const parsed = parseAbi(sampleAbi);
      expect(parsed.functions).toHaveLength(3);
      expect(parsed.readFunctions).toHaveLength(2);
      expect(parsed.writeFunctions).toHaveLength(1);
    });

    it("parses events correctly", () => {
      const parsed = parseAbi(sampleAbi);
      expect(parsed.events).toHaveLength(1);
      expect(parsed.events[0].name).toBe("CountChanged");
    });

    it("parses constructor correctly", () => {
      const parsed = parseAbi(sampleAbi);
      expect(parsed.constructor).not.toBeNull();
      expect(parsed.constructor!.inputs).toHaveLength(1);
    });

    it("handles empty abi", () => {
      const parsed = parseAbi([]);
      expect(parsed.functions).toHaveLength(0);
      expect(parsed.events).toHaveLength(0);
      expect(parsed.constructor).toBeNull();
    });

    it("skips invalid entries", () => {
      const parsed = parseAbi([null, "bad", { type: "unknown" }]);
      expect(parsed.functions).toHaveLength(0);
    });
  });

  describe("functionSignature", () => {
    it("generates correct signature", () => {
      const fn: AbiFunction = {
        type: "function",
        name: "transfer",
        inputs: [
          { name: "to", type: "address" },
          { name: "amount", type: "uint256" },
        ],
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
      };
      expect(functionSignature(fn)).toBe("transfer(address, uint256)");
    });

    it("handles no inputs", () => {
      const fn: AbiFunction = {
        type: "function",
        name: "count",
        inputs: [],
        outputs: [],
        stateMutability: "view",
      };
      expect(functionSignature(fn)).toBe("count()");
    });
  });

  describe("formatSolidityType", () => {
    it("formats basic types", () => {
      expect(formatSolidityType({ name: "", type: "uint256" })).toBe("uint256");
      expect(formatSolidityType({ name: "", type: "address" })).toBe("address");
    });

    it("formats arrays", () => {
      expect(formatSolidityType({ name: "", type: "uint256[]" })).toBe("uint256[]");
    });

    it("formats tuples", () => {
      expect(
        formatSolidityType({
          name: "",
          type: "tuple",
          components: [
            { name: "a", type: "uint256" },
            { name: "b", type: "address" },
          ],
        }),
      ).toBe("(uint256, address)");
    });
  });

  describe("SAMPLE_COUNTER_SOL", () => {
    it("is a valid Solidity contract string", () => {
      expect(SAMPLE_COUNTER_SOL).toContain("contract Counter");
      expect(SAMPLE_COUNTER_SOL).toContain("pragma solidity");
      expect(SAMPLE_COUNTER_SOL).toContain("function increment");
    });
  });
});
