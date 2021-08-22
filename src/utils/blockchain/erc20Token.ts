import { ethers } from 'ethers';
import { TOKEN } from 'types/token';
import contractReader from '../contractReader';
import { getLoanToken, getToken } from '../helpers';
import erc20abi from 'utils/blockchain/abi/erc20.json';
import walletService from '../walletService';
import { ValueOf } from '../../types/valueOf';

type MCData = {
  fnName: string;
  args: any[];
  parser?: (value: any) => any;
};

const erc20Token = new class ERC20Token {

  public allowance(token: TOKEN, spender: string) {
    const { address } = getToken(token);
    return contractReader
      .call<string>(address, erc20abi, 'allowance', [walletService.address, spender])
      .then(result => result.toString());
  }

  public balanceOf(token: TOKEN, owner: string) {
    const { address } = getToken(token);
    return contractReader
      .call<string>(address, erc20abi, 'balanceOf', [walletService.address])
      .then(result => result.toString());
  }

  public approve(token: TOKEN, spender: string, amount: string) {
    const { address } = getToken(token);
    const data = contractReader.encodeFunctionData(address, erc20abi, 'approve', [spender, amount]);
    return walletService.sendTransaction({
      to: address,
      data,
    });
  }

  public multiCall(token: TOKEN, data: MCData[]) {
    const { address } = getToken(token);
    const items = data.map(item => ({
      address,
      abi: erc20abi,
      fnName: item.fnName,
      args: item.args,
      key: item.fnName,
    }));
    return contractReader.multiCall<ValueOf<typeof items>>(items).then(({ returnData }) => returnData);
  }

  public getTokenInfo(token: TOKEN) {
    const { address } = getToken(token);
    return contractReader.multiCall<{ decimals: string; totalSupply: string; symbol: string }>([
      {
        address,
        abi: erc20abi,
        fnName: 'decimals',
        args: [],
        key: 'decimals',
        parser: (value) => value[0].toString(),
      },
      {
        address,
        abi: erc20abi,
        fnName: 'totalSupply',
        args: [],
        key: 'totalSupply',
        parser: (value) => value[0].toString(),
      },
      {
        address,
        abi: erc20abi,
        fnName: 'symbol',
        args: [],
        key: 'symbol',
        parser: (value) => value[0].toString(),
      },
    ]).then(({ returnData }) => returnData);
  }

  public call<T = string>(token: TOKEN, fnName: string, args: any[]) {
    const { address, abi } = getLoanToken(token);
    return contractReader.call<T>(address, abi, fnName, args);
  }

  public encodeFunctionData(token: TOKEN, fnName: string, args: any[]) {
    const { address, abi } = getLoanToken(token);
    return contractReader.encodeFunctionData(address, abi, fnName, args);
  }

  public decodeFunctionResult(token: TOKEN, fnName: string, data: ethers.utils.BytesLike) {
    const { address, abi } = getLoanToken(token);
    return contractReader.decodeFunctionResult(address, abi, fnName, data);
  }

}();

export default erc20Token;
