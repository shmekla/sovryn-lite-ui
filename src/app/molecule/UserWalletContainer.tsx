import React, { useCallback, useContext } from 'react';
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

  return (
    <div className="hidden sm:block">
      {address && <EngagedWalletHeaderButton address={address} balance={balance} onClick={handleDisconnection} />}
      {!address && <><EngageWalletHeaderButton onClick={handleConnection}/></>}
    </div>
  );
}
