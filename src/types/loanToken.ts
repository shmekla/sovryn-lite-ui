import type { ethers } from 'ethers';
import type { TOKEN } from 'types/token';

export type LoanTokenType = {
  token: TOKEN;
  address: string;
  abi: ethers.ContractInterface;
  iTokenSymbol: string;
  usesLm?: boolean;
  collateralTokens: TOKEN[];
};
