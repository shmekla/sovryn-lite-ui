import { TOKEN } from 'types/token';
import contractReader, { MultiCallData } from '../contractReader';
import { getLoanToken, getToken } from '../helpers';
import { zeroAddress } from '../constants';
import { getCurrentNetwork } from '../network';

type UserInfo = {
  amount: string;
  accumulatedReward: string;
  rewardDebt: string;
};

export type LendingInfoResponse = {
  marketLiquidity: string;
  supplyInterestRate: string;
  tokenPrice: string;
  totalSupply: string;
  totalAssetSupply: string;
  profitOf: string;
  balanceOf: string;
  assetBalanceOf: string;
  getUserAccumulatedReward: string;
  getUserPoolTokenBalance: string;
  getUserInfo: UserInfo;
  allowance: string;
  tokenBalanceOf: string;
};

const liquidityMining = new class LiquidityMining {

  public getLendingInfo(token: TOKEN, owner?: string) {
    const { address, usesLm } = getLoanToken(token);
    const { address: tokenAddress } = getToken(token);

    let ownedItems: MultiCallData[] = [];
    if (owner) {
      ownedItems = [
        {
          address: tokenAddress,
          fnName: 'balanceOf(address)(uint256)',
          args: [owner],
          key: 'tokenBalanceOf',
          parser: (value) => value[0].toString(),
        },
        {
          address: tokenAddress,
          fnName: 'allowance(address,address)(uint256)',
          args: [owner, address],
          key: 'allowance',
          parser: (value) => value[0].toString(),
        },
        {
          address,
          fnName: 'balanceOf(address)(uint256)',
          args: [owner],
          key: 'balanceOf',
          parser: (value) => value[0].toString(),
        },
        {
          address,
          fnName: 'assetBalanceOf(address)(uint256)',
          args: [owner],
          key: 'assetBalanceOf',
          parser: (value) => value[0].toString(),
        },
        {
          address,
          fnName: 'profitOf(address)(uint256)',
          args: [owner],
          key: 'profitOf',
          parser: (value) => value[0].toString(),
        },
      ];
    }

    if (!owner) {
      owner = zeroAddress;
    }

    let liquidityItems: MultiCallData[] = [];
    if (usesLm) {
      const { liquidityMiningProxy } = getCurrentNetwork();
      liquidityItems = [
        {
          address: liquidityMiningProxy,
          fnName: 'getUserAccumulatedReward(address,address)(uint256)',
          args: [address, owner],
          key: 'getUserAccumulatedReward',
          parser: (value) => value[0].toString(),
        },
        {
          address: liquidityMiningProxy,
          fnName: 'getPoolInfo(address)((address,uint96,uint256,uint256))',
          args: [address],
          key: 'getPoolInfo',
          parser: (value) => ({
            poolToken: value[0][0],
            allocationPoint: value[0][1].toString(),
            lastRewardBlock: value[0][2].toString(),
            accumulatedRewardPerShare: value[0][3].toString(),
          }),
        },
        {
          address: liquidityMiningProxy,
          fnName: 'getUserInfo(address,address)(uint256,uint256,uint256)',
          args: [address, owner],
          key: 'getUserInfo',
          parser: value => ({
            amount: value[0].toString(),
            rewardDebt: value[1].toString(),
            accumulatedReward: value[2].toString(),
          })
        },
        {
          address: liquidityMiningProxy,
          fnName: 'getUserPoolTokenBalance(address,address)(uint256)',
          args: [address, owner],
          key: 'getUserPoolTokenBalance',
          parser: (value) => value[0].toString(),
        }
      ];
    }

    return contractReader.multiCall<LendingInfoResponse>([
      {
        address,
        fnName: 'marketLiquidity()(uint256)',
        args: [],
        key: 'marketLiquidity',
        parser: (value) => value[0].toString(),
      },
      {
        address,
        fnName: 'tokenPrice()(uint256)',
        args: [],
        key: 'tokenPrice',
        parser: (value) => value[0].toString(),
      },
      {
        address,
        fnName: 'supplyInterestRate()(uint256)',
        args: [],
        key: 'supplyInterestRate',
        parser: (value) => value[0].toString(),
      },
      {
        address,
        fnName: 'totalSupply()(uint256)',
        args: [],
        key: 'totalSupply',
        parser: (value) => value[0].toString(),
      },
      {
        address,
        fnName: 'totalAssetSupply()(uint256)',
        args: [],
        key: 'totalAssetSupply',
        parser: (value) => value[0].toString(),
      },
      {
        address,
        fnName: 'tokenPrice()(uint256)',
        args: [],
        key: 'tokenPrice',
        parser: (value) => value[0].toString(),
      },
      ...liquidityItems,
      ...ownedItems,
    ]).then(({ returnData }) => returnData);
  }

}();

export default liquidityMining;
