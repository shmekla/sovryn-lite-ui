import { TOKEN } from 'types/token';
import { LoanTokenType } from 'types/loanToken';
import rbtcLoanAbi from 'utils/blockchain/abi/LoanTokenLogicWrbtc.json';
import loanAbi from 'utils/blockchain/abi/LoanTokenLogicStandard.json';

const testnet: LoanTokenType[] = [
  {
    token: TOKEN.RBTC,
    address: '0xe67Fe227e0504e8e96A34C3594795756dC26e14B',
    abi: rbtcLoanAbi,
    usesLm: true,
  },
  {
    token: TOKEN.XUSD,
    address: '0x9bD0cE087b14ef67C3D37C891139AaE7d94a961A',
    abi: loanAbi,
    usesLm: true,
  },
  {
    token: TOKEN.RUSDT,
    address: '0xd1f225BEAE98ccc51c468d1E92d0331c4f93e566',
    abi: loanAbi,
    usesLm: true,
  },
  {
    token: TOKEN.DOC,
    address: '0x74e00A8CeDdC752074aad367785bFae7034ed89f',
    abi: loanAbi,
    usesLm: true,
  },
  {
    token: TOKEN.BPRO,
    address: '0x6226b4B3F29Ecb5f9EEC3eC3391488173418dD5d',
    abi: loanAbi,
    usesLm: true,
  },
];

export default testnet;
