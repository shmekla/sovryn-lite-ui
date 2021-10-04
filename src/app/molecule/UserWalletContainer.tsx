import React, { useCallback, useContext, useEffect } from 'react';
import log from 'loglevel';
import detectEthereumProvider from '@metamask/detect-provider';
import AppContext from '../../context/app-context';
import walletService from '../../utils/walletService';
import EngageWalletHeaderButton from '../atom/EngageWalletHeaderButton';
import EngagedWalletHeaderButton from '../atom/EngagedWalletHeaderButton';

export default function UserWalletContainer() {
  const { address, balance } = useContext(AppContext);

  const handleConnection = useCallback(async () => {
    await walletService.connect();
  }, []);

  const handleDisconnection = useCallback(async () => {
    await walletService.disconnect();
  }, []);

  useEffect(() => {
    detectEthereumProvider()
      .then(() => {
        log.info('Ethereum provider detected, auto-connect.');
        return handleConnection();
      })
      .catch(log.error);

    // console.log(window.ethereum);
    // if (window.ethereum && window.NativeApp) {
    //   alert(window.NativeApp);
    //   handleConnection().catch(log.error);
    // }
  }, [handleConnection]);

  return (
    <div>
      {address && (
        <EngagedWalletHeaderButton
          address={address}
          balance={balance}
          onClick={handleDisconnection}
        />
      )}
      {!address && (
        <>
          <EngageWalletHeaderButton onClick={handleConnection} />
        </>
      )}
    </div>
  );
}
