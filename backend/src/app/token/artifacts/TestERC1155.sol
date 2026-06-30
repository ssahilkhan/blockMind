// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TestERC1155 {
    string public uri;
    mapping(uint256 => mapping(address => uint256)) private _balances;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);
    event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values);
    event ApprovalForAll(address indexed account, address indexed operator, bool approved);

    constructor(string memory _uri) {
        uri = _uri;
    }

    function balanceOf(address account, uint256 id) public view returns (uint256) {
        require(account != address(0), "Zero address");
        return _balances[id][account];
    }

    function mint(address to, uint256 id, uint256 amount) public {
        _balances[id][to] += amount;
        emit TransferSingle(msg.sender, address(0), to, id, amount);
    }

    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public {
        require(to != address(0), "Transfer to zero");
        address operator = msg.sender;
        require(operator == from || _operatorApprovals[from][operator], "Not approved");
        require(_balances[id][from] >= amount, "Insufficient balance");
        _balances[id][from] -= amount;
        _balances[id][to] += amount;
        emit TransferSingle(operator, from, to, id, amount);
    }

    function setApprovalForAll(address operator, bool approved) public {
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(address account, address operator) public view returns (bool) {
        return _operatorApprovals[account][operator];
    }
}
