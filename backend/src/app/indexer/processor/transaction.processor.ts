import { getChainService } from '../../chain/services/chain.service';
import { IndexedTransaction, IndexedBlock } from '../types/indexer.types';
import { logger } from '../../logger';

function now(): string {
  return new Date().toISOString();
}

export const transactionProcessor = {
  async process(block: IndexedBlock): Promise<IndexedTransaction[]> {
    const chain = getChainService();
    const blockData = await chain.getBlockByNumber(block.blockNumber);
    if (!blockData || !blockData.transactions.length) return [];

    const txs: IndexedTransaction[] = [];
    for (const txHash of blockData.transactions) {
      const tx = await chain.getTransaction(txHash);
      if (!tx) continue;

      txs.push({
        hash: tx.hash,
        blockNumber: tx.blockNumber ?? block.blockNumber,
        blockHash: tx.blockHash ?? block.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        gasLimit: tx.gasLimit,
        gasPrice: tx.gasPrice,
        nonce: tx.nonce,
        indexedAt: now(),
      });
    }

    logger.info('Transactions processed', { blockNumber: block.blockNumber, count: txs.length });
    return txs;
  },
};
