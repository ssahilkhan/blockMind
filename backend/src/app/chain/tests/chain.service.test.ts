import { HardhatProvider } from '../provider/hardhat.provider';
import { CacheService } from '../cache/cache.service';
import { ChainService, initChainService } from '../services/chain.service';

const RPC_URL = 'http://localhost:8545';

function isHardhatRunning(): boolean {
  try {
    require('net').connect({ port: 8545, host: '127.0.0.1' }).destroy();
    return true;
  } catch {
    return false;
  }
}

const describeIf = isHardhatRunning() ? describe : describe.skip;

describeIf('ChainService Integration', () => {
  let chainService: ChainService;

  beforeAll(async () => {
    const provider = new HardhatProvider(RPC_URL);
    await provider.connect();
    const cache = new CacheService();
    chainService = initChainService(provider, cache);
  });

  describe('blocks', () => {
    it('should fetch the latest block', async () => {
      const block = await chainService.getLatestBlock();
      expect(block.number).toBeGreaterThanOrEqual(0);
      expect(block.hash).toMatch(/^0x[0-9a-fA-F]{64}$/);
      expect(block.timestamp).toBeDefined();
      expect(typeof block.gasUsedPercent).toBe('string');
    });

    it('should fetch genesis block by number', async () => {
      const block = await chainService.getBlockByNumber(0);
      expect(block).not.toBeNull();
      expect(block!.number).toBe(0);
      expect(block!.hash).toMatch(/^0x[0-9a-fA-F]{64}$/);
    });

    it('should return null for non-existent block', async () => {
      const block = await chainService.getBlockByNumber(999_999_999);
      expect(block).toBeNull();
    });
  });

  describe('network', () => {
    it('should return network info', async () => {
      const network = await chainService.getNetwork();
      expect(network.chainId).toBe(31337);
      expect(['hardhat', 'unknown']).toContain(network.name);
      expect(network.currency).toBe('ETH');
    });
  });

  describe('gas', () => {
    it('should return gas price', async () => {
      const gas = await chainService.getGasPrice();
      expect(gas.gasPrice).toMatch(/^\d+(\.\d+)? gwei$/);
    });
  });

  describe('stats', () => {
    it('should return chain stats', async () => {
      const stats = await chainService.getStats();
      expect(stats.latestBlock).toBeGreaterThanOrEqual(0);
      expect(stats.gasPrice).toBeDefined();
      expect(stats.chainId).toBe(31337);
      expect(['hardhat', 'unknown']).toContain(stats.network);
    });
  });

  describe('search', () => {
    it('should detect block number queries', async () => {
      const result = await chainService.search('0');
      expect(result.type).toBe('block');
    });

    it('should detect address queries', async () => {
      const result = await chainService.search(
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
      );
      expect(result.type).toBe('address');
    });

    it('should return unknown for garbage input', async () => {
      const result = await chainService.search('not-a-valid-query');
      expect(result.type).toBe('unknown');
    });
  });
});
