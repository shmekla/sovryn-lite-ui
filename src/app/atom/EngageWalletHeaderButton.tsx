import React from 'react';
import cn from 'classnames';
import { ReactComponent as Icon } from 'assets/icons/account_balance.svg';

const EngageWalletHeaderButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, ...props }) => {
  return (
    <button
      className={cn(
        'bg-blue-600 bg-opacity-25 text-white py-3 px-4 flex flex-row justify-between items-center space-x-4 rounded transition duration-300 hover:bg-opacity-50',
        className,
      )}
      {...props}
    >
      <Icon className="fill-current" />
      <span className="hidden sm:block truncate">Engage Wallet</span>
    </button>
  );
};

export default EngageWalletHeaderButton;
