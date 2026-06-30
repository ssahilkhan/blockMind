import { compilerService } from '../../contract/compiler/compiler.service';
import { deployerService } from '../../contract/deployer/deployer.service';
import { getChainService, initChainService } from '../../chain/services/chain.service';
import { HardhatProvider } from '../../chain/provider/hardhat.provider';
import { CacheService } from '../../chain/cache/cache.service';
import { tokenDetector } from '../detector/token.detector';
import { metadataService } from '../metadata/metadata.service';
import { transferService } from '../transfer/transfer.service';
import { approvalService } from '../approval/approval.service';
import { erc20Service } from '../standards/erc20/erc20.service';
import { erc721Service } from '../standards/erc721/erc721.service';
import { erc1155Service } from '../standards/erc1155/erc1155.service';
import { tokenService } from '../service/token.service';
import { TokenStandard } from '../types/token.types';

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

const ERC721_SOURCE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract TestERC721 {
    string public name; string public symbol;
    uint256 private _nextTokenId;
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    constructor(string memory _name, string memory _symbol) { name = _name; symbol = _symbol; }
    function balanceOf(address owner) public view returns (uint256) {
        require(owner != address(0), "Zero"); return _balances[owner];
    }
    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _owners[tokenId]; require(owner != address(0), "Not found"); return owner;
    }
    function safeMint(address to) public returns (uint256) {
        _nextTokenId++; uint256 tokenId = _nextTokenId;
        _owners[tokenId] = to; _balances[to]++;
        emit Transfer(address(0), to, tokenId); return tokenId;
    }
    function safeTransferFrom(address from, address to, uint256 tokenId) public {
        require(msg.sender == from || _tokenApprovals[tokenId] == msg.sender || _operatorApprovals[from][msg.sender], "!auth");
        _owners[tokenId] = to; _balances[from]--; _balances[to]++; delete _tokenApprovals[tokenId];
        emit Transfer(from, to, tokenId);
    }
    function approve(address approved, uint256 tokenId) public {
        address owner = _owners[tokenId];
        require(msg.sender == owner || _operatorApprovals[owner][msg.sender], "!auth");
        _tokenApprovals[tokenId] = approved; emit Approval(owner, approved, tokenId);
    }
    function setApprovalForAll(address operator, bool approved_) public {
        _operatorApprovals[msg.sender][operator] = approved_;
        emit ApprovalForAll(msg.sender, operator, approved_);
    }
    function getApproved(uint256 tokenId) public view returns (address) {
        require(_owners[tokenId] != address(0), "!exist"); return _tokenApprovals[tokenId];
    }
    function isApprovedForAll(address owner, address operator) public view returns (bool) {
        return _operatorApprovals[owner][operator];
    }
    function tokenURI(uint256 tokenId) public pure returns (string memory) {
        return string(abi.encodePacked("https://example.com/token/", toString(tokenId)));
    }
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0"; uint256 temp = value; uint256 digits;
        while (temp != 0) { digits++; temp /= 10; }
        bytes memory buffer = new bytes(digits);
        while (value != 0) { digits -= 1; buffer[digits] = bytes1(uint8(48 + uint256(value % 10))); value /= 10; }
        return string(buffer);
    }
}
`;

const ERC1155_SOURCE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract TestERC1155 {
    string public uri_;
    mapping(uint256 => mapping(address => uint256)) private _balances;
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);
    event ApprovalForAll(address indexed account, address indexed operator, bool approved);
    constructor(string memory _uri) { uri_ = _uri; }
    function balanceOf(address account, uint256 id) public view returns (uint256) {
        require(account != address(0), "Zero"); return _balances[id][account];
    }
    function mint(address to, uint256 id, uint256 amount) public {
        _balances[id][to] += amount; emit TransferSingle(msg.sender, address(0), to, id, amount);
    }
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public {
        require(to != address(0), "Zero");
        require(msg.sender == from || _operatorApprovals[from][msg.sender], "!auth");
        require(_balances[id][from] >= amount, "!balance");
        _balances[id][from] -= amount; _balances[id][to] += amount;
        emit TransferSingle(msg.sender, from, to, id, amount);
    }
    function setApprovalForAll(address operator, bool approved) public {
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }
    function isApprovedForAll(address account, address operator) public view returns (bool) {
        return _operatorApprovals[account][operator];
    }
}
`;

describeIf('Token Integration', () => {
  let erc20Address: string;
  let erc20ABI: unknown[];
  let erc721Address: string;
  let erc721ABI: unknown[];
  let erc1155Address: string;
  let erc1155ABI: unknown[];
  let mintedTokenId: string;

  beforeAll(async () => {
    const provider = new HardhatProvider(RPC_URL);
    await provider.connect();
    const cache = new CacheService();
    initChainService(provider, cache);
  });

  it('should compile and deploy ERC20', async () => {
    const compiled = compilerService.compile({ source: ERC20_SOURCE });
    expect(compiled.success).toBe(true);

    erc20ABI = compiled.result!.abi;
    const result = await deployerService.deploy({
      abi: erc20ABI,
      bytecode: compiled.result!.bytecode,
      constructorArgs: ['TestToken', 'TT', 18, '1000000000000000000000000'],
      privateKey: HARDHAT_ACCOUNT_PRIVATE_KEY,
    });
    expect(result.status).toBe('success');
    erc20Address = result.contractAddress;
  });

  it('should detect ERC20 standard', async () => {
    const detection = await tokenDetector.detectStandard(erc20Address);
    expect(detection.standard).toBe(TokenStandard.ERC20);
  });

  it('should get ERC20 metadata', async () => {
    const metadata = await metadataService.getMetadata(erc20Address);
    expect(metadata.name).toBe('TestToken');
    expect(metadata.symbol).toBe('TT');
    expect(metadata.decimals).toBe(18);
    expect(metadata.totalSupply).toBe('1000000000000000000000000');
    expect(metadata.standard).toBe(TokenStandard.ERC20);
  });

  it('should get ERC20 balance', async () => {
    const balance = await erc20Service.balanceOf(erc20Address, '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    expect(balance.balance).toBe('1000000000000000000000000');
  });

  it('should transfer ERC20 tokens', async () => {
    const result = await transferService.transfer({
      tokenAddress: erc20Address,
      fromPrivateKey: HARDHAT_ACCOUNT_PRIVATE_KEY,
      to: SECOND_ACCOUNT,
      amount: '1000',
      standard: TokenStandard.ERC20,
    });
    expect(result.transactionHash).toMatch(/^0x[0-9a-fA-F]{64}$/);

    await new Promise((r) => setTimeout(r, 500));

    const balFrom = await erc20Service.balanceOf(erc20Address, SECOND_ACCOUNT);
    expect(balFrom.balance).toBe('1000');
  });

  it('should approve ERC20 allowance and check it', async () => {
    const result = await approvalService.approve({
      tokenAddress: erc20Address,
      privateKey: HARDHAT_ACCOUNT_PRIVATE_KEY,
      spender: SECOND_ACCOUNT,
      amount: '5000',
      standard: TokenStandard.ERC20,
    });
    expect(result.transactionHash).toMatch(/^0x[0-9a-fA-F]{64}$/);

    await new Promise((r) => setTimeout(r, 500));

    const allowance = await approvalService.allowance({
      tokenAddress: erc20Address,
      owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      spender: SECOND_ACCOUNT,
      standard: TokenStandard.ERC20,
    });
    expect(allowance.allowance).toBe('5000');
  });

  it('should compile and deploy ERC721', async () => {
    const compiled = compilerService.compile({ source: ERC721_SOURCE });
    expect(compiled.success).toBe(true);

    erc721ABI = compiled.result!.abi;
    const result = await deployerService.deploy({
      abi: erc721ABI,
      bytecode: compiled.result!.bytecode,
      constructorArgs: ['MyNFT', 'NFT'],
      privateKey: HARDHAT_ACCOUNT_PRIVATE_KEY,
    });
    expect(result.status).toBe('success');
    erc721Address = result.contractAddress;
  });

  it('should detect ERC721 standard', async () => {
    const detection = await tokenDetector.detectStandard(erc721Address);
    expect(detection.standard).toBe(TokenStandard.ERC721);
  });

  it('should mint and get ownerOf', async () => {
    const { ethers } = await import('ethers');
    const { executorService } = await import('../../contract/executor/executor.service');

    const result = await executorService.execute({
      contractAddress: erc721Address,
      abi: erc721ABI,
      functionName: 'safeMint',
      args: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'],
      privateKey: HARDHAT_ACCOUNT_PRIVATE_KEY,
    });
    expect(result.transactionHash).toMatch(/^0x[0-9a-fA-F]{64}$/);

    await new Promise((r) => setTimeout(r, 500));

    const owner = await erc721Service.ownerOf(erc721Address, '1');
    expect(owner.toLowerCase()).toBe('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266');
    mintedTokenId = '1';
  });

  it('should get ERC721 tokenURI', async () => {
    const uri = await erc721Service.tokenURI(erc721Address, '1');
    expect(uri).toBe('https://example.com/token/1');
  });

  it('should get NFT metadata via service', async () => {
    const nftMeta = await tokenService.getNFTMetadata(erc721Address, '1');
    expect(nftMeta.owner).toBeDefined();
    expect(nftMeta.tokenURI).toBe('https://example.com/token/1');
    expect(nftMeta.tokenId).toBe('1');
  });

  it('should compile and deploy ERC1155', async () => {
    const compiled = compilerService.compile({ source: ERC1155_SOURCE });
    expect(compiled.success).toBe(true);

    erc1155ABI = compiled.result!.abi;
    const result = await deployerService.deploy({
      abi: erc1155ABI,
      bytecode: compiled.result!.bytecode,
      constructorArgs: ['https://example.com/{id}'],
      privateKey: HARDHAT_ACCOUNT_PRIVATE_KEY,
    });
    expect(result.status).toBe('success');
    erc1155Address = result.contractAddress;
  });

  it('should detect ERC1155 standard', async () => {
    const detection = await tokenDetector.detectStandard(erc1155Address);
    expect(detection.standard).toBe(TokenStandard.ERC1155);
  });

  it('should mint and get ERC1155 balance', async () => {
    const { executorService } = await import('../../contract/executor/executor.service');

    const result = await executorService.execute({
      contractAddress: erc1155Address,
      abi: erc1155ABI,
      functionName: 'mint',
      args: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 1, 100],
      privateKey: HARDHAT_ACCOUNT_PRIVATE_KEY,
    });
    expect(result.transactionHash).toMatch(/^0x[0-9a-fA-F]{64}$/);

    await new Promise((r) => setTimeout(r, 500));

    const balance = await erc1155Service.balanceOf(erc1155Address, '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '1');
    expect(balance.balance).toBe('100');
    expect(balance.tokenId).toBe('1');
  });

  it('should transfer ERC1155 tokens', async () => {
    const result = await transferService.transfer({
      tokenAddress: erc1155Address,
      fromPrivateKey: HARDHAT_ACCOUNT_PRIVATE_KEY,
      to: SECOND_ACCOUNT,
      tokenId: '1',
      amount: '30',
      standard: TokenStandard.ERC1155,
    });
    expect(result.transactionHash).toMatch(/^0x[0-9a-fA-F]{64}$/);

    await new Promise((r) => setTimeout(r, 500));

    const balance = await erc1155Service.balanceOf(erc1155Address, SECOND_ACCOUNT, '1');
    expect(balance.balance).toBe('30');
  });

  it('should set approval for all on ERC1155', async () => {
    const txHash = await approvalService.setApprovalForAll({
      tokenAddress: erc1155Address,
      privateKey: HARDHAT_ACCOUNT_PRIVATE_KEY,
      operator: SECOND_ACCOUNT,
      approved: true,
      standard: TokenStandard.ERC1155,
    });
    expect(txHash).toMatch(/^0x[0-9a-fA-F]{64}$/);

    await new Promise((r) => setTimeout(r, 500));

    const isApproved = await erc1155Service.isApprovedForAll(
      erc1155Address,
      '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      SECOND_ACCOUNT
    );
    expect(isApproved).toBe(true);
  });

  it('should use tokenService.detectStandard for all types', async () => {
    const erc20Detect = await tokenService.detectStandard(erc20Address);
    expect(erc20Detect.standard).toBe('ERC20');

    const erc721Detect = await tokenService.detectStandard(erc721Address);
    expect(erc721Detect.standard).toBe('ERC721');

    const erc1155Detect = await tokenService.detectStandard(erc1155Address);
    expect(erc1155Detect.standard).toBe('ERC1155');
  });

  it('should use tokenService.getBalance for all types', async () => {
    const erc20Bal = await tokenService.getBalance(erc20Address, '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    expect(erc20Bal.balances[0].balance).toBeDefined();

    const erc721Bal = await tokenService.getBalance(erc721Address, '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    expect(erc721Bal.balances[0].balance).toBe('1');

    const erc1155Bal = await tokenService.getBalance(erc1155Address, '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '1');
    expect(erc1155Bal.balances[0].balance).toBe('70');
  });

  it('should verify ERC20 total supply unchanged after transfers', async () => {
    const supply = await erc20Service.totalSupply(erc20Address);
    expect(supply).toBe('1000000000000000000000000');
  });

  it('should verify ERC721 balance matches after mint', async () => {
    const bal = await erc721Service.balanceOf(erc721Address, '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    expect(bal.balance).toBe('1');
  });
});
