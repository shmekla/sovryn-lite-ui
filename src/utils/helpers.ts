import type { ParamType } from '@ethersproject/abi/src.ts/fragments';
import type { BytesLike } from '@ethersproject/bytes';
import { bignumber } from 'mathjs';
import { isHexString, id as keccak256, defaultAbiCoder, hexConcat } from 'ethers/lib/utils';
import { TOKEN, TokenType } from 'types/token';
import { LoanTokenType } from 'types/loanToken';
import { getCurrentNetwork } from './network';
import tokens from '../config/tokens';
import loans from '../config/loans';

const INSIDE_EVERY_PARENTHESES = /\((?:[^()]|\([^()]*\))*\)/g;

export const functionSignature = (method: string) => keccak256(method).substr(0, 10);

export const encodeParameters = (types: ReadonlyArray<string | ParamType>, values: ReadonlyArray<any>) => defaultAbiCoder.encode(types, values);
export const decodeParameters = (types: ReadonlyArray<string | ParamType>, data: BytesLike) => defaultAbiCoder.decode(types, data, true);

export const encodeParameter = (type: string, value: any) => encodeParameters([type], [value]);
export const decodeParameter = (type: string, data: string) => decodeParameters([type], data);

const getParameters = (types: string[]) => {
  const hasTuple = types.indexOf('[]');
  if (hasTuple !== -1) {
    types[hasTuple - 1] = types[hasTuple-1] + '[]';
    delete types[hasTuple];
  }
  return types.filter(e => !!e);
};

export const prepareFunction = (method: string) => {
  const [input, output] = (method.match(INSIDE_EVERY_PARENTHESES) || []).map(item => item.slice(1, -1));
  const inputTypes = getParameters(input.match(/(\(.*?\)|[^),\s]+)/g) || []);
  const outputTypes = output ? getParameters(output.match(/(\(.*?\)|[^),\s]+)/g) || []) : [];
  return {
    method: method.split('(')[0] + '(' + input + ')',
    types: inputTypes,
    // args,
    returnTypes: outputTypes,
  };
};

export const encodeFunctionData = (method: string, values: ReadonlyArray<any>) => {
  const { method: fn, types } = prepareFunction(method);
  return hexConcat([functionSignature(fn), encodeParameters(types, values)]);
};

export const encodeFunctionDataWithTypes = (method: string, types: ReadonlyArray<string | ParamType>, values: ReadonlyArray<any>) => hexConcat([functionSignature(method), encodeParameters(types, values)]);

export const prefixHex = (value: string) => isHexString(value) ? value : `0x${value}`;

export const listTokens = () => tokens[getCurrentNetwork().id];

export const getToken = (token: TOKEN) => tokens[getCurrentNetwork().id]
  .find(item => item.id === token) as TokenType;

export const listLoanTokens = () => loans[getCurrentNetwork().id];

export const getLoanToken = (token: TOKEN) => loans[getCurrentNetwork().id]
  .find(item => item.token === token) as LoanTokenType;

export const weiToNumber = (value: number | string, decimals: number, weiDecimals: number = 18) => bignumber(value).div(10 ** weiDecimals).toFixed(decimals + 1).slice(0, -1);

export const toLocaleNumber = (value: number | string, decimals: number) => Number(value).toLocaleString(undefined, {
  minimumFractionDigits: decimals,
  maximumFractionDigits: decimals,
});

export const weiToLocaleNumber = (value: number | string, decimals: number) => toLocaleNumber(weiToNumber(value, decimals), decimals);

export const toWei = (value: number | string, decimals: number = 18) => bignumber(value).mul(10 ** decimals).toFixed(0);

export const noop = () => {
};

export const nFormatter = (value: number | string) => {
  value = Number(value);
  if (value >= 1000000) {
    return toLocaleNumber((value / 1000000).toFixed(1), 1) + 'M';
  }
  if (value >= 1000) {
    return toLocaleNumber((value / 1000).toFixed(1), 1) + 'K';
  }
  return toLocaleNumber(value, 1);
};


export const splitNoParen = (s: string) => {
  let left= 0, right= 0;
  let A: string[] = [];
  const M = s.match(/([^()]+)|([()])/g) || [];
  const L = M.length;
  let next;
  let str= '';
  for(let i = 0; i<L; i++){
    next= M[i];
    if(next=== '(')++left;
    else if(next=== ')')++right;
    if(left!== 0){
      str+= next;
      if(left=== right){
        A[A.length-1]+=str;
        left= right= 0;
        str= '';
      }
    }
    else {
      A = A.concat(next.match(/([^,]+)/g) || []);
    }
  }
  return A;
};
