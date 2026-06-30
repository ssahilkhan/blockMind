import { ethers } from 'ethers';
import { compilerService } from '../../contract/compiler/compiler.service';
import { deployerService } from '../../contract/deployer/deployer.service';
import { getChainService, initChainService } from '../../chain/services/chain.service';
import { HardhatProvider } from '../../chain/provider/hardhat.provider';
import { CacheService } from '../../chain/cache/cache.service';
import { eventService } from '../service/event.service';
import { eventListener } from '../listener/event.listener';

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

const HARDHAT_ACCOUNT_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const SECOND_ACCOUNT = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

const ERC20_SOURCE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract TestERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
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
    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount); return true;
    }
}
`;

describeIf('Event Integration Tests', () => {
  let erc20Address: string;
  let provider: HardhatProvider;
  let rawProvider: ethers.JsonRpcProvider;

  beforeAll(async () => {
    provider = new HardhatProvider(RPC_URL);
    const cache = new CacheService();
    await provider.connect();
    initChainService(provider, cache);
    eventService.init();
    const chain = getChainService();

    const compiled = compilerService.compile({ source: ERC20_SOURCE });
    expect(compiled.success).toBe(true);

    const deployResult = await deployerService.deploy({
      abi: compiled.result!.abi,
      bytecode: compiled.result!.bytecode,
      constructorArgs: ['TestToken', 'TT', 18, 1000000n],
      privateKey: HARDHAT_ACCOUNT_PRIVATE_KEY,
    });
    erc20Address = deployResult.contractAddress;

    rawProvider = new ethers.JsonRpcProvider(RPC_URL);
  }, 30000);

  afterAll(async () => {
    rawProvider.destroy();
    await provider.disconnect();
  });

  it('should register and decode events from a receipt', async () => {
    const chain = getChainService();

    const wallet = new ethers.Wallet(
      HARDHAT_ACCOUNT_PRIVATE_KEY,
      new ethers.JsonRpcProvider(RPC_URL)
    );

    const erc20 = new ethers.Contract(erc20Address, [
      'function transfer(address to, uint256 amount) returns (bool)',
    ], wallet);

    const tx = await erc20.transfer(SECOND_ACCOUNT, 500);
    const receipt = await tx.wait();

    const result = await eventService.getEventsFromReceipt(receipt.hash);
    expect(result.total).toBeGreaterThanOrEqual(1);

    const transferEvent = result.events.find((e) => e.eventName === 'Transfer');
    expect(transferEvent).toBeDefined();
    expect(transferEvent!.contract.toLowerCase()).toBe(erc20Address.toLowerCase());
    expect(transferEvent!.from).toBeDefined();
  }, 15000);

  it('should get registry info', async () => {
    const registry = eventService.getRegistry();
    expect(registry.standards).toEqual(expect.arrayContaining(['ERC20', 'ERC721', 'ERC1155']));
    expect(registry.events.length).toBeGreaterThan(0);
  }, 10000);

  it('should scan block for events', async () => {
    const chain = getChainService();
    const latest = await chain.getLatestBlock();

    const result = await eventListener.getEventsByBlock(latest.number);
    expect(result.total).toBeGreaterThanOrEqual(1);
    expect(result.events[0].blockNumber).toBe(latest.number);
  }, 15000);

  it('should filter events by contract address via search', async () => {
    const result = await eventService.searchEvents({ contract: erc20Address });
    expect(result.total).toBeGreaterThanOrEqual(1);
    const allMatch = result.events.every(
      (e) => e.contract.toLowerCase() === erc20Address.toLowerCase()
    );
    expect(allMatch).toBe(true);
  }, 15000);

  it('should filter events by event name', async () => {
    const result = await eventService.searchEvents({ eventName: 'Transfer' });
    expect(result.total).toBeGreaterThanOrEqual(1);
    const allMatch = result.events.every((e) => e.eventName === 'Transfer');
    expect(allMatch).toBe(true);
  }, 15000);

  it('should filter events by wallet address', async () => {
    const wallet = ethers.Wallet.createRandom().address;

    const result = await eventService.searchEvents({ wallet });
    expect(result).toBeDefined();
  }, 10000);
});
