import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import log from 'loglevel';
import { bignumber } from 'mathjs';
import Button from '../atom/Button';
import { TokenType } from '../../types/token';
import contractReader from '../../utils/contractReader';
import AppContext from '../../context/app-context';
import { TxHookResponse, TxStatus } from '../hooks/useSendTx';
import { InDialogApproveModal } from './InDialogApproveModal';
import AppProvider, { AppProviderEvents } from '../../utils/AppProvider';

type Props = {
  token: TokenType;
  amount: string;
  label?: React.ReactNode;
  balance?: string;
  onSubmit: () => void;
  tx: TxHookResponse;
  valid?: boolean;
};

const TransferButton: React.FC<Props> = ({ onSubmit, token, tx, ...props }) => {
  const { address: owner } = useContext(AppContext);
  const { address, native } = token;
  const [isOpen, setOpen] = useState(false);
  const [_balance, setBalance] = useState('0');

  const retrieveData = useCallback(() => {
    if (!native) {
      if (props.balance === undefined) {
        contractReader
          .call(address, 'balanceOf(address)(uint256)', [owner])
          .then(result => setBalance(result.toString))
          .catch(log.error);
      }
    }
  }, [native, address, props.balance, owner]);

  const balance = useMemo(
    () => (props.balance === undefined ? _balance : props.balance) || '0',
    [props.balance, _balance],
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    tx?.clear();
  }, [tx]);

  const handleSubmitClick = useCallback(() => {
    handleClose();
    onSubmit();
  }, [handleClose, onSubmit]);

  useEffect(() => {
    retrieveData();
    AppProvider.on(AppProviderEvents.REQUEST_UPDATE, retrieveData);
    return () => {
      AppProvider.off(AppProviderEvents.REQUEST_UPDATE, retrieveData);
    };
  }, [retrieveData]);

  useEffect(() => {
    if (tx?.loading) {
      setOpen(true);
    }
  }, [tx?.loading]);

  const disabled = useMemo(
    () =>
      tx.loading ||
      (props.valid !== undefined
        ? !props.valid
        : bignumber(props.amount).lessThanOrEqualTo(0) ||
          bignumber(props.amount).lessThanOrEqualTo(balance)),
    [props.amount, tx.loading, balance, props.valid],
  );

  return (
    <>
      <InDialogApproveModal isOpen={isOpen} onClose={handleClose} tx={tx}>
        {tx?.status === TxStatus.TX_CONFIRMED ? (
          <Button
            type="button"
            text="Continue"
            className="w-full z-20 relative"
            onClick={handleClose}
          />
        ) : (
          <>
            <Button
              type="button"
              text={props.label}
              className="w-full z-20 relative"
              onClick={handleSubmitClick}
              loading={tx.loading}
              disabled={disabled}
            />
          </>
        )}
      </InDialogApproveModal>
    </>
  );
};

TransferButton.defaultProps = {
  label: 'Submit',
};

export default TransferButton;
