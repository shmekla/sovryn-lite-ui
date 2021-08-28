import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { TOKEN } from 'types/token';
import { Dialog } from 'app/molecule/Dialog';
import Input from 'app/atom/Input';
import loanToken from 'utils/blockchain/loanToken';
import { getLoanToken, getToken, toNumber } from '../../../../utils/helpers';
import Button from '../../../atom/Button';
import { AddressLink } from '../../../atom/AddressLink';
import erc20Token from '../../../../utils/blockchain/erc20Token';
import { LendingInfoResponse } from '../../../../utils/blockchain/liquidityMining';
import { useWeiAmount } from '../../../hooks/useWeiAmount';
import { bignumber } from 'mathjs';
import AppContext from '../../../../context/app-context';
import { AmountSelector } from 'app/atom/AmountSelector';

type Props = {
  pool: TOKEN;
  isOpen: boolean;
  onClose: () => void;
};

function LendDialog(props: Props) {

  const { balance: rbtcBalance } = useContext(AppContext);

  const [amount, setAmount] = useState('');
  const weiAmount = useWeiAmount(amount);
  const [state, setState] = useState<LendingInfoResponse>({ supplyInterestRate: '0' } as LendingInfoResponse);
  const [allowance, setAllowance] = useState<string>('0');
  const [tokenBalance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  const token = useMemo(() => getToken(props.pool), [props.pool]);
  const loan = useMemo(() => getLoanToken(props.pool), [props.pool]);

  const handleAmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.currentTarget.value);
  }, []);

  const approveTokenAmount = useCallback(() => {
    setLoading(true);
    erc20Token.approve(token.id, loan.address, weiAmount).then(e => {
      console.log('approving', e);
    }).catch(e => console.error('approving', e)).finally(() => setLoading(false));
  }, [token, loan, weiAmount]);

  const lendToken = useCallback(() => {
    setLoading(true);
    console.log('amount', weiAmount);
    loanToken.lend(token.id, weiAmount).then(e => {
      console.log('lending', e);
    }).catch(e => console.error('lending', e)).finally(() => setLoading(false));
  }, [token, weiAmount]);

  const handleAmountSelect = useCallback((value: string | number) => {
    setAmount(toNumber(value, 4));
  }, []);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (bignumber(allowance).lessThan(weiAmount) && token?.id !== TOKEN.RBTC) {
      approveTokenAmount();
    } else {
      lendToken();
    }
  }, [allowance, weiAmount, token, approveTokenAmount, lendToken]);

  useEffect(() => {
    if (props.isOpen && props.pool !== null) {
      setState({ supplyInterestRate: '0' } as LendingInfoResponse);
      setAmount('0');
      setBalance('0');
      setAllowance('0');
      loanToken.getLendingInfo(props.pool).then(result => {
        setState(result as LendingInfoResponse);
      }).catch(error => {
        console.error(error);
      });

      if (props.pool !== TOKEN.RBTC) {
        erc20Token.allowance(props.pool, loan.address)
          .then(result => {
            setAllowance(result);
          })
          .catch(console.error);

        erc20Token.balanceOf(props.pool)
          .then(result => {
            setBalance(result);
          })
          .catch(console.error);
      }
    }
  }, [props.pool, props.isOpen, loan]);

  const balance = useMemo(() => props.pool === TOKEN.RBTC ? rbtcBalance : tokenBalance,[props.pool, tokenBalance, rbtcBalance]);

  return (
    <Dialog isOpen={props.isOpen} onClose={props.onClose}>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-2">
          <div>Asset</div>
          <div>{token?.symbol}</div>
        </div>
        <div className="flex justify-between items-center mb-2">
          <div>Interest APR</div>
          <div>{toNumber(state.supplyInterestRate, 3)}%</div>
        </div>
        <div className="mb-3">
          <Input type="number" value={amount} onChange={handleAmountChange}/>
          <p>{toNumber(balance, 4)} {token?.symbol}</p>
          <AmountSelector balance={balance} onChange={handleAmountSelect} />
        </div>
        <div className="mb-3 text-right">
          <AddressLink address={loan?.address} label={<>You will receive {loan?.iTokenSymbol}</>}/>
        </div>
        {loading && 'Loading...'}
        {(bignumber(allowance).lessThan(weiAmount) || allowance === '0') && token?.id !== TOKEN.RBTC ?
          <Button text={`Approve ${token?.symbol}`} type="submit" disabled={weiAmount === '0' || bignumber(weiAmount).greaterThan(balance)}/> : <Button text="Lend" type="submit" disabled={weiAmount === '0' || bignumber(weiAmount).greaterThan(balance)}/>}
      </form>
    </Dialog>
  );
}

export default LendDialog;
