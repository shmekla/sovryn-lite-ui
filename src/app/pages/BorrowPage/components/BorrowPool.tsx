import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import log from 'loglevel';
import type { LoanTokenType } from 'types/loanToken';
import {
  getToken,
  nFormatter,
  weiToLocaleNumber,
  weiToNumber,
} from '../../../../utils/helpers';
import { AddressLink } from '../../../atom/AddressLink';
import AppContext from '../../../../context/app-context';
import Button from '../../../atom/Button';
import AppProvider, { AppProviderEvents } from '../../../../utils/AppProvider';
import Spinner from '../../../atom/Spinner';
import loanToken, {
  BorrowInfoResponse,
} from '../../../../utils/blockchain/loanToken';
import BorrowDialog from './BorrowDialog';

export function BorrowPool({ token }: LoanTokenType) {
  const { connected } = useContext(AppContext);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [state, setState] = useState<BorrowInfoResponse & { loading: boolean }>(
    {
      loading: true,
      marketLiquidity: '0',
      borrowInterestRate: '0',
      totalAssetSupply: '0',
      tokenPrice: '0',
    },
  );
  const asset = useMemo(() => getToken(token), [token]);

  const retrievePoolData = useCallback(() => {
    setState(prevState => ({ ...prevState, loading: true }));
    loanToken
      .getBorrowingInfo(token)
      .then(response => {
        setState(prevState => ({
          ...prevState,
          loading: false,
          ...response,
        }));
      })
      .catch(log.error);
  }, [token]);

  useEffect(() => {
    AppProvider.on(AppProviderEvents.REQUEST_UPDATE, retrievePoolData);
    return () => {
      AppProvider.off(AppProviderEvents.REQUEST_UPDATE, retrievePoolData);
    };
  }, [retrievePoolData]);

  return (
    <>
      <div className="bg-black bg-opacity-10 dark:bg-blue-200 dark:bg-opacity-5 rounded-lg p-6 w-full relative">
        <Spinner
          className="absolute top-2 right-2"
          show={state.loading}
          size={16}
          strokeWidth={2}
        />
        <div className="flex flex-row justify-between items-center">
          <AddressLink address={asset.address} label={asset.symbol} />
        </div>
        <div className="my-6 flex flex-row justify-between truncate">
          <div className="w-full">
            <div className="mb-3">
              <div className="opacity-25 text-xs mb-1">Interest:</div>
              <div className="truncate">
                {weiToLocaleNumber(state.borrowInterestRate, 2)} %
              </div>
            </div>
            <div>
              <div className="opacity-25 text-xs mb-1">Liquidity:</div>
              <div className="truncate">
                {nFormatter(weiToNumber(state.marketLiquidity, 2))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center space-x-8">
          <Button
            onClick={() => setDialogOpen(true)}
            text="Borrow"
            disabled={!connected}
          />
        </div>
      </div>
      <BorrowDialog
        pool={token}
        state={state}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}
