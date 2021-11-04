export enum TOKEN {
  RBTC = 'rbtc',
  SOV = 'sov',
  XUSD = 'xusd',
  RUSDT = 'rusdt',
  DOC = 'doc',
  BNBS = 'bnbs',
  ETHS = 'eths',
  BPRO = 'bpro',
  FISH = 'fish',
}

export type TokenType = {
  id: TOKEN;
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  native: boolean;
};
