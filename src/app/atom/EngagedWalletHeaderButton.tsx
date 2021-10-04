import React from 'react';
import cn from 'classnames';
import { prettyTx } from '../../utils/prettyTx';
import { ReactComponent as WalletIcon } from '../../assets/icons/wallet.svg';
import { Link } from 'react-router-dom';

type Props = {
  address: string;
  balance: string;
};

const EngagedWalletHeaderButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & Props
> = ({ address, balance, className, ...props }) => {
  return (
    <div className='flex flex-row space-x-2 items-center justify-center'>
      <button
        className={cn(
          'bg-gray-300 dark:bg-white dark:bg-opacity-25 text-white py-1 pl-2 pr-1 flex flex-row justify-between items-center sm:space-x-4 rounded-lg transition duration-300',
          className,
        )}
        {...props}
      >
        <span className='hidden sm:block'>
          {(Number(balance) / 1e18).toFixed(4)} RBTC
        </span>
        <span className='inline-block px-2 rounded bg-gray-600 rounded-lg'>
          {prettyTx(address)}
        </span>
      </button>
      <Link
        to='/wallet'
        className='bg-gray-300 dark:bg-white dark:bg-opacity-25 text-white py-1 px-2 rounded-lg text-white'
      >
        <WalletIcon className='fill-current' />
      </Link>
    </div>
  );
};

export default EngagedWalletHeaderButton;
