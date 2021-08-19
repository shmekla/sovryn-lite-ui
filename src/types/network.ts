export enum NETWORK {
  UNKNOWN = 0,
  RSK = 30,
  RSK_TESTNET = 31,
}

export type NetworkSettings = {
  id: NETWORK;
  label: string;
  rpcUrl: string;
  networkExplorerName: string;
  networkExplorerUrl: string;
  multiCallContractAddress: string;
  protocolContractAddress: string;
  liquidityMiningProxy: string;
};
