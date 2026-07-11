import { create } from "zustand";

export interface SessionTransaction {
  hash: string;
  to: string;
  value: string;
  status: "pending" | "confirmed" | "failed";
  timestamp: number;
}

interface TxStudioState {
  sessionTxs: SessionTransaction[];
  addTx: (tx: SessionTransaction) => void;
  updateTxStatus: (hash: string, status: SessionTransaction["status"]) => void;
}

export const useTxStudioStore = create<TxStudioState>((set) => ({
  sessionTxs: [],
  addTx: (tx) => set((state) => ({ sessionTxs: [tx, ...state.sessionTxs] })),
  updateTxStatus: (hash, status) =>
    set((state) => ({
      sessionTxs: state.sessionTxs.map((tx) =>
        tx.hash === hash ? { ...tx, status } : tx,
      ),
    })),
}));
