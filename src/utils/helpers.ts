import { bignumber } from 'mathjs';
import { isHexString } from 'ethers/lib/utils';
import { TOKEN, TokenType } from 'types/token';
import { LoanTokenType } from 'types/loanToken';
import { getCurrentNetwork } from './network';
import tokens from '../config/tokens';
import loans from '../config/loans';

export const prefixHex = (value: string) => isHexString(value) ? value : `0x${value}`;

export const listTokens = () => tokens[getCurrentNetwork().id];

export const getToken = (token: TOKEN) => tokens[getCurrentNetwork().id]
  .find(item => item.id === token) as TokenType;

export const listLoanTokens = () => loans[getCurrentNetwork().id];

export const getLoanToken = (token: TOKEN) => loans[getCurrentNetwork().id]
  .find(item => item.token === token) as LoanTokenType;

export const toNumber = (value: string, decimals: number) => bignumber(value).div(10 ** 18).toFixed(decimals);

export const toWei = (value: number, decimals: number = 18) => bignumber(value).mul(10 ** decimals).toFixed(0);
