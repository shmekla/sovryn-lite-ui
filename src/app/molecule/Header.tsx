import React, { useCallback } from 'react';
import { ReactComponent as Logo } from 'assets/bitcoin-btc-logo.svg';
import HeaderNavigation from '../atom/HeaderNavigation';
import UserWalletContainer from './UserWalletContainer';
import AppProvider from '../../utils/AppProvider';

export default function Header() {

  const forceRefresh = useCallback(() => {
    AppProvider.requestUpdate();
  }, []);

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
            <button onClick={forceRefresh}>
              <svg viewBox="0 0 24 24" width={24} height={24}>
                <circle cx="12" cy="12" r="12" strokeWidth={5} stroke="white" strokeLinecap="round" fill="none" />
                <circle cx="12" cy="12" r="12" strokeWidth={5} stroke="white" strokeLinecap="round" fill="none" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
