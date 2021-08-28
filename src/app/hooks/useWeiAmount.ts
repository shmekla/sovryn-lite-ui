import { toWei } from 'utils/helpers';

export function useWeiAmount(amount: string, decimals: number = 18) {
  return toWei(amount || '0', decimals);
}
