import { TOKEN } from 'types/token';
import contractReader from '../contractReader';
import { encodeFunctionData, getToken } from '../helpers';
import walletService from '../walletService';

const erc20Token = new class ERC20Token {

  public allowance(token: TOKEN, spender: string) {
    return this.call(token,'allowance(address,address)(uint256)', [walletService.address, spender])
      .then(result => result.toString());
  }

  public balanceOf(token: TOKEN, owner?: string) {
    return this.call(token, 'balanceOf(address)(uint256)', [owner || walletService.address])
      .then(result => result.toString());
  }

  public approve(token: TOKEN, spender: string, amount: string) {
    const { address } = getToken(token);
    const data = encodeFunctionData('approve(address,uint256)', [spender.toLowerCase(), amount]);
    return contractReader.send({
      to: address,
      data,
    });
  }

  public getTokenInfo(token: TOKEN) {
    const { address } = getToken(token);
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

  public call<T = string>(token: TOKEN, fnName: string, args: any[]) {
    const { address } = getToken(token);
    return contractReader.call<T>(address.toLowerCase(), fnName, args);
  }

}();

export default erc20Token;
