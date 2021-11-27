import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { bignumber } from 'mathjs';
import log from 'loglevel';
import Button from '../atom/Button';
import { TokenType } from '../../types/token';
import { weiToNumber } from '../../utils/helpers';
import contractReader, { MultiCallData } from '../../utils/contractReader';
import AppContext from '../../context/app-context';
import { AddressLink } from '../atom/AddressLink';
import Input from '../atom/Input';
import { useWeiAmount } from '../hooks/useWeiAmount';
import erc20Token from '../../utils/blockchain/erc20Token';
import { TxHookResponse, TxStatus, useSendTx } from '../hooks/useSendTx';
import { InDialogApproveModal } from './InDialogApproveModal';
import Popover from '../atom/Popover';
import AppProvider, { AppProviderEvents } from '../../utils/AppProvider';

const UNLIMITED_AMOUNT = '10000000';

type Props = {
  token: TokenType;
  spender: string;
  amount: string;
  label?: React.ReactNode;
  allowance?: string;
  balance?: string;
  onSubmit: () => void;
  tx?: TxHookResponse;
};

// todo clean up it a little bit by splitting to smaller components
const ApproveTokenButton: React.FC<Props> = ({
  onSubmit,
  token,
  spender,
  tx,
  ...props
}) => {
  const { address: owner } = useContext(AppContext);
  const { symbol, address, decimals, native } = token;
  const [state, setState] = useState({
    balance: props.balance,
    allowance: props.allowance,
  });
  const [inApprove, setInApprove] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [form, setForm] = useState({
    amount: weiToNumber(props.amount, 8, decimals),
    unlimited: true,
  });

  const [approve, approveTx] = useSendTx(() =>
    erc20Token.approve(address.toLowerCase(), spender.toLowerCase(), weiAmount),
  );

  useEffect(() => {
    setForm(prevState => ({
      ...prevState,
      amount: weiToNumber(props.amount, 8, decimals),
    }));
  }, [props.amount, decimals]);

  const retrievePoolData = useCallback(() => {
    if (!native) {
      const multiCallData: MultiCallData[] = [];

      if (props.allowance === undefined) {
        multiCallData.push({
          address,
          fnName: 'allowance(address,address)(uint256)',
          args: [owner, spender],
          key: 'allowance',
          parser: value => value[0].toString(),
        });
      }

      if (props.balance === undefined) {
        multiCallData.push({
          address,
          fnName: 'balanceOf(address)(uint256)',
          args: [owner],
          key: 'balance',
          parser: value => value[0].toString(),
        });
      }

      if (multiCallData.length) {
        contractReader
          .multiCall<{ allowance: string; balance: string }>(multiCallData)
          .then(({ returnData }) => {
            setState(returnData);
          })
          .catch(log.error);
      }
    }
  }, [native, address, spender, props.allowance, props.balance, owner]);

  const weiAmount = useWeiAmount(
    form.unlimited ? UNLIMITED_AMOUNT : form.amount || '0',
    decimals,
  );

  const allowance = useMemo(
    () =>
      (props.allowance === undefined ? state.allowance : props.allowance) ||
      '0',
    [props.allowance, state.allowance],
  );
  const balance = useMemo(
    () => (props.balance === undefined ? state.balance : props.balance) || '0',
    [props.balance, state.balance],
  );

  const isAllowanceSufficient = useMemo(() => {
    if (bignumber(allowance).greaterThanOrEqualTo(props.amount)) return true;
    return bignumber(allowance).greaterThanOrEqualTo(weiAmount);
  }, [allowance, weiAmount, props.amount]);
  const showApproveScreen = useMemo(
    () => !native && !isAllowanceSufficient,
    [native, isAllowanceSufficient],
  );

  const transaction = useMemo(() => {
    if (
      (inApprove || approveTx.status !== TxStatus.NONE || tx === undefined) &&
      !tx?.loading
    )
      return approveTx;
    return tx;
  }, [tx, approveTx, inApprove]);

  const allowanceButtonDisabled = useMemo(() => {
    if (transaction.loading) return true;

    if (!isOpen) {
      return !(
        bignumber(props.amount).greaterThan(0) &&
        bignumber(props.amount).lessThanOrEqualTo(balance)
      );
    }
    return !bignumber(weiAmount).greaterThan(0);
  }, [props.amount, weiAmount, balance, isOpen, transaction.loading]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value;
      setForm(prevState => ({ ...prevState, amount: value }));
    },
    [],
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    approveTx.clear();
    tx?.clear();
  }, [approveTx, tx]);

  const handleApproveClick = useCallback(async () => {
    setInApprove(true);
    if (!isOpen) {
      setOpen(true);
      return;
    }

    await approve();
  }, [isOpen, approve]);

  const handleSubmitClick = useCallback(() => {
    setInApprove(false);
    handleClose();
    onSubmit();
  }, [handleClose, onSubmit]);

  useEffect(() => {
    retrievePoolData();
    AppProvider.on(AppProviderEvents.REQUEST_UPDATE, retrievePoolData);
    return () => {
      AppProvider.off(AppProviderEvents.REQUEST_UPDATE, retrievePoolData);
    };
  }, [retrievePoolData]);

  useEffect(() => {
    if (tx?.loading) {
      setOpen(true);
    }
  }, [tx?.loading]);

  return (
    <>
      <InDialogApproveModal
        isOpen={isOpen}
        onClose={handleClose}
        tx={transaction}
        noStatus={
          showApproveScreen && (
            <>
              <p className="mb-3">
                Allow {symbol} tokens to be spend by{' '}
                <AddressLink address={spender} />.
              </p>
              <Input
                type="number"
                readOnly={form.unlimited}
                value={form.amount}
                onChange={handleInputChange}
              />
              <label className="mt-2 flex flex-row space-x-2 items-center justify-start">
                <input
                  type="checkbox"
                  checked={form.unlimited}
                  onChange={() =>
                    setForm(value => ({
                      ...value,
                      unlimited: !value.unlimited,
                    }))
                  }
                />
                <span>
                  Allow spender to use{' '}
                  <Popover content={`10 million ${symbol} actually.`}>
                    <span className="cursor-pointer">unlimited amount</span>
                  </Popover>
                  .
                </span>
              </label>
            </>
          )
        }
      >
        {tx?.status === TxStatus.TX_CONFIRMED ? (
          <Button
            type="button"
            text="Continue"
            className="w-full z-20 relative"
            onClick={handleClose}
          />
        ) : (
          <>
            {showApproveScreen ? (
              <Button
                type="button"
                text={`Approve ${symbol}`}
                className="w-full z-20 relative"
                onClick={handleApproveClick}
                loading={transaction.loading}
                disabled={allowanceButtonDisabled || transaction.loading}
              />
            ) : (
              <Button
                type="button"
                text={props.label}
                className="w-full z-20 relative"
                onClick={handleSubmitClick}
                loading={transaction.loading}
                disabled={props.amount <= '0' || transaction.loading}
              />
            )}
          </>
        )}
      </InDialogApproveModal>
    </>
  );
};

ApproveTokenButton.defaultProps = {
  label: 'Submit',
};

export default ApproveTokenButton;
