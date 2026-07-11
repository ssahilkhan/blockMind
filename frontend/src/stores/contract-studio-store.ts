import { create } from "zustand";
import type { CompiledContract, DeployedContract } from "@/types/contract";

interface ContractStudioState {
  compiledContracts: CompiledContract[];
  deployedContracts: DeployedContract[];
  addCompiled: (contract: CompiledContract) => void;
  addDeployed: (contract: DeployedContract) => void;
}

export const useContractStudioStore = create<ContractStudioState>((set) => ({
  compiledContracts: [],
  deployedContracts: [],
  addCompiled: (contract) =>
    set((state) => ({
      compiledContracts: [contract, ...state.compiledContracts],
    })),
  addDeployed: (contract) =>
    set((state) => ({
      deployedContracts: [contract, ...state.deployedContracts],
    })),
}));
