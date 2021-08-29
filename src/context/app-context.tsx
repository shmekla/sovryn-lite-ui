import React, { useCallback, useEffect, useState } from 'react';
import walletService from '../utils/walletService';
import { NETWORK } from '../types/network';

type AppContextType = {
  address: string;
  balance: string;
  connected: boolean;
  network: NETWORK,
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

const AppContext = React.createContext<AppContextType & Partial<AppContextActionType>>(defaultValue);

export const AppContextProvider: React.FC = ({children}) => {

  const [value, setValue] = useState<AppContextType>(defaultValue);

  const setAddress = useCallback((address: string) => {
    console.log('address changed', address);
    setValue(prevState => ({...prevState, address, connected: !!address }));
  }, []);

  const setNetwork = useCallback((network: NETWORK) => {
    console.log('network changed', network);
    setValue(prevState => ({...prevState, network}));
  }, []);

  const setBalance = useCallback((balance: string) => {
    console.log('balance changed', balance);
    setValue(prevState => ({...prevState, balance}));
  }, []);

  const handleAddressChange = useCallback(async (address: string) => {
    setAddress(address);
    if (address) {
      const result: string = await walletService.provider.request({ method: 'eth_getBalance', params: [address, 'latest' ]});
      setBalance(Number(result).toString());
    } else {
      setBalance('0');
    }
  }, [setAddress, setBalance]);

  const handleNetworkChange = useCallback(async (network: string) => {
    console.log('handle network change', network);
    // setAddress(address);
    // if (address) {
    //   const result: string = await walletService.provider.request({ method: 'eth_getBalance', params: [address, 'latest' ]});
    //   setBalance(Number(result).toString());
    // } else {
    //   setBalance('0');
    // }
  }, []);

  useEffect(() => {
    walletService.on('addressChanged', handleAddressChange);
    walletService.on('chainChanged', handleNetworkChange);
    return () => {
      walletService.off('addressChanged', handleAddressChange);
      walletService.off('chainChanged', handleNetworkChange);
    };
  }, [handleAddressChange, handleNetworkChange]);

  return (<AppContext.Provider value={{...value, setAddress, setBalance, setNetwork}}>{children}</AppContext.Provider>);
};

export default AppContext;
