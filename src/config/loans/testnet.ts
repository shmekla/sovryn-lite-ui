import { TOKEN } from 'types/token';
import { LoanTokenType } from 'types/loanToken';
import rbtcLoanAbi from 'utils/blockchain/abi/LoanTokenLogicWrbtc.json';
import loanAbi from 'utils/blockchain/abi/LoanTokenLogicStandard.json';

const testnet: LoanTokenType[] = [
  {
    token: TOKEN.RBTC,
    address: '0xe67Fe227e0504e8e96A34C3594795756dC26e14B'.toLowerCase(),
    abi: rbtcLoanAbi,
    iTokenSymbol: 'iRBTC',
    usesLm: false,
    collateralTokens: [TOKEN.XUSD, TOKEN.SOV, TOKEN.DOC, TOKEN.BPRO],
  },
  {
    token: TOKEN.XUSD,
    address: '0x9bD0cE087b14ef67C3D37C891139AaE7d94a961A'.toLowerCase(),
    abi: loanAbi,
    iTokenSymbol: 'iXUSD',
    usesLm: true,
    collateralTokens: [TOKEN.RBTC, TOKEN.SOV, TOKEN.DOC, TOKEN.BPRO],
  },
  {
    token: TOKEN.RUSDT,
    address: '0xd1f225BEAE98ccc51c468d1E92d0331c4f93e566'.toLowerCase(),
    abi: loanAbi,
    iTokenSymbol: 'iRUSDT',
    usesLm: false,
    collateralTokens: [],
  },
  {
    token: TOKEN.DOC,
    address: '0x74e00A8CeDdC752074aad367785bFae7034ed89f'.toLowerCase(),
    abi: loanAbi,
    iTokenSymbol: 'iSUSD',
    usesLm: false,
    collateralTokens: [TOKEN.RBTC, TOKEN.SOV, TOKEN.XUSD, TOKEN.BPRO],
  },
  {
    token: TOKEN.BPRO,
    address: '0x6226b4B3F29Ecb5f9EEC3eC3391488173418dD5d'.toLowerCase(),
    abi: loanAbi,
    iTokenSymbol: 'iBPRO',
    usesLm: false,
    collateralTokens: [TOKEN.RBTC, TOKEN.SOV, TOKEN.XUSD, TOKEN.DOC],
  },
];

export default testnet;
