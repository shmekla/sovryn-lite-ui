import React from 'react';
import cn from 'classnames';
import { prettyTx } from '../../utils/prettyTx';

type Props = {
  address: string;
  balance: string;
};

const EngagedWalletHeaderButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & Props> = ({ address, balance, className, ...props }) => {
  return (
    <button
      className={cn('bg-gray-300 dark:bg-white dark:bg-opacity-25 text-white py-1 pl-2 pr-1 flex flex-row justify-between items-center space-x-4 rounded-lg transition duration-300', className)}
      {...props}
    >
      <span>{(Number(balance) / 1e18).toFixed(4)} RBTC</span>
      <span className="inline-block px-2 rounded bg-gray-600 rounded-lg">{prettyTx(address)}</span>
    </button>
  );
};

export default EngagedWalletHeaderButton;
