import { LoanTokenType } from 'types/loanToken';
import { NETWORK } from 'types/network';
import mainnet from './mainnet';
import testnet from './testnet';

const loans: {[key: number]: LoanTokenType[]} = {
  [NETWORK.RSK]: mainnet,
  [NETWORK.RSK_TESTNET]: testnet,
};

export default loans;
