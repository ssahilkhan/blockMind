import { Synchronizer } from '../synchronizer/synchronizer.service';
import { DEFAULT_POLL_INTERVAL_MS } from '../constants/indexer.constants';
import { logger } from '../../logger';

export class Scheduler {
  private timer: ReturnType<typeof setInterval> | null = null;
  private running = false;
  private startedAt: string | null = null;

  constructor(
    private synchronizer: Synchronizer,
    private pollIntervalMs: number = DEFAULT_POLL_INTERVAL_MS
  ) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.startedAt = new Date().toISOString();
    logger.info('Indexer scheduler started', { pollIntervalMs: this.pollIntervalMs });

    this.timer = setInterval(async () => {
      try {
        await this.synchronizer.syncOnce();
      } catch (err) {
        logger.error('Scheduler sync error', { error: (err as Error).message });
      }
    }, this.pollIntervalMs);
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    logger.info('Indexer scheduler stopped');
  }

  isRunning(): boolean {
    return this.running;
  }

  getStartedAt(): string | null {
    return this.startedAt;
  }
}
