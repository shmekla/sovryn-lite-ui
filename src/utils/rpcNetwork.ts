import { NETWORK } from 'types/network';
import { RpcNode } from './rpcNode';
import networks from '../config/networks';
import { getCurrentNetwork } from './network';

export class RpcNetwork {
  private static networks: Map<NETWORK, RpcNode> = new Map<NETWORK, RpcNode>();

  public static create(chainId: number, rpc: string) {
    this.networks.set(chainId, new RpcNode(rpc));
    return this.networks.get(chainId) as RpcNode;
  }

  public static get(network: NETWORK) {
    if (!this.networks.has(network)) {
      const chain = Object.values(networks).find(item => item.id === network);
      if (!chain)
        throw new Error(`Chain ${network} doesn't exist in our dictionary!`);
      if (!chain.rpcUrl)
        throw new Error(`Chain ${network} has no RPC node provided!`);
      this.create(network, chain.rpcUrl);
    }

    return this.networks.get(network) as RpcNode;
  }

  public static default() {
    return this.get(getCurrentNetwork().id);
  }
}
