import React from 'react';
import { ReactComponent as Logo } from 'assets/bitcoin-btc-logo.svg';
import HeaderNavigation from '../atom/HeaderNavigation';
import UserWalletContainer from './UserWalletContainer';
import RequestUpdateButton from './RequestUpdateButton';

export default function Header() {
  return (
    <header className="mb-12 flex-grow-0 flex-shrink-0">
      <div className="container py-3">
        <div className="flex space-x-8 justify-between items-center">
          <div className="flex justify-start items-center space-x-8">
            <Logo className="w-12 h-12 " />
            <HeaderNavigation />
          </div>
          <div className="flex flex-row space-x-4 justify-end items-center">
            <UserWalletContainer />
            <RequestUpdateButton />
          </div>
        </div>
      </div>
    </header>
  );
}
