import { Router } from 'express';
import {
  createWallet,
  importFromPrivateKey,
  importFromMnemonic,
  getWalletDetails,
  getBalance,
  validateAddressHandler,
  signMessage,
  verifySignature,
} from './wallet.controller';

export const walletRouter = Router();

walletRouter.post('/create', createWallet);
walletRouter.post('/import', importFromPrivateKey);
walletRouter.post('/import-mnemonic', importFromMnemonic);
walletRouter.get('/validate/:address', validateAddressHandler);
walletRouter.get('/:address', getWalletDetails);
walletRouter.get('/:address/balance', getBalance);
walletRouter.post('/sign', signMessage);
walletRouter.post('/verify', verifySignature);
