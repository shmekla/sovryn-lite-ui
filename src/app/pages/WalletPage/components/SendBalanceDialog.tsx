import React, { useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { bignumber } from 'mathjs';
import { WalletToken } from '../types';
import AmountInputGroup from '../../../molecule/AmountInputGroup';
import TransferButton from '../../../molecule/TransferButton';
import { Dialog } from '../../../molecule/Dialog';
import { useSendTx } from '../../../hooks/useSendTx';
import erc20Token from '../../../../utils/blockchain/erc20Token';
import { useWeiAmount } from '../../../hooks/useWeiAmount';
import contractReader from '../../../../utils/contractReader';
import { AddressInputGroup } from '../../../molecule/AddressInputGroup';

type Props = {
  token: WalletToken;
  balance: string;
  isOpen: boolean;
  onClose: () => void;
};

export const SendBalanceDialog: React.FC<Props> = ({ token, ...props }) => {
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');

  const weiAmount = useWeiAmount(amount, token.decimals);

  const [send, tx] = useSendTx(() =>
    token.native
      ? contractReader.sendNative(receiver, weiAmount)
      : erc20Token.transfer(token.address, receiver, weiAmount),
  );

  const valid = useMemo(() => {
    if (!ethers.utils.isAddress(receiver.toLowerCase())) return false;
    return weiAmount !== '' && bignumber(weiAmount).greaterThanOrEqualTo(0);
  }, [weiAmount, receiver]);

  return (
    <Dialog isOpen={props.isOpen} onClose={props.onClose}>
      <>
        {props.isOpen && (
          <>
            <div className='flex justify-between items-center mb-2'>
              <div>Transfer Asset</div>
            </div>
            <div className='mb-3'>
              <label>Receiver:</label>
              <AddressInputGroup value={receiver} onChange={setReceiver} />
            </div>
            <div className='mb-3'>
              <label>Amount:</label>
              <AmountInputGroup
                value={amount}
                onChange={setAmount}
                maxAmount={props.balance || '0'}
                token={token?.id}
              />
            </div>
            <TransferButton
              label='Transfer'
              onSubmit={send}
              token={token}
              balance={props.balance}
              tx={tx}
              amount={weiAmount}
              valid={valid}
            />
          </>
        )}
      </>
    </Dialog>
  );
};
