import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { bignumber } from 'mathjs';
import { TOKEN } from 'types/token';
import { Dialog } from 'app/molecule/Dialog';
import loanToken from 'utils/blockchain/loanToken';
import { getLoanToken, getToken, weiToLocaleNumber } from '../../../../utils/helpers';
import { AddressLink } from '../../../atom/AddressLink';
import erc20Token from '../../../../utils/blockchain/erc20Token';
import { LendingInfoResponse } from '../../../../utils/blockchain/liquidityMining';
import { useWeiAmount } from '../../../hooks/useWeiAmount';
import AppContext from '../../../../context/app-context';
import AmountInputGroup from '../../../molecule/AmountInputGroup';
import ApproveTokenButton from '../../../molecule/ApproveTokenButton';

type Props = {
  pool: TOKEN;
  state: LendingInfoResponse;
  isOpen: boolean;
  onClose: () => void;
};

function LendDialog(props: Props) {

  const { balance: rbtcBalance } = useContext(AppContext);

  const [amount, setAmount] = useState('');
  const weiAmount = useWeiAmount(amount);
  const [loading, setLoading] = useState(false);

  const token = useMemo(() => getToken(props.pool), [props.pool]);
  const loan = useMemo(() => getLoanToken(props.pool), [props.pool]);

  const handleAmountChange = useCallback((value: string) => {
    setAmount(value);
  }, []);

  const approveTokenAmount = useCallback(() => {
    setLoading(true);
    erc20Token.approve(token.address, loan.address, weiAmount).then(e => {
      console.log('approving', e);
    }).catch(e => console.error('approving', e)).finally(() => setLoading(false));
  }, [token, loan, weiAmount]);

  const lendToken = useCallback(() => {
    setLoading(true);
    loanToken.lend(token.id, weiAmount).then(e => {
      console.log('lending', e);
    }).catch(e => console.error('lending', e)).finally(() => setLoading(false));
  }, [token, weiAmount]);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (bignumber(props.state.allowance).lessThan(weiAmount) && token?.id !== TOKEN.RBTC) {
      approveTokenAmount();
    } else {
      lendToken();
    }
  }, [props.state, weiAmount, token, approveTokenAmount, lendToken]);

  useEffect(() => {
    if (props.isOpen && props.pool !== null) {
      setAmount('0');
    }
  }, [props.pool, props.isOpen, loan, token]);

  const balance = useMemo(() => props.pool === TOKEN.RBTC ? rbtcBalance : props.state?.tokenBalanceOf || '0',[props.pool, props.state, rbtcBalance]);

  return (
    <Dialog isOpen={props.isOpen} onClose={props.onClose}>
      <>
        {props.isOpen && props.state && (
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center mb-2">
              <div>Asset</div>
              <div>{token?.symbol}</div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <div>Interest APR</div>
              <div>{weiToLocaleNumber(props.state.supplyInterestRate, 3)}%</div>
            </div>
            <div className="mb-3">
              <AmountInputGroup value={amount} onChange={handleAmountChange} maxAmount={balance} token={token?.id} />
            </div>
            <div className="mb-3 text-right">
              <AddressLink address={loan?.address} label={<>You will receive {loan?.iTokenSymbol}</>}/>
            </div>
            {loading && 'Loading...'}

            <ApproveTokenButton amount={weiAmount} token={token.id} spender={loan.address} onSubmit={() => {}} />

            {/*{(bignumber(props.state.allowance).lessThan(weiAmount) || props.state.allowance === '0') && token?.id !== TOKEN.RBTC ?*/}
            {/*  <SubmitButton text={`Approve ${token?.symbol}`} type="submit" disabled={weiAmount === '0' || bignumber(weiAmount).greaterThan(balance)}/> : <SubmitButton text="Lend" type="submit" disabled={weiAmount === '0' || bignumber(weiAmount).greaterThan(balance)}/>}*/}
          </form>
        )}
      </>
    </Dialog>
  );
}

export default LendDialog;
