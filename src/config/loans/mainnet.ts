import { TOKEN } from 'types/token';
import { LoanTokenType } from 'types/loanToken';
import rbtcLoanAbi from 'utils/blockchain/abi/LoanTokenLogicWrbtc.json';
import loanAbi from 'utils/blockchain/abi/LoanTokenLogicStandard.json';

const mainnet: LoanTokenType[] = [
  {
    token: TOKEN.RBTC,
    address: '0xa9DcDC63eaBb8a2b6f39D7fF9429d88340044a7A'.toLowerCase(),
    abi: rbtcLoanAbi,
    iTokenSymbol: 'iRBTC',
    usesLm: false,
    collateralTokens: [TOKEN.XUSD, TOKEN.SOV, TOKEN.DOC, TOKEN.BPRO],
  },
  {
    token: TOKEN.XUSD,
    address: '0x8F77ecf69711a4b346f23109c40416BE3dC7f129'.toLowerCase(),
    abi: loanAbi,
    iTokenSymbol: 'iXUSD',
    usesLm: true,
    collateralTokens: [TOKEN.RBTC, TOKEN.SOV, TOKEN.DOC, TOKEN.BPRO],
  },
  {
    token: TOKEN.RUSDT,
    address: '0x849C47f9C259E9D62F289BF1b2729039698D8387'.toLowerCase(),
    abi: loanAbi,
    iTokenSymbol: 'iRUSDT',
    usesLm: false,
    collateralTokens: [],
  },
  {
    token: TOKEN.DOC,
    address: '0xd8D25f03EBbA94E15Df2eD4d6D38276B595593c1'.toLowerCase(),
    abi: loanAbi,
    iTokenSymbol: 'iSUSD',
    usesLm: false,
    collateralTokens: [TOKEN.RBTC, TOKEN.SOV, TOKEN.XUSD, TOKEN.BPRO],
  },
  {
    token: TOKEN.BPRO,
    address: '0x6E2fb26a60dA535732F8149b25018C9c0823a715'.toLowerCase(),
    abi: loanAbi,
    iTokenSymbol: 'iBPRO',
    usesLm: false,
    collateralTokens: [TOKEN.RBTC, TOKEN.SOV, TOKEN.XUSD, TOKEN.DOC],
  },
];

export default mainnet;
