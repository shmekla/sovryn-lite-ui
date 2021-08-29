import contractReader from '../contractReader';
import { encodeFunctionData } from '../helpers';
import walletService from '../walletService';

const erc20Token = new class ERC20Token {

  public allowance(address: string, spender: string) {
    return this.call(address,'allowance(address,address)(uint256)', [walletService.address, spender])
      .then(result => result.toString());
  }

  public balanceOf(address: string, owner?: string) {
    return this.call(address, 'balanceOf(address)(uint256)', [owner || walletService.address])
      .then(result => result.toString());
  }

  public approve(address: string, spender: string, amount: string) {
    const data = encodeFunctionData('approve(address,uint256)', [spender.toLowerCase(), amount]);
    return contractReader.send({
      to: address,
      data,
    });
  }

  public getTokenInfo(address: string) {
    return contractReader.multiCall<{ decimals: string; totalSupply: string; symbol: string }>([
      {
        address,
        fnName: 'decimals(uint256)(uint256)',
        args: [],
        key: 'decimals',
        parser: (value) => value[0].toString(),
      },
      {
        address,
        fnName: 'totalSupply',
        args: [],
        key: 'totalSupply',
        parser: (value) => value[0].toString(),
      },
      {
        address,
        fnName: 'symbol',
        args: [],
        key: 'symbol',
        parser: (value) => value[0].toString(),
      },
    ]).then(({ returnData }) => returnData);
  }

  public call<T = string>(address: string, fnName: string, args: any[]) {
    return contractReader.call<T>(address.toLowerCase(), fnName, args);
  }

}();

export default erc20Token;
