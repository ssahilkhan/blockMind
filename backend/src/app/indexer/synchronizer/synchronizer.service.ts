import { IStorage } from '../storage/storage.interface';
import { CheckpointManager } from '../checkpoint/checkpoint.manager';
import { blockScanner } from '../scanner/block.scanner';
import { transactionProcessor } from '../processor/transaction.processor';
import { eventProcessor } from '../processor/event.processor';
import { tokenProcessor } from '../processor/token.processor';
import { SyncResult } from '../types/indexer.types';
import { getChainService } from '../../chain/services/chain.service';
import { MAX_BLOCK_RANGE } from '../constants/indexer.constants';
import { logger } from '../../logger';

export class Synchronizer {
  constructor(
    private storage: IStorage,
    private checkpointManager: CheckpointManager
  ) {}

  async syncOnce(): Promise<SyncResult> {
    const chain = getChainService();
    const latestBlock = await chain.getLatestBlock();
    const nextBlock = await this.checkpointManager.getNextBlockToIndex();
    const toBlock = latestBlock.number;

    if (nextBlock > toBlock) {
      return {
        blocksIndexed: 0,
        transactionsIndexed: 0,
        eventsIndexed: 0,
        tokenTransfersIndexed: 0,
        fromBlock: nextBlock,
        toBlock,
      };
    }

    const actualFrom = Math.min(nextBlock, toBlock);
    const actualTo = Math.min(actualFrom + MAX_BLOCK_RANGE - 1, toBlock);

    logger.info('Sync started', { from: actualFrom, to: actualTo });

    let totalTx = 0;
    let totalEvents = 0;
    let totalTransfers = 0;
    let totalBlocks = 0;

    for (let i = actualFrom; i <= actualTo; i++) {
      const indexedBlock = await blockScanner.scanBlock(i);
      if (!indexedBlock) continue;

      await this.storage.saveBlock(indexedBlock);
      totalBlocks++;

      const txs = await transactionProcessor.process(indexedBlock);
      if (txs.length) {
        await this.storage.saveTransactions(txs);
        totalTx += txs.length;
      }

      const events = await eventProcessor.process(indexedBlock);
      if (events.length) {
        await this.storage.saveEvents(events);
        totalEvents += events.length;
      }

      const transfers = tokenProcessor.process(events);
      if (transfers.length) {
        await this.storage.saveTokenTransfers(transfers);
        totalTransfers += transfers.length;
      }

      await this.checkpointManager.update(i, indexedBlock.hash);
    }

    logger.info('Sync completed', {
      blocks: totalBlocks,
      transactions: totalTx,
      events: totalEvents,
      transfers: totalTransfers,
      range: `${actualFrom}-${actualTo}`,
    });

    return {
      blocksIndexed: totalBlocks,
      transactionsIndexed: totalTx,
      eventsIndexed: totalEvents,
      tokenTransfersIndexed: totalTransfers,
      fromBlock: actualFrom,
      toBlock: actualTo,
    };
  }
}
