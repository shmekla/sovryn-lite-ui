import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import debounce from 'lodash/debounce';
import log from 'loglevel';
import { TOKEN } from 'types/token';
import { Dialog } from 'app/molecule/Dialog';
import loanToken, { BorrowInfoResponse } from 'utils/blockchain/loanToken';
import {
  getLoanToken,
  getToken,
  toWei,
  weiToLocaleNumber,
  weiToNumber,
} from '../../../../utils/helpers';
import { useWeiAmount } from '../../../hooks/useWeiAmount';
import AppContext from '../../../../context/app-context';
import AmountInputGroup from '../../../molecule/AmountInputGroup';
import ApproveTokenButton from '../../../molecule/ApproveTokenButton';
import { useSendTx } from '../../../hooks/useSendTx';
import { useBalance } from '../../../hooks/useBalance';
import Select from '../../../atom/Select';
import Input from 'app/atom/Input';

type Props = {
  pool: TOKEN;
  state: BorrowInfoResponse;
  isOpen: boolean;
  onClose: () => void;
};

type LastInputType = 'deposit' | 'borrow';

const BorrowDialog: React.FC<Props> = props => {
  const { address: owner } = useContext(AppContext);

  const [lastInput, setLastInput] = useState<LastInputType>('deposit');
  const [depositAmount, setDepositAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [initialLoanDuration, setInitialLoanDuration] = useState('28');

  const loanDuration = useMemo(
    () => Number(initialLoanDuration) * 60 * 60 * 24,
    [initialLoanDuration],
  );

  const token = useMemo(() => getToken(props.pool), [props.pool]);
  const loan = useMemo(() => getLoanToken(props.pool), [props.pool]);

  const [collateral, setCollateral] = useState(loan.collateralTokens[0]);

  const collateralToken = useMemo(() => getToken(collateral), [collateral]);

  const depositWeiAmount = useWeiAmount(
    depositAmount,
    collateralToken.decimals,
  );

  const [handleSubmit, tx] = useSendTx(
    () => loanToken.lend(token.id, depositWeiAmount), // todo change to borrow
  );

  const { value: balance } = useBalance(
    token.address,
    owner,
    props.pool === TOKEN.RBTC,
  );

  const { value: collateralBalance } = useBalance(
    collateralToken.address,
    owner,
    collateralToken.id === TOKEN.RBTC,
  );

  const getDepositAmountForBorrow = useCallback(
    async (amount: string) => {
      log.info('get deposit amount for borrow', amount, token, collateralToken);
      if (!amount || amount === '0') {
        setDepositAmount('0');
        return;
      }
      const result = await loanToken.getDepositAmountForBorrow(
        loan.address,
        toWei(amount, token.decimals),
        loanDuration,
        collateralToken.address,
      );
      log.info('deposit amount result', result, token, collateralToken);
      setDepositAmount(weiToNumber(result, 8, collateralToken.decimals));
    },
    [collateralToken, loan, token, loanDuration],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedGetDepositAmountForBorrow = useCallback(
    debounce(value => getDepositAmountForBorrow(value), 300),
    [token, collateralToken],
  );

  const handleBorrowAmountChange = useCallback(
    (value: string) => {
      setBorrowAmount(value);
      setLastInput('borrow');
      delayedGetDepositAmountForBorrow(value);
    },
    [delayedGetDepositAmountForBorrow],
  );

  const getBorrowAmountForDeposit = useCallback(
    async (amount: string) => {
      log.info('get borrow amount for deposit', amount, token, collateralToken);
      if (!amount || amount === '0') {
        setBorrowAmount('0');
        return;
      }
      const result = await loanToken.getBorrowAmountForDeposit(
        loan.address,
        toWei(amount, collateralToken.decimals),
        loanDuration,
        collateralToken.address,
      );
      log.info('borrow amount result', result);
      setBorrowAmount(weiToNumber(result, 8, token.decimals));
    },
    [collateralToken, loan, token, loanDuration],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedGetBorrowAmountForDeposit = useCallback(
    debounce(value => getBorrowAmountForDeposit(value), 300),
    [token, collateralToken],
  );

  const handleDepositAmountChange = useCallback(
    (value: string) => {
      setDepositAmount(value);
      setLastInput('deposit');
      delayedGetBorrowAmountForDeposit(value);
    },
    [delayedGetBorrowAmountForDeposit],
  );

  const handleCollateralChange = useCallback(
    async (event: React.ChangeEvent<HTMLSelectElement>) => {
      setCollateral(event.currentTarget.value as unknown as TOKEN);
    },
    [],
  );

  const triggerAmountUpdates = useCallback(() => {
    if (lastInput === 'borrow') {
      getDepositAmountForBorrow(borrowAmount).catch(log.error);
    } else {
      getBorrowAmountForDeposit(depositAmount).catch(log.error);
    }
  }, [
    lastInput,
    borrowAmount,
    depositAmount,
    getDepositAmountForBorrow,
    getBorrowAmountForDeposit,
  ]);

  useEffect(() => {
    triggerAmountUpdates();
  }, [collateral, loanDuration, triggerAmountUpdates]);

  return (
    <Dialog isOpen={props.isOpen} onClose={props.onClose}>
      <>
        {props.isOpen && props.state && (
          <>
            <div className="flex justify-between items-center mb-2">
              <div>Asset</div>
              <div>{token?.symbol}</div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <div>Interest APR</div>
              <div>{weiToLocaleNumber(props.state.borrowInterestRate, 3)}%</div>
            </div>
            <div className="mb-3">
              <label className="control-label">
                How much you would like to borrow?
              </label>
              <AmountInputGroup
                value={borrowAmount}
                onChange={handleBorrowAmountChange}
                token={token?.id}
                hideSelector
                maxAmount={balance}
              />
            </div>

            <div className="mb-3">
              <label className="control-label">
                Which asset you will use as collateral?
              </label>
              <Select value={collateral} onChange={handleCollateralChange}>
                {loan.collateralTokens.map(item => (
                  <option key={item} value={item}>
                    {getToken(item).symbol}
                  </option>
                ))}
              </Select>
            </div>

            <div className="mb-3">
              <label className="control-label">
                How much would you like to deposit?
              </label>
              <AmountInputGroup
                value={depositAmount}
                onChange={handleDepositAmountChange}
                maxAmount={collateralBalance}
                token={collateral}
              />
            </div>

            <div className="mb-3">
              <label className="control-label">
                Initial loan duration (days):
              </label>
              <Input
                type="number"
                value={initialLoanDuration}
                onChange={e => setInitialLoanDuration(e.currentTarget.value)}
                min={1}
                max={1515}
                step={1}
              />
            </div>

            <ApproveTokenButton
              label="Borrow"
              amount={depositWeiAmount}
              token={collateralToken}
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

export default BorrowDialog;
