import { TOKEN } from 'types/token';
import { LoanTokenType } from 'types/loanToken';
import rbtcLoanAbi from 'utils/blockchain/abi/LoanTokenLogicWrbtc.json';
import loanAbi from 'utils/blockchain/abi/LoanTokenLogicStandard.json';

const mainnet: LoanTokenType[] = [
  {
    token: TOKEN.RBTC,
    address: '0xa9DcDC63eaBb8a2b6f39D7fF9429d88340044a7A',
    abi: rbtcLoanAbi,
    iTokenSymbol: 'iRBTC',
    usesLm: true,
  },
  {
    token: TOKEN.XUSD,
    address: '0x8F77ecf69711a4b346f23109c40416BE3dC7f129',
    abi: loanAbi,
    iTokenSymbol: 'iXUSD',
    usesLm: true,
  },
];

export default mainnet;
