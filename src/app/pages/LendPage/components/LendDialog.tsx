import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TOKEN } from 'types/token';
import { Dialog } from 'app/molecule/Dialog';
import loanToken from 'utils/blockchain/loanToken';
import {
  getLoanToken,
  getToken,
  weiToLocaleNumber,
} from '../../../../utils/helpers';
import { AddressLink } from '../../../atom/AddressLink';
import { LendingInfoResponse } from '../../../../utils/blockchain/liquidityMining';
import { useWeiAmount } from '../../../hooks/useWeiAmount';
import AppContext from '../../../../context/app-context';
import AmountInputGroup from '../../../molecule/AmountInputGroup';
import ApproveTokenButton from '../../../molecule/ApproveTokenButton';
import { useSendTx } from '../../../hooks/useSendTx';

type Props = {
  pool: TOKEN;
  state: LendingInfoResponse;
  isOpen: boolean;
  onClose: () => void;
};

const LendDialog: React.FC<Props> = props => {
  const { balance: rbtcBalance } = useContext(AppContext);

  const [amount, setAmount] = useState('');
  const weiAmount = useWeiAmount(amount);

  const token = useMemo(() => getToken(props.pool), [props.pool]);
  const loan = useMemo(() => getLoanToken(props.pool), [props.pool]);

  const handleAmountChange = useCallback((value: string) => {
    setAmount(value);
  }, []);

  const [handleSubmit, tx] = useSendTx(() =>
    loanToken.lend(token.id, weiAmount),
  );

  useEffect(() => {
    if (props.isOpen && props.pool !== null) {
      setAmount('0');
    }
  }, [props.pool, props.isOpen, loan, token]);

  const balance = useMemo(
    () =>
      props.pool === TOKEN.RBTC
        ? rbtcBalance
        : props.state?.tokenBalanceOf || '0',
    [props.pool, props.state, rbtcBalance],
  );

  return (
    <Dialog isOpen={props.isOpen} onClose={props.onClose}>
      <>
        {props.isOpen && props.state && (
          <>
            <div className='flex justify-between items-center mb-2'>
              <div>Asset</div>
              <div>{token?.symbol}</div>
            </div>
            <div className='flex justify-between items-center mb-2'>
              <div>Interest APR</div>
              <div>{weiToLocaleNumber(props.state.supplyInterestRate, 3)}%</div>
            </div>
            <div className='mb-3'>
              <AmountInputGroup
                value={amount}
                onChange={handleAmountChange}
                maxAmount={balance}
                token={token?.id}
              />
            </div>
            <div className='mb-3 text-right'>
              <AddressLink
                address={loan?.address}
                label={<>You will receive {loan?.iTokenSymbol}</>}
              />
            </div>

            <ApproveTokenButton
              label='Lend'
              amount={weiAmount}
              token={token}
              spender={loan.address}
              tx={tx}
              onSubmit={handleSubmit}
            />
          </>
        )}
      </>
    </Dialog>
  );
};

export default LendDialog;
