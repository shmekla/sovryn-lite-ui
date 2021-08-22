import { ethers } from 'ethers';
import type { TransactionRequest } from '@ethersproject/abstract-provider';
import multicallAbi from 'utils/blockchain/abi/multicall.json';
import { NETWORK } from 'types/network';
import { getCurrentNetwork } from './network';
import { RpcNetwork } from './rpcNetwork';
import walletService from './walletService';

interface MultiCallData {
  address: string;
  abi: ethers.ContractInterface;
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

    const data = callData.map(item => ({
      target: item.address,
      callData: this.encodeFunctionData(
        item.address,
        item.abi,
        item.fnName,
        item.args,
      ),
    }));

    return this.call<{ blockNumber: string; returnData: T }>(
      network.multiCallContractAddress,
      multicallAbi,
      'aggregate',
      [data],
    ).then(({ blockNumber, returnData }) => {
      const data: T = {} as T;
      callData.forEach((item, index) => {
        const value = this.decodeFunctionResult(
          item.address,
          item.abi,
          item.fnName,
          // @ts-ignore
          returnData[index],
        );
        // @ts-ignore
        data[item.key || index] = item.parser ? item.parser(value) : value;
      });

      return {
        blockNumber: blockNumber.toString(),
        returnData: data,
      };
    });
  }

  public async call<T = string>(
    address: string,
    abi: ethers.ContractInterface,
    fnName: string,
    args: any[],
  ): Promise<T> {
    return this.prepareContract(address, abi).callStatic[fnName](
      ...args,
    );
  }

  public async send(tx: TransactionRequest) {
    tx.from = walletService.address.toLowerCase();

    if (tx.nonce === undefined) {
      tx.nonce = await this.nonce();
    }

    if (tx.gasLimit === undefined) {
      tx.gasLimit = await this.getNode().estimateGas(tx);
    }

    if (tx.gasPrice === undefined) {
      tx.gasPrice = await this.getNode().getGasPrice();
    }

    tx.chainId = walletService.network;

    return await walletService.sendTransaction(tx);
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
