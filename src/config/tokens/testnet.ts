import { TOKEN, TokenType } from 'types/token';

const rskTestnetTokens: TokenType[] = [
  {
    id: TOKEN.RBTC,
    symbol: 'RBTC',
    name: 'RBTC',
    address: '0x69FE5cEC81D5eF92600c1A0dB1F11986AB3758Ab',
    decimals: 18,
    native: true,
  },
  {
    id: TOKEN.SOV,
    symbol: 'SOV',
    name: 'Sovryn',
    address: '0x6a9A07972D07e58F0daf5122d11E069288A375fb',
    decimals: 18,
    native: false,
  },
  {
    id: TOKEN.XUSD,
    symbol: 'XUSD',
    name: 'XUSD',
    address: '0x74858FE37d391f81F89472e1D8BC8Ef9CF67B3b1',
    decimals: 18,
    native: false,
  },
  {
    id: TOKEN.RUSDT,
    symbol: 'RUSDT',
    name: 'RUSDT',
    address: '0x4D5a316D23eBE168d8f887b4447bf8DbFA4901CC',
    decimals: 18,
    native: false,
  },
  {
    id: TOKEN.ETHS,
    symbol: 'ETHS',
    name: 'Ethereum',
    address: '0x0Fd0d8D78Ce9299Ee0e5676a8d51F938C234162c',
    decimals: 18,
    native: false,
  },
  {
    id: TOKEN.BNBS,
    symbol: 'BNBS',
    name: 'Binance Coin',
    address: '0x801F223Def9A4e3a543eAcCEFB79dCE981Fa2Fb5',
    decimals: 18,
    native: false,
  },
  {
    id: TOKEN.DOC,
    symbol: 'DOC',
    name: 'DOC',
    address: '0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0',
    decimals: 18,
    native: false,
  },
  {
    id: TOKEN.BPRO,
    symbol: 'BPRO',
    name: 'BPRO',
    address: '0x4dA7997A819bb46B6758b9102234c289Dd2ad3bf',
    decimals: 18,
    native: false,
  },
  {
    id: TOKEN.FISH,
    symbol: 'FISH',
    name: 'FISH',
    address: '0xaa7038D80521351F243168FefE0352194e3f83C3',
    decimals: 18,
    native: false,
  },
];

export default rskTestnetTokens;
