import { ethers } from 'ethers';
import { compilerService } from '../../contract/compiler/compiler.service';
import { deployerService } from '../../contract/deployer/deployer.service';
import { getChainService, initChainService } from '../../chain/services/chain.service';
import { HardhatProvider } from '../../chain/provider/hardhat.provider';
import { CacheService } from '../../chain/cache/cache.service';
import { eventService } from '../../events/service/event.service';
import { IndexerService } from '../service/indexer.service';

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

const HARDHAT_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const ERC20_SOURCE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract TestERC20 {
    string public name; string public symbol; uint8 public decimals; uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _initialSupply) {
        name = _name; symbol = _symbol; decimals = _decimals; totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply;
        emit Transfer(address(0), msg.sender, _initialSupply);
    }
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount; balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount); return true;
    }
}
`;

describeIf('Indexer Integration Tests', () => {
  let indexer: IndexerService;
  let provider: ethers.JsonRpcProvider;

  beforeAll(async () => {
    const hhProvider = new HardhatProvider(RPC_URL);
    const cache = new CacheService();
    await hhProvider.connect();
    initChainService(hhProvider, cache);
    eventService.init();
    provider = new ethers.JsonRpcProvider(RPC_URL);

    const compiled = compilerService.compile({ source: ERC20_SOURCE });
    expect(compiled.success).toBe(true);

    const deployResult = await deployerService.deploy({
      abi: compiled.result!.abi,
      bytecode: compiled.result!.bytecode,
      constructorArgs: ['TestToken', 'TT', 18, 1000000n],
      privateKey: HARDHAT_KEY,
    });

    const wallet = new ethers.Wallet(HARDHAT_KEY, provider);
    const erc20 = new ethers.Contract(
      deployResult.contractAddress,
      ['function transfer(address to, uint256 amount) returns (bool)'],
      wallet
    );
    await (await erc20.transfer('0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 500)).wait();
  }, 60000);

  beforeEach(() => {
    indexer = new IndexerService();
  });

  it('should sync blocks up to the latest', async () => {
    const result = await indexer.syncOnce();
    expect(result.blocksIndexed).toBeGreaterThan(0);
    expect(result.transactionsIndexed).toBeGreaterThanOrEqual(0);
  }, 30000);

  it('should index transactions', async () => {
    await indexer.syncOnce();
    const txs = await indexer.getTransactions(50, 0);
    expect(txs.total).toBeGreaterThan(0);
    expect(txs.items[0].hash).toBeDefined();
  }, 30000);

  it('should index events from deployed contract', async () => {
    let events;
    let transferEvents;
    for (let i = 0; i < 10; i++) {
      await indexer.syncOnce();
      events = await indexer.getEvents(100, 0);
      transferEvents = events.items.filter((e) => e.eventName === 'Transfer');
      if (transferEvents.length > 0) break;
    }
    expect(transferEvents!.length).toBeGreaterThanOrEqual(1);
  }, 60000);

  it('should update checkpoint after sync', async () => {
    await indexer.syncOnce();
    const cp = await indexer.getCheckpoint();
    expect(cp).not.toBeNull();
    expect(cp!.blockNumber).toBeGreaterThan(0);
  }, 30000);

  it('should resume sync from checkpoint', async () => {
    await indexer.syncOnce();
    const cp1 = await indexer.getCheckpoint();
    const checkpointBlock = cp1!.blockNumber;

    await provider.send('evm_mine', []);
    const result = await indexer.syncOnce();
    const cp2 = await indexer.getCheckpoint();
    expect(result.blocksIndexed).toBeGreaterThan(0);
    expect(cp2!.blockNumber).toBeGreaterThan(checkpointBlock);
  }, 30000);

  it('should report correct status', async () => {
    const status = await indexer.getStatus();
    expect(status.running).toBe(false);
    expect(status.latestChainBlock).toBeGreaterThan(0);
    expect(status.latestIndexedBlock).toBeNull();
  }, 15000);

  it('should start and stop scheduler', async () => {
    expect(indexer.isRunning()).toBe(false);
    await indexer.start(10000);
    expect(indexer.isRunning()).toBe(true);
    indexer.stop();
    expect(indexer.isRunning()).toBe(false);
  }, 15000);

  it('should index token transfers', async () => {
    for (let i = 0; i < 10; i++) {
      await indexer.syncOnce();
      const transfers = await indexer.getStorage().getTokenTransfers({ limit: 100, offset: 0 });
      if (transfers.total > 0) {
        const erc20Transfer = transfers.items.find((t) => t.standard === 'ERC20');
        expect(erc20Transfer).toBeDefined();
        return;
      }
    }
    const transfers = await indexer.getStorage().getTokenTransfers({ limit: 100, offset: 0 });
    expect(transfers.total).toBeGreaterThan(0);
  }, 60000);
});
