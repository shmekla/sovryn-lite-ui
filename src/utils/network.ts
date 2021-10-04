import type { NETWORK, NetworkSettings } from 'types/network';
import networks from '../config/networks';

export function getCurrentNetwork() {
  return Object.values(networks).find(
    item => item.id === Number(process.env.REACT_APP_NETWORK_ID || '31'),
  ) as NetworkSettings;
}

export function getNetwork(network: NETWORK) {
  return Object.values(networks).find(
    item => item.id === network,
  ) as NetworkSettings;
}
