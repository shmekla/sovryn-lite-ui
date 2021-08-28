import { TOKEN } from 'types/token';
import contractReader from '../contractReader';
import { encodeFunctionData, getLoanToken } from '../helpers';
import { zeroAddress } from '../constants';
import walletService from '../walletService';

const loanToken = new class LoanToken {

  public getLendingInfo(token: TOKEN, owner?: string) {
    const { address } = getLoanToken(token);
    if (!owner) {
      owner = zeroAddress;
    }
    return contractReader.multiCall<{ marketLiquidity: string; supplyInterestRate: string; tokenPrice: string; totalAssetSupply: string; }>([
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
        fnName: 'totalAssetSupply()(uint256)',
        args: [],
        key: 'totalAssetSupply',
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
        fnName: 'profitOf(address)(uint256)',
        args: [owner],
        key: 'profitOf',
        parser: (value) => value[0].toString(),
      },
      // {
      //   address,
      //   abi,
      //   fnName: 'tokenPrice',
      //   args: [],
      //   key: 'tokenPrice',
      //   parser: (value) => value[0].toString(),
      // },
    ]).then(({ returnData }) => returnData);
  }

  public lend(token: TOKEN, amount: string) {
    const { address, usesLm } = getLoanToken(token);

    const data = token === TOKEN.RBTC
      ? encodeFunctionData('mintWithBTC(address,bool)(uint256)', [walletService.address, usesLm])
      : encodeFunctionData('mint(address,uint256,bool)(uint256)', [walletService.address, amount, usesLm]);

    return contractReader.send({
      to: address,
      value: token === TOKEN.RBTC ? amount : '0',
      data,
    });
  }

}();

export default loanToken;
