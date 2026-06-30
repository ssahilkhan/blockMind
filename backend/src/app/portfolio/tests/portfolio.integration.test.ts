import { ethers } from 'ethers';
import { compilerService } from '../../contract/compiler/compiler.service';
import { deployerService } from '../../contract/deployer/deployer.service';
import { getChainService, initChainService } from '../../chain/services/chain.service';
import { HardhatProvider } from '../../chain/provider/hardhat.provider';
import { CacheService } from '../../chain/cache/cache.service';
import { eventService } from '../../events/service/event.service';
import { portfolioService } from '../service/portfolio.service';
import { assetAggregator } from '../assets/asset.aggregator';
import { nftService } from '../nft/nft.service';
import { historyService } from '../history/history.service';
import { summaryService } from '../summary/summary.service';

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

const HARDHAT_ACCOUNT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const HARDHAT_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const SECOND_ACCOUNT = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

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

describeIf('Portfolio Integration Tests', () => {
  let erc20Address: string;
  let provider: HardhatProvider;
  let rawProvider: ethers.JsonRpcProvider;

  beforeAll(async () => {
    provider = new HardhatProvider(RPC_URL);
    const cache = new CacheService();
    await provider.connect();
    initChainService(provider, cache);
    eventService.init();

    const compiled = compilerService.compile({ source: ERC20_SOURCE });
    expect(compiled.success).toBe(true);

    const deployResult = await deployerService.deploy({
      abi: compiled.result!.abi,
      bytecode: compiled.result!.bytecode,
      constructorArgs: ['TestToken', 'TT', 18, 1000000n],
      privateKey: HARDHAT_KEY,
    });
    erc20Address = deployResult.contractAddress;

    rawProvider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(HARDHAT_KEY, rawProvider);
    const erc20 = new ethers.Contract(erc20Address, ['function transfer(address to, uint256 amount) returns (bool)'], wallet);
    await (await erc20.transfer(SECOND_ACCOUNT, 500)).wait();
  }, 30000);

  afterAll(async () => {
    rawProvider.destroy();
    await provider.disconnect();
  });

  it('should get native ETH balance', async () => {
    const assets = await assetAggregator.aggregate(HARDHAT_ACCOUNT);
    const native = assets.find((a) => a.type === 'native');
    expect(native).toBeDefined();
    expect(native!.balance).toBeDefined();
    expect(Number(native!.balance)).toBeGreaterThan(0);
  });

  it('should detect ERC20 token', async () => {
    const assets = await assetAggregator.aggregate(HARDHAT_ACCOUNT);
    const erc20 = assets.find((a) => a.type === 'ERC20');
    expect(erc20).toBeDefined();
    expect(erc20!.symbol).toBe('TT');
    expect(Number(erc20!.balance)).toBeGreaterThan(0);
  });

  it('should get full portfolio', async () => {
    const portfolio = await portfolioService.getPortfolio(HARDHAT_ACCOUNT);
    expect(portfolio.wallet.toLowerCase()).toBe(HARDHAT_ACCOUNT.toLowerCase());
    expect(portfolio.assets.length).toBeGreaterThanOrEqual(2);
    expect(portfolio.summary.totalAssets).toBeGreaterThanOrEqual(2);
    expect(portfolio.summary.ethBalance).toBeDefined();
  });

  it('should get portfolio assets', async () => {
    const result = await portfolioService.getAssets(HARDHAT_ACCOUNT);
    expect(result.assets.length).toBeGreaterThanOrEqual(1);
  });

  it('should get portfolio balances', async () => {
    const result = await portfolioService.getBalances(HARDHAT_ACCOUNT);
    expect(result.balances.length).toBeGreaterThanOrEqual(1);
    expect(result.balances[0].type).toBe('native');
  });

  it('should get wallet history', async () => {
    const result = await portfolioService.getHistory(HARDHAT_ACCOUNT);
    expect(result.history.length).toBeGreaterThanOrEqual(1);
    const hasTransfer = result.history.some((h) => h.eventName === 'Transfer');
    expect(hasTransfer).toBe(true);
  });

  it('should get portfolio summary', async () => {
    const result = await portfolioService.getSummary(HARDHAT_ACCOUNT);
    const summary = result.summary;
    expect(summary.totalAssets).toBeGreaterThanOrEqual(1);
    expect(summary.ethBalance).toBeDefined();
  });

  it('should detect that original wallet still has ERC20 balance after transfer', async () => {
    const assets = await assetAggregator.aggregate(HARDHAT_ACCOUNT);
    const erc20 = assets.find((a) => a.type === 'ERC20');
    expect(erc20).toBeDefined();
    expect(Number(erc20!.balance)).toBeGreaterThan(0);
  });
});
