import { NETWORK } from 'types/network';
import type { TokenType } from 'types/token';
import mainnet from './mainnet';
import testnet from './testnet';

const tokens: { [key: number]: TokenType[] } = {
  [NETWORK.RSK]: mainnet,
  [NETWORK.RSK_TESTNET]: testnet,
};

export default tokens;
