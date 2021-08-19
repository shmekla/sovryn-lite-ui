import { NETWORK, NetworkSettings } from 'types/network';

const mainnet: NetworkSettings = {
  id: NETWORK.RSK,
  label: 'RSK',
  rpcUrl: 'https://public-node.rsk.co',
  networkExplorerName: 'RSK Explorer',
  networkExplorerUrl: 'https://explorer.rsk.co',
  multiCallContractAddress: '0x6c62bf5440de2cb157205b15c424bceb5c3368f5',
  protocolContractAddress: '0x5A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7',
  liquidityMiningProxy: '0xf730af26e87D9F55E46A6C447ED2235C385E55e0',
};

export default mainnet;
