import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import cn from 'classnames';
import { bignumber } from 'mathjs';
import Button from '../atom/Button';
import { TOKEN } from '../../types/token';
import { getToken, weiToNumber } from '../../utils/helpers';
import contractReader, { MultiCallData } from '../../utils/contractReader';
import AppContext from '../../context/app-context';
import { AddressLink } from '../atom/AddressLink';
import Input from '../atom/Input';
import { ReactComponent as Close } from '../../assets/icons/close.svg';
import { useWeiAmount } from '../hooks/useWeiAmount';
import erc20Token from '../../utils/blockchain/erc20Token';

const UNLIMITED_AMOUNT = '10000000';

type Props = {
  token: TOKEN;
  spender: string;
  amount: string;
  label?: React.ReactNode;
  allowance?: string;
  balance?: string;
  onSubmit: () => void;
};

const ApproveTokenButton: React.FC<Props> = ({ onSubmit, token, spender, ...props }) => {

  const { address: owner } = useContext(AppContext);
  const { symbol, address, decimals, native } = getToken(token);
  const [state, setState] = useState({ balance: props.balance, allowance: props.allowance });
  const [isOpen, setOpen] = useState(false);
  const [form, setForm] = useState({
    amount: weiToNumber(props.amount, 8, decimals),
    unlimited: false,
  });

  const overlayRef = useRef<HTMLDivElement>(null!);
  const dialogRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    setForm(prevState => ({ ...prevState, amount: weiToNumber(props.amount, 8, decimals) }));
  }, [props.amount, decimals]);

  useEffect(() => {
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
        contractReader.multiCall<{ allowance: string; balance: string }>(multiCallData).then(({ returnData }) => {
          setState(returnData);
        }).catch(console.error);
      }
    }
  }, [native, address, spender, props.allowance, props.balance, owner]);

  const weiAmount = useWeiAmount(form.unlimited ? UNLIMITED_AMOUNT : (form.amount || '0'), decimals);

  const allowance = useMemo(() => ((props.allowance === undefined) ? state.allowance : props.allowance) || '0', [props.allowance, state.allowance]);
  const balance = useMemo(() => ((props.balance === undefined) ? state.balance : props.balance) || '0', [props.balance, state.balance]);

  const isAllowanceSufficient = useMemo(() => bignumber(allowance).greaterThanOrEqualTo(weiAmount), [allowance, weiAmount]);

  const allowanceButtonDisabled = useMemo(() => {
    if (!isOpen) {
      return !(bignumber(props.amount).greaterThan(0) && bignumber(props.amount).lessThanOrEqualTo(balance));
    }
    return !bignumber(weiAmount).greaterThan(0);
  }, [props.amount, weiAmount, balance, isOpen]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setForm(prevState => ({...prevState, amount: value }));
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClick = useCallback(async () => {
    if (!isOpen) {
      setOpen(true);
      return;
    }

    erc20Token.approve(address.toLowerCase(), spender.toLowerCase(), weiAmount).then(result => console.log(result)).catch(error => console.error(error));

  }, [isOpen, address, spender, weiAmount]);

  return (
    <div className="relative">
      <TransitionGroup appear={true} component={null}>
        {isOpen && (
          <CSSTransition key="overlay" classNames="overlay" timeout={300} nodeRef={overlayRef}>
            <div className="dialog--backdrop" ref={overlayRef}/>
          </CSSTransition>
        )}
      </TransitionGroup>
      <div className={cn("approval-wrapper", isOpen && 'approval-wrapper--open')}>
        <TransitionGroup appear={true} component={null}>
          {isOpen && (
            <CSSTransition key="approval" classNames="approval" timeout={30000} nodeRef={dialogRef}>
              <div className="approval z-20" ref={dialogRef}>
                <div className="relative px-12 py-10">
                  <button type="button" className="fill-current absolute top-2 right-2" onClick={handleClose}>
                    <Close/>
                  </button>

                  <p className="mb-3">
                    Allow {symbol} tokens to be spend by <AddressLink address={spender}/>.
                  </p>
                  <Input type="number" readOnly={form.unlimited} value={form.amount} onChange={handleInputChange}/>
                  <label className="mt-2 flex flex-row space-x-2 items-center justify-start">
                    <input type="checkbox" value={String(form.unlimited)}
                           onChange={() => setForm(value => ({ ...value, unlimited: !value.unlimited }))}/>
                    <span>Allow spender to use <span
                      title={`10 million ${symbol} actually.`}>unlimited amount</span>.</span>
                  </label>
                </div>
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
        {!native && !isAllowanceSufficient ?
          <Button type="button" text={`Approve ${symbol}`} className="w-full z-20 relative" onClick={handleClick} disabled={allowanceButtonDisabled}/> :
          <Button type="button" text={props.label} className="w-full z-20 relative" onClick={onSubmit}/>}
    </div>
  );

};

ApproveTokenButton.defaultProps = {
  label: 'Submit',
};

export default ApproveTokenButton;
