import { useCallback, useEffect, useState } from 'react';
import { Nullable } from '../../types/nullable';
import AppProvider, { AppProviderEvents } from '../../utils/AppProvider';
import contractReader from '../../utils/contractReader';

export enum TxStatus {
  NONE,
  USER_PENDING,
  USER_DECLINED,
  TX_BROADCASTING,
  TX_PENDING,
  TX_CONFIRMED,
  TX_FAILED,
}

export type TxHookActionResponse = {
  clear: () => void;
};

export type TxHookStateResponse =
  | {
      loading: boolean;
      status: TxStatus.NONE | TxStatus.USER_PENDING | TxStatus.USER_DECLINED;
      hash: null;
      error: Nullable<string>;
    }
  | {
      loading: boolean;
      status: TxStatus;
      hash: string;
      error: Nullable<string>;
    };

export type TxHookResponse = TxHookStateResponse & TxHookActionResponse;

export function useSendTx(
  callback: () => Promise<string>,
): [() => Promise<string>, TxHookResponse] {
  const [response, setResponse] = useState<TxHookStateResponse>({
    loading: false,
    status: TxStatus.NONE,
    hash: null,
    error: null,
  });
  const handleCallback = useCallback((): Promise<string> => {
    setResponse(prevState => ({
      ...prevState,
      loading: true,
      status: TxStatus.USER_PENDING,
    }));
    return callback()
      .then(hash => {
        setResponse(prevState => ({
          ...prevState,
          status: TxStatus.TX_PENDING,
          hash,
        }));
        return hash;
      })
      .catch(error => {
        const errorMessage =
          error?.code === 4001
            ? 'User denied transaction.'
            : error?.message || error.toString();
        setResponse(prevState => ({
          ...prevState,
          loading: false,
          status: TxStatus.USER_DECLINED,
          hash: null,
          error: errorMessage,
        }));
        throw error;
      });
  }, [callback]);

  const handleTransactionReceipt = useCallback(async () => {
    if (response.hash && response.status === TxStatus.TX_PENDING) {
      const receipt = await contractReader.receipt(response.hash);
      if (receipt !== null) {
        setResponse(
          prevState =>
            ({
              ...prevState,
              loading: false,
              status: receipt.status
                ? TxStatus.TX_CONFIRMED
                : TxStatus.TX_FAILED,
            } as TxHookResponse),
        );
      }
    }
  }, [response.status, response.hash]);

  const clear = useCallback(() => {
    console.log('clear called');
    setResponse(prevState => ({
      ...prevState,
      loading: false,
      status: TxStatus.NONE,
      hash: null,
      error: null,
    }));
  }, []);

  useEffect(() => {
    AppProvider.on(AppProviderEvents.REQUEST_UPDATE, handleTransactionReceipt);
    return () => {
      AppProvider.off(
        AppProviderEvents.REQUEST_UPDATE,
        handleTransactionReceipt,
      );
    };
  }, [handleTransactionReceipt]);

  return [handleCallback, { ...response, clear }];
}
