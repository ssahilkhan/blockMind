export const SOLIDITY_VERSION = '0.8.28';

export const DEFAULT_GAS_LIMIT = '3000000';

export const SUPPORTED_EVENT_SIGNATURES = [
  'Transfer(address indexed from, address indexed to, uint256 value)',
  'Approval(address indexed owner, address indexed spender, uint256 value)',
  'OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
];
