import { TOKEN } from 'types/token';
import liquidityMiningAbi from 'utils/blockchain/abi/LiquidityMining.json';
import contractReader from '../contractReader';
import { getLoanToken } from '../helpers';
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
  totalAssetSupply: string;
  profitOf: string;
  balanceOf: string;
  assetBalanceOf: string;
  getUserAccumulatedReward: string;
  getUserInfo: UserInfo;
  getUserInfoList: UserInfo[];
};

const liquidityMining = new class LiquidityMining {

  public getLendingInfo(token: TOKEN, owner?: string) {
    const { address, abi } = getLoanToken(token);
    const { liquidityMiningProxy } = getCurrentNetwork();
    if (!owner) {
      owner = zeroAddress;
    }
    return contractReader.multiCall<LendingInfoResponse>([
      {
        address,
        abi,
        fnName: 'marketLiquidity',
        args: [],
        key: 'marketLiquidity',
        parser: (value) => value[0].toString(),
      },
      {
        address,
        abi,
        fnName: 'tokenPrice',
        args: [],
        key: 'tokenPrice',
        parser: (value) => value[0].toString(),
      },
      {
        address,
        abi,
        fnName: 'supplyInterestRate',
        args: [],
        key: 'supplyInterestRate',
        parser: (value) => value[0].toString(),
      },
      {
        address,
        abi,
        fnName: 'totalAssetSupply',
        args: [],
        key: 'totalAssetSupply',
        parser: (value) => value[0].toString(),
      },
      {
        address,
        abi,
        fnName: 'balanceOf',
        args: [owner],
        key: 'balanceOf',
        parser: (value) => value[0].toString(),
      },
      {
        address,
        abi,
        fnName: 'assetBalanceOf',
        args: [owner],
        key: 'assetBalanceOf',
        parser: (value) => value[0].toString(),
      },
      {
        address,
        abi,
        fnName: 'profitOf',
        args: [owner],
        key: 'profitOf',
        parser: (value) => value[0].toString(),
      },
      {
        address: liquidityMiningProxy,
        abi: liquidityMiningAbi,
        fnName: 'getPoolId',
        args: [address],
        key: 'getPoolId',
        parser: (value) => value[0].toString(),
      },
      {
        address: liquidityMiningProxy,
        abi: liquidityMiningAbi,
        fnName: 'getUserAccumulatedReward',
        args: [address, owner],
        key: 'getUserAccumulatedReward',
        parser: (value) => value[0].toString(),
      },
      {
        address: liquidityMiningProxy,
        abi: liquidityMiningAbi,
        fnName: 'getPoolInfo',
        args: [address],
        key: 'getPoolInfo',
        // parser: (value) => value[0].toString(),
      },
      {
        address: liquidityMiningProxy,
        abi: liquidityMiningAbi,
        fnName: 'getUserInfo',
        args: [address, owner],
        key: 'getUserInfo',
        parser: (value) => ({
          accumulatedReward: value[0].accumulatedReward.toString(),
          amount: value[0].amount.toString(),
          rewardDebt: value[0].rewardDebt.toString(),
        }),
      },
      {
        address: liquidityMiningProxy,
        abi: liquidityMiningAbi,
        fnName: 'getUserInfoList',
        args: [address],
        key: 'getUserInfoList',
        parser: (value) => value[0].map((item: any) => ({
          accumulatedReward: item.accumulatedReward.toString(),
          amount: item.amount.toString(),
          rewardDebt: item.rewardDebt.toString(),
        })),
      },
      {
        address,
        abi,
        fnName: 'tokenPrice',
        args: [],
        key: 'tokenPrice',
        parser: (value) => value[0].toString(),
      },
    ]).then(({ returnData }) => returnData);
  }

  public lend(pool: TOKEN, amount: string) {
  }


  // public call<T = string>(token: TOKEN, fnName: string, args: any[]) {
  //   const { address, abi } = getLoanToken(token);
  //   return contractReader.call<T>(address, abi, fnName, args);
  // }
  //
  // public encodeFunctionData(token: TOKEN, fnName: string, args: any[]) {
  //   const { address, abi } = getLoanToken(token);
  //   return contractReader.encodeFunctionData(address, abi, fnName, args);
  // }
  //
  // public decodeFunctionResult(token: TOKEN, fnName: string, data: ethers.utils.BytesLike) {
  //   const { address, abi } = getLoanToken(token);
  //   return contractReader.decodeFunctionResult(address, abi, fnName, data);
  // }

}();

export default liquidityMining;
