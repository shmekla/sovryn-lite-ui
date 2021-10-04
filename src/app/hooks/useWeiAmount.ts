import { toWei } from 'utils/helpers';

export function useWeiAmount(amount: string, decimals = 18): string {
  return toWei(amount || '0', decimals);
}
