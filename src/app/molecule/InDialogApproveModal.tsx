import React, { useMemo, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import cn from 'classnames';
import { ReactComponent as Close } from 'assets/icons/close.svg';
import { ReactComponent as Clock } from 'assets/icons/clock.svg';
import { ReactComponent as Refresh } from 'assets/icons/refresh.svg';
import { ReactComponent as Check } from 'assets/icons/check.svg';
import { TransactionLink } from '../atom/TransactionLink';
import { TxHookResponse, TxStatus } from '../hooks/useSendTx';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  tx: TxHookResponse;
  canCloseWhenPending?: boolean;
  noStatus?: React.ReactNode;
};

export const InDialogApproveModal: React.FC<Props> = ({
  isOpen,
  onClose,
  tx,
  canCloseWhenPending,
  ...props
}) => {
  const overlayRef = useRef<HTMLDivElement>(null!);
  const dialogRef = useRef<HTMLDivElement>(null!);

  const showCloseButton = useMemo(
    () =>
      !!canCloseWhenPending ||
      ![
        TxStatus.USER_PENDING,
        TxStatus.TX_PENDING,
        TxStatus.TX_BROADCASTING,
      ].includes(tx.status),
    [canCloseWhenPending, tx.status],
  );

  return (
    <div className="relative">
      <TransitionGroup appear={true} component={null}>
        {isOpen && (
          <CSSTransition
            key="overlay"
            classNames="overlay"
            timeout={300}
            nodeRef={overlayRef}
          >
            <div className="dialog--backdrop" ref={overlayRef} />
          </CSSTransition>
        )}
      </TransitionGroup>
      <div
        className={cn('approval-wrapper', isOpen && 'approval-wrapper--open')}
      >
        <TransitionGroup appear={true} component={null}>
          {isOpen && (
            <CSSTransition
              key="approval"
              classNames="approval"
              timeout={300}
              nodeRef={dialogRef}
            >
              <div className="approval z-20" ref={dialogRef}>
                <div className="relative px-12 py-10">
                  {showCloseButton && (
                    <button
                      type="button"
                      className="fill-current absolute top-2 right-2"
                      onClick={onClose}
                    >
                      <Close />
                    </button>
                  )}

                  {tx.status === TxStatus.NONE && props.noStatus}
                  {tx.status === TxStatus.USER_PENDING && (
                    <div className="flex flex-row justify-start items-center space-x-4">
                      <div className="w-16 h-16 flex justify-center items-center">
                        <Clock className="fill-current w-8 h-8 motion-safe:animate-ping" />
                      </div>
                      <div>
                        <p>Confirm transaction in your wallet.</p>
                      </div>
                    </div>
                  )}
                  {tx.status === TxStatus.TX_BROADCASTING && (
                    <div className="flex flex-row justify-start items-center space-x-4">
                      <div>
                        <Refresh className="fill-current w-16 h-16 animate-reverse-spin" />
                      </div>
                      <div>
                        <p>Broadcasting transaction to network.</p>
                        {tx.hash && <TransactionLink tx={tx.hash} />}
                      </div>
                    </div>
                  )}
                  {tx.status === TxStatus.TX_PENDING && (
                    <div className="flex flex-row justify-start items-center space-x-4">
                      <div>
                        <Refresh className="fill-current w-16 h-16 animate-reverse-spin" />
                      </div>
                      <div>
                        <p>Transaction pending for confirmation.</p>
                        {tx.hash && <TransactionLink tx={tx.hash} />}
                      </div>
                    </div>
                  )}
                  {tx.status === TxStatus.TX_CONFIRMED && (
                    <div className="flex flex-row justify-start items-center space-x-4 text-green-500">
                      <div className="w-16 h-16 flex justify-center items-center">
                        <Check className="fill-current w-8 h-8 motion-safe:animate-ping-once" />
                      </div>
                      <div>
                        <p>Transaction confirmed</p>
                        {tx.hash && <TransactionLink tx={tx.hash} />}
                      </div>
                    </div>
                  )}
                  {tx.status === TxStatus.TX_FAILED && (
                    <div className="flex flex-row justify-start items-center space-x-4 text-red-500">
                      <div>
                        <Close className="fill-current w-16 h-16 motion-safe:animate-ping-once" />
                      </div>
                      <div>
                        <p>Transaction failed:</p>
                        <p>{tx.error}</p>
                        {tx.hash && <TransactionLink tx={tx.hash} />}
                      </div>
                    </div>
                  )}
                  {tx.status === TxStatus.USER_DECLINED && (
                    <div className="flex flex-row justify-start items-center space-x-4 text-red-500">
                      <div>
                        <Close className="fill-current w-16 h-16 motion-safe:animate-ping-once" />
                      </div>
                      <div>
                        <p>Transaction rejected:</p>
                        <p>{tx.error}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
      {props.children}
    </div>
  );
};
