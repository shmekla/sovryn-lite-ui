import { TOKEN, TokenType } from 'types/token';

const rskTokens: TokenType[] = [
  {
    id: TOKEN.RBTC,
    symbol: 'RBTC',
    name: 'RBTC',
    address: '0x542fDA317318eBF1d3DEAf76E0b632741A7e677d',
    decimals: 18,
    native: true,
  },
  {
    id: TOKEN.SOV,
    symbol: 'SOV',
    name: 'Sovryn',
    address: '0xEFc78fc7d48b64958315949279Ba181c2114ABBd',
    decimals: 18,
    native: false,
  },
  {
    id: TOKEN.XUSD,
    symbol: 'XUSD',
    name: 'XUSD',
    address: '0xb5999795BE0EbB5bAb23144AA5FD6A02D080299F',
    decimals: 18,
    native: false,
  },
  {
    id: TOKEN.RUSDT,
    symbol: 'RUSDT',
    name: 'RUSDT',
    address: '0xEf213441a85DF4d7acBdAe0Cf78004E1e486BB96',
    decimals: 18,
    native: false,
  },
  {
    id: TOKEN.ETHS,
    symbol: 'ETHS',
    name: 'Ethereum',
    address: '0x1D931Bf8656d795E50eF6D639562C5bD8Ac2B78f',
    decimals: 18,
    native: false,
  },
  {
    id: TOKEN.BNBS,
    symbol: 'BNBS',
    name: 'Binance Coin',
    address: '0x6D9659bdF5b1A1dA217f7BbAf7dBAF8190E2e71B',
    decimals: 18,
    native: false,
  },
  {
    id: TOKEN.DOC,
    symbol: 'DOC',
    name: 'DOC',
    address: '0xe700691da7b9851f2f35f8b8182c69c53ccad9db',
    decimals: 18,
    native: false,
  },
  {
    id: TOKEN.BPRO,
    symbol: 'BPRO',
    name: 'BPRO',
    address: '0x440cd83c160de5c96ddb20246815ea44c7abbca8',
    decimals: 18,
    native: false,
  },
  {
    id: TOKEN.FISH,
    symbol: 'FISH',
    name: 'FISH',
    address: '0x055A902303746382FBB7D18f6aE0df56eFDc5213',
    decimals: 18,
    native: false,
  },
];

export default rskTokens;
