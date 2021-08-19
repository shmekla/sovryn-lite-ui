import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { LoanTokenType } from 'types/loanToken';
import { getToken, toNumber } from '../../../../utils/helpers';
import { AddressLink } from '../../../atom/AddressLink';
import AppContext from '../../../../context/app-context';
import liquidityMining from '../../../../utils/blockchain/liquidityMining';
import { TOKEN } from '../../../../types/token';
import Button from '../../../atom/Button';

type LendingPoolActions = {
  onLend: (token: TOKEN) => void;
  onUnlend: (token: TOKEN) => void;
};

export function LendingPool({ token, usesLm, onLend, onUnlend }: LoanTokenType & LendingPoolActions) {

  const { address: owner } = useContext(AppContext);

  const [state, setState] = useState({ loading: true, marketLiquidity: '0', supplyInterestRate: '0', getUserInfo: { amount: '0' } });
  const asset = useMemo(() => getToken(token), [token]);

  useEffect(() => {
    setState(prevState => ({ ...prevState, loading: true }));

    liquidityMining.getLendingInfo(token, owner).then(response => {
      setState(prevState => ({
        ...prevState,
        loading: false,
        marketLiquidity: response.marketLiquidity,
        supplyInterestRate: response.supplyInterestRate,
        getUserInfo: response.getUserInfo,
      }));
      console.log(response);
    }).catch(console.error);

  }, [token, owner]);

  const handleLendClick = useCallback(() => {
    onLend(token);
  }, [onLend, token]);

  const handleUnlendClick = useCallback(() => {
    onUnlend(token);
  }, [onUnlend, token]);

  return (
    <div className="bg-blue-200 bg-opacity-5 rounded-lg p-6">
      <div className="flex flex-row justify-between items-center">
        <AddressLink address={asset.address} label={asset.symbol}/>
        {usesLm ? <span className="opacity-25 text-xs">LM rewards</span> : ''}
      </div>
      <div className="my-6">
        <div className="mb-3">
          <div className="opacity-25 text-xs mb-1">Interest APR:</div>
          <div>{toNumber(state.supplyInterestRate, 4)} %</div>
        </div>
        <div>
          <div className="opacity-25 text-xs mb-1">Liquidity:</div>
          <div>{toNumber(state.marketLiquidity, 4)}</div>
        </div>
      </div>
      <div className="flex flex-row justify-center space-x-8">
        <Button onClick={handleLendClick} text="Lend" />
        {Number(state.getUserInfo.amount) > 0 && <Button onClick={handleUnlendClick} text="Unlend" className="bg-red-600 hover:bg-red-500"/>}
      </div>
    </div>
  );
}
