import { useCallback, useEffect, useState } from 'react';
import { Nullable } from '../../types/nullable';
import AppProvider, { AppProviderEvents } from '../../utils/AppProvider';
import contractReader from '../../utils/contractReader';
import erc20Token from '../../utils/blockchain/erc20Token';
import { zeroAddress } from '../../utils/constants';

export function useBalance(
  tokenAddress: string,
  owner: string,
  native?: boolean,
) {
  const [state, setState] = useState<{
    value: string;
    loading: boolean;
    error: Nullable<string>;
  }>({ value: '0', loading: false, error: null });

  const getBalance = useCallback(() => {
    if (!owner || owner === zeroAddress) {
      return;
    }

    const run = () =>
      native
        ? contractReader.balance(owner.toLowerCase())
        : erc20Token.balanceOf(tokenAddress, owner.toLowerCase());

    setState(prevState => ({ ...prevState, loading: true }));

    run()
      .then(result =>
        setState(prevState => ({
          ...prevState,
          loading: false,
          value: result,
          error: null,
        })),
      )
      .catch(e =>
        setState(prevState => ({
          ...prevState,
          loading: false,
          value: '0',
          error: e.message,
        })),
      );
  }, [tokenAddress, owner, native]);

  useEffect(() => {
    getBalance();
    AppProvider.on(AppProviderEvents.REQUEST_UPDATE, getBalance);
    return () => {
      AppProvider.off(AppProviderEvents.REQUEST_UPDATE, getBalance);
    };
  }, [getBalance]);

  return state;
}
