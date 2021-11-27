import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { bignumber } from 'mathjs';
import log from 'loglevel';
import { TOKEN } from 'types/token';
import { Dialog } from 'app/molecule/Dialog';
import loanToken from 'utils/blockchain/loanToken';
import {
  getLoanToken,
  getToken,
  weiToLocaleNumber,
} from '../../../../utils/helpers';
import { AddressLink } from '../../../atom/AddressLink';
import liquidityMining, {
  LendingInfoResponse,
} from '../../../../utils/blockchain/liquidityMining';
import { useWeiAmount } from '../../../hooks/useWeiAmount';
import AppContext from '../../../../context/app-context';
import AmountInputGroup from '../../../molecule/AmountInputGroup';
import { useSendTx } from '../../../hooks/useSendTx';
import TransferButton from '../../../molecule/TransferButton';

type Props = {
  pool: TOKEN;
  state: LendingInfoResponse;
  isOpen: boolean;
  onClose: () => void;
};

function UnlendDialog(props: Props) {
  const { address } = useContext(AppContext);

  const [amount, setAmount] = useState('');
  const weiAmount = useWeiAmount(amount);
  const [state, setState] = useState<LendingInfoResponse>({
    supplyInterestRate: '0',
    assetBalanceOf: '0',
    getUserAccumulatedReward: '0',
    getUserPoolTokenBalance: '0',
  } as LendingInfoResponse);

  const token = useMemo(() => getToken(props.pool), [props.pool]);
  const loan = useMemo(() => getLoanToken(props.pool), [props.pool]);
  const tokenForUnlend = useMemo(
    () => ({
      ...token,
      address: loan?.address,
      symbol: loan?.iTokenSymbol,
      native: true,
    }),
    [token, loan],
  );

  const totalBalance = bignumber(state.balanceOf || '0')
    .add(state.getUserPoolTokenBalance || '0')
    .toFixed(0);

  const iTokenAmount = useMemo(() => {
    let tokenAmount = bignumber(weiAmount)
      .div(state.tokenPrice || '0')
      .mul(10 ** 18);

    if (tokenAmount.isNaN()) {
      tokenAmount = bignumber(0);
    }

    // make sure there is no dust amount left when withdrawing
    if (tokenAmount.add(0.00001 * 1e18).greaterThanOrEqualTo(totalBalance)) {
      return totalBalance;
    }

    return tokenAmount.toFixed(0);
  }, [weiAmount, state, totalBalance]);

  const handleAmountChange = useCallback(
    (value: string) => setAmount(value),
    [],
  );

  const [handleSubmit, tx] = useSendTx(() =>
    loanToken.unlend(token.id, iTokenAmount),
  );

  useEffect(() => {
    if (props.isOpen && props.pool !== null) {
      setState({
        supplyInterestRate: '0',
        assetBalanceOf: '0',
        getUserAccumulatedReward: '0',
      } as LendingInfoResponse);
      setAmount('0');
      liquidityMining
        .getLendingInfo(props.pool, address)
        .then(result => {
          log.info(result);
          setState(result as LendingInfoResponse);
        })
        .catch(error => {
          log.error(error);
        });
    }
  }, [props.pool, props.isOpen, loan, address]);

  return (
    <Dialog isOpen={props.isOpen} onClose={props.onClose}>
      <>
        {props.isOpen && (
          <>
            <div className="flex justify-between items-center mb-2">
              <div>Asset</div>
              <div>{token?.symbol}</div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <div>Interest APR</div>
              <div>{weiToLocaleNumber(state.supplyInterestRate, 3)}%</div>
            </div>
            <div className="mb-3">
              <AmountInputGroup
                value={amount}
                onChange={handleAmountChange}
                maxAmount={state.assetBalanceOf || '0'}
                token={token?.id}
              />
            </div>
            {loan?.usesLm && (
              <div className="mb-3">
                <div className="opacity-25 text-xs mb-1">
                  Liquidity Mining SOV Rewards:
                </div>
                <div className="truncate">
                  {weiToLocaleNumber(state.getUserAccumulatedReward || '0', 18)}
                </div>
              </div>
            )}
            <div className="mb-3 text-right">
              <AddressLink
                address={token?.address}
                label={<>You will receive {token?.symbol}</>}
              />
            </div>
            <TransferButton
              label="Unlend"
              onSubmit={handleSubmit}
              token={tokenForUnlend}
              tx={tx}
              amount={weiAmount}
            />
          </>
        )}
      </>
    </Dialog>
  );
}

export default UnlendDialog;
