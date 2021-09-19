import { ethers } from 'ethers';
import type { TransactionRequest } from '@ethersproject/abstract-provider';
import type { Deferrable } from '@ethersproject/properties';
import { NETWORK } from 'types/network';
import { getCurrentNetwork } from './network';
import { RpcNetwork } from './rpcNetwork';
import walletService from './walletService';
import {
  decodeParameters, encodeFunctionData,
  encodeFunctionDataWithTypes,
  encodeParameters,
  functionSignature,
  prepareFunction,
} from './helpers';
import { hexConcat, Result } from 'ethers/lib/utils';
import { BytesLike } from '@ethersproject/bytes';

export interface MultiCallData {
  address: string;
  fnName: string;
  args: any[];
  key: string;
  parser?: (val: any) => any;
}

const contractReader = new class ContractReader {
  public readonly contracts: Map<NETWORK, Map<string, ethers.Contract>> = new Map<NETWORK,
    Map<string, ethers.Contract>>();

  public async nonce() {
    return this.getNode().getTransactionCount(
      walletService.address?.toLowerCase() || '',
    );
  }

  public async receipt(transactionHash: string) {
    return this.getNode()
      .getTransactionReceipt(transactionHash)
      .catch(e => console.error(e, transactionHash));
  }

  public async multiCall<T = { [key: string]: string }>(callData: MultiCallData[]) {

    const network = getCurrentNetwork();

    const items = callData.map(item => {
      const { method, types, returnTypes } = prepareFunction(item.fnName);
      return {
        target: item.address,
        callData: encodeFunctionDataWithTypes(method, types, item.args),
        returns: (data: BytesLike) => {
          try {
            return decodeParameters(returnTypes, data)
          } catch (e) {
            console.error('decodeParameters::', method, types, returnTypes, data);
            console.error(e);
            return data;
          }
        },
        key: item.key,
        parser: item.parser,
      };
    });

    const data = encodeFunctionDataWithTypes('aggregate((address,bytes)[])', [{
      components: [{ name: "target", type: "address" }, { name: "callData", type: "bytes" }],
      name: "calls",
      type: "tuple[]"
    }] as any, [items.map(item => ({ target: item.target, callData: item.callData }))]);

    return this.getProvider().call({
      to: network.multiCallContractAddress,
      data,
    }).then(result => {
      const [blockNumber, data] = decodeParameters(['uint256', 'bytes[]'], result);

      const returnData: T = {} as T;
      data.forEach((item: string, index: number) => {
        const value = items[index].returns(item);
        const key: string = (items[index].key || index) as string;
        // @ts-ignore
        returnData[key] = items[index].parser ? items[index].parser(value) : value;
      });

      return { blockNumber: blockNumber.toString(), returnData }
    });
  }

  public async call<T = Result>(to: string, methodAndTypes: string, args: ReadonlyArray<any>, request?: Deferrable<TransactionRequest>) {
    const { method, types, returnTypes } = prepareFunction(methodAndTypes);
    return this.getProvider().call({
      to,
      data: hexConcat([functionSignature(method), encodeParameters(types, args)]),
      ...request,
    }).then(response => decodeParameters(returnTypes, response) as unknown as T);
  }

  public async send(to: string, methodAndTypes: string, args: ReadonlyArray<any>, request?: TransactionRequest) {
    const data = encodeFunctionData(methodAndTypes, args);
    return await walletService.sendTransaction({
      to: to,
      data,
      ...request,
    });
  }

  public async estimateGas(
    address: string,
    abi: ethers.ContractInterface,
    fnName: string,
    args: any[],
  ) {
    return this.prepareContract(address, abi).estimateGas[fnName](
      ...args,
    );
  }

  public encodeFunctionData(
    address: string,
    abi: ethers.ContractInterface,
    fnName: string,
    args: any[],
  ) {
    return this.prepareContract(
      address,
      abi,
    ).interface.encodeFunctionData(fnName, args);
  }

  public decodeFunctionResult(
    address: string,
    abi: ethers.ContractInterface,
    fnName: string,
    data: ethers.utils.BytesLike,
  ) {
    return this.prepareContract(
      address,
      abi,
    ).interface.decodeFunctionResult(fnName, data);
  }

  public getNode() {
    return RpcNetwork.get(getCurrentNetwork().id);
  }

  public getProvider() {
    return this.getNode().provider;
  }

  public prepareContract(
    address: string,
    abi: ethers.ContractInterface,
  ) {
    const chain = getCurrentNetwork().id;
    address = address.toLowerCase();
    if (!this.contracts.has(chain)) {
      this.contracts.set(chain, new Map<string, ethers.Contract>());
    }

    const contracts = this.contracts.get(chain) as Map<string, ethers.Contract>;

    if (!contracts.has(address)) {
      const contract = new ethers.Contract(
        address,
        abi,
        this.getProvider(),
      );
      contracts.set(chain as unknown as string, contract);
      return contract;
    }

    return contracts.get(address) as ethers.Contract;
  }
}();

export default contractReader;
