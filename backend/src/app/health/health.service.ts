import { Pool } from 'pg';
import { config } from '../config';
import { blockchainService } from '../blockchain/blockchain.service';
import { logger } from '../logger';

let pool: Pool | null = null;

function getPool(): Pool | null {
  if (!config.DATABASE_URL) {
    return null;
  }
  if (!pool) {
    pool = new Pool({ connectionString: config.DATABASE_URL });
  }
  return pool;
}

export const healthService = {
  async checkDatabase(): Promise<'connected' | 'disconnected' | 'skipped'> {
    const p = getPool();
    if (!p) {
      return 'skipped';
    }
    try {
      const client = await p.connect();
      await client.query('SELECT 1');
      client.release();
      return 'connected';
    } catch (err) {
      logger.error('Database health check failed', { error: (err as Error).message });
      return 'disconnected';
    }
  },

  async checkBlockchain(): Promise<'connected' | 'disconnected'> {
    try {
      const connected = await blockchainService.isConnected();
      return connected ? 'connected' : 'disconnected';
    } catch {
      return 'disconnected';
    }
  },

  async getFullStatus() {
    const [database, blockchain] = await Promise.all([
      this.checkDatabase(),
      this.checkBlockchain(),
    ]);

    const dbOk = database === 'connected' || database === 'skipped';
    const status = dbOk && blockchain === 'connected' ? 'healthy' : 'degraded';

    return {
      status,
      database,
      blockchain,
      rpc: config.RPC_URL,
      timestamp: new Date().toISOString(),
    };
  },
};
