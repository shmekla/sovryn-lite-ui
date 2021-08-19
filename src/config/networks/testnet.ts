import { NETWORK, NetworkSettings } from 'types/network';

const testnet: NetworkSettings = {
  id: NETWORK.RSK_TESTNET,
  label: 'RSK Testnet',
  rpcUrl: 'https://public-node.testnet.rsk.co',
  networkExplorerName: 'RSK Explorer',
  networkExplorerUrl: 'https://explorer.testnet.rsk.co',
  multiCallContractAddress: '0x9e469e1fc7fb4c5d17897b68eaf1afc9df39f103',
  protocolContractAddress: '0x25380305f223B32FDB844152abD2E82BC5Ad99c3',
  liquidityMiningProxy: '0xe28aEbA913c34EC8F10DF0D9C92D2Aa27545870e',
};

export default testnet;
