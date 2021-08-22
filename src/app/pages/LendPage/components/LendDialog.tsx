import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TOKEN } from 'types/token';
import { Dialog } from 'app/molecule/Dialog';
import Input from 'app/atom/Input';
import loanToken from 'utils/blockchain/loanToken';
import { getLoanToken, getToken, toNumber } from '../../../../utils/helpers';
import Button from '../../../atom/Button';
import { AddressLink } from '../../../atom/AddressLink';
import erc20Token from '../../../../utils/blockchain/erc20Token';
import type { LendingInfoResponse } from '../../../../utils/blockchain/liquidityMining';

type Props = {
  pool: TOKEN;
  isOpen: boolean;
  onClose: () => void;
};

function LendDialog(props: Props) {

  const [amount, setAmount] = useState('');
  const [state, setState] = useState<LendingInfoResponse>({ supplyInterestRate: '0' } as LendingInfoResponse);
  const [allowance, setAllowance] = useState<string>('0');

  const handleAmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.currentTarget.value);
  }, []);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    if (props.isOpen && props.pool !== null) {
      setState({ supplyInterestRate: '0' } as LendingInfoResponse);
      loanToken.getLendingInfo(props.pool).then(result => {
        setState(result as LendingInfoResponse);
      }).catch(error => {
        console.error(error);
      });

      erc20Token.allowance(props.pool, getLoanToken(props.pool).address)
        .then(setAllowance)
        .catch(console.error);
    }
  }, [props.pool, props.isOpen]);

  const token = useMemo(() => getToken(props.pool), [props.pool]);
  const loan = useMemo(() => getLoanToken(props.pool), [props.pool]);



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
          <Input type="number" value={amount} onChange={handleAmountChange} />
        </div>
        <div className="mb-3 text-right">
          <AddressLink address={loan?.address} label={<>You will receive {loan?.iTokenSymbol}</>} />
        </div>
        <Button text="Lend" type="submit" />
      </form>
    </Dialog>
  );
}

export default LendDialog;
