import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { LoanTokenType } from 'types/loanToken';
import { getToken, nFormatter, weiToLocaleNumber, weiToNumber } from '../../../../utils/helpers';
import { AddressLink } from '../../../atom/AddressLink';
import AppContext from '../../../../context/app-context';
import liquidityMining, { LendingInfoResponse } from '../../../../utils/blockchain/liquidityMining';
import { TOKEN } from '../../../../types/token';
import Button from '../../../atom/Button';
import AppProvider, { AppProviderEvents } from '../../../../utils/AppProvider';
import classNames from 'classnames';
import CircularProgress from '../../../atom/CircularProgress';
import Spinner from '../../../atom/Spinner';

type LendingPoolActions = {
  onLend: (token: TOKEN, state: LendingInfoResponse) => void;
  onUnlend: (token: TOKEN, state: LendingInfoResponse) => void;
};

export function LendingPool({ token, usesLm, onLend, onUnlend }: LoanTokenType & LendingPoolActions) {

  const { address: owner } = useContext(AppContext);

  const [state, setState] = useState<LendingInfoResponse & { loading: boolean }>({
    loading: true,
    marketLiquidity: '0',
    supplyInterestRate: '0',
    getUserInfo: { amount: '0', accumulatedReward: '0', rewardDebt: '0' },
    profitOf: '0',
    balanceOf: '0',
    assetBalanceOf: '0',
    tokenPrice: '0',
    totalSupply: '0',
    totalAssetSupply: '0',
    getUserAccumulatedReward: '0',
    getUserPoolTokenBalance: '0',
    tokenBalanceOf: '0',
    allowance: '0',
  });
  const asset = useMemo(() => getToken(token), [token]);

  const retrievePoolData = useCallback(() => {
    setState(prevState => ({ ...prevState, loading: true }));
    liquidityMining.getLendingInfo(token, owner).then(response => {
      setState(prevState => ({
        ...prevState,
        loading: false,
        ...response,
      }));
    }).catch(console.error);
  }, [token, owner]);

  useEffect(() => {
    AppProvider.on(AppProviderEvents.REQUEST_UPDATE, retrievePoolData);
    return () => {
      AppProvider.off(AppProviderEvents.REQUEST_UPDATE, retrievePoolData);
    };
  }, [retrievePoolData]);

  const handleLendClick = useCallback(() => {
    onLend(token, state);
  }, [onLend, token, state]);

  const handleUnlendClick = useCallback(() => {
    onUnlend(token, state);
  }, [onUnlend, token, state]);

  const showBalance = useMemo(() => Number(state.assetBalanceOf) > 0 && owner, [state.assetBalanceOf, owner]);

  return (
    <div className="bg-black bg-opacity-10 dark:bg-blue-200 dark:bg-opacity-5 rounded-lg p-6 w-full relative">
      <Spinner className="absolute top-2 right-2" show={state.loading} size={16} strokeWidth={2} />
      <div className="flex flex-row justify-between items-center">
        <AddressLink address={asset.address} label={asset.symbol}/>
        <div className="flex flex-row justify-end items-center space-x-4">
          {usesLm && <span className="opacity-25 text-xs">LM rewards</span>}
        </div>
      </div>
      <div className="my-6 flex flex-row justify-between truncate">
        <div className={classNames(showBalance ? 'w-1/2' : 'w-full')}>
          <div className="mb-3">
            <div className="opacity-25 text-xs mb-1">Interest APR:</div>
            <div className="truncate">{weiToLocaleNumber(state.supplyInterestRate, 2)} %</div>
          </div>
          <div>
            <div className="opacity-25 text-xs mb-1">Liquidity:</div>
            <div className="truncate">{nFormatter(weiToNumber(state.marketLiquidity, 2))}</div>
          </div>
        </div>
        {showBalance && (
          <div className="w-1/2 text-right">
            <div className="mb-3 truncate">
              <div className="opacity-25 text-xs mb-1 truncate">Balance:</div>
              <div className="truncate">{weiToLocaleNumber(state.assetBalanceOf, 8)}</div>
            </div>
            <div>
              <div className="opacity-25 text-xs mb-1">Profit:</div>
              <div className="truncate">{weiToLocaleNumber(state.profitOf, 8)}</div>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-row justify-center space-x-8">
        <Button onClick={handleLendClick} text="Lend"/>
        {showBalance &&
        <Button onClick={handleUnlendClick} text="Unlend" intent="danger"/>}
      </div>
    </div>
  );
}
