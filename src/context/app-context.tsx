import React, { useCallback, useEffect, useState } from 'react';
import log from 'loglevel';
import walletService from '../utils/walletService';
import { NETWORK } from '../types/network';
import AppProvider, { AppProviderEvents } from '../utils/AppProvider';
import contractReader from '../utils/contractReader';

type AppContextType = {
  address: string;
  balance: string;
  connected: boolean;
  network: NETWORK;
};

type AppContextActionType = {
  setAddress: (address: string) => void;
  setNetwork: (network: NETWORK) => void;
  setBalance: (balance: string) => void;
};

const defaultValue: AppContextType = {
  address: '',
  balance: '0',
  connected: false,
  network: NETWORK.RSK,
};

const AppContext = React.createContext<
  AppContextType & Partial<AppContextActionType>
>(defaultValue);

export const AppContextProvider: React.FC = ({ children }) => {
  const [value, setValue] = useState<AppContextType>(defaultValue);

  const setAddress = useCallback((address: string) => {
    log.info('address changed', address);
    setValue(prevState => ({ ...prevState, address, connected: !!address }));
  }, []);

  const setNetwork = useCallback((network: NETWORK) => {
    log.info('network changed', network);
    setValue(prevState => ({ ...prevState, network }));
  }, []);

  const setBalance = useCallback((balance: string) => {
    log.info('balance changed', balance);
    setValue(prevState => ({ ...prevState, balance }));
  }, []);

  const getBalance = useCallback(
    async (address?: string) => {
      if (address || value.address) {
        const result: string = await contractReader.balance(
          address || value.address,
        );
        setBalance(result);
      } else {
        setBalance('0');
      }
    },
    [value.address, setBalance],
  );

  const handleAddressChange = useCallback(
    async (address: string) => {
      setAddress(address);
      await getBalance(address);
    },
    [setAddress, getBalance],
  );

  const handleNetworkChange = useCallback(async (network: string) => {
    log.info('handle network change', network);
  }, []);

  useEffect(() => {
    walletService.on('addressChanged', handleAddressChange);
    walletService.on('chainChanged', handleNetworkChange);
    return () => {
      walletService.off('addressChanged', handleAddressChange);
      walletService.off('chainChanged', handleNetworkChange);
    };
  }, [handleAddressChange, handleNetworkChange]);

  // todo should be somewhere else.
  useEffect(() => {
    AppProvider.on(AppProviderEvents.REQUEST_UPDATE, () => getBalance());
    return () => {
      AppProvider.off(AppProviderEvents.REQUEST_UPDATE, () => getBalance());
    };
  }, [getBalance]);

  return (
    <AppContext.Provider
      value={{ ...value, setAddress, setBalance, setNetwork }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
