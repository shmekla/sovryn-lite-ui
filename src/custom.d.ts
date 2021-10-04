import type { log } from 'loglevel';

export declare global {
  declare interface Window {
    ethereum?: EthereumProvider;
    NativeApp?: boolean;
    web3?: any;
    log?: log;
  }

  export interface RequestArguments {
    method: string;
    params?: unknown[] | Record<string, unknown>;
  }

  declare interface EthereumProvider {
    chainId: string | null;
    selectedAddress: string | null;
    isMetaMask?: boolean;
    isConnected(): boolean;
    request<T>(args: RequestArguments): Promise<Maybe<T>>;
    enable(): Promise<string[]>;
    on(event: 'accountsChanged', handler: (accounts: string[]) => void): void;
    on(event: 'chainChanged', handler: (chainId: string) => void);
    on(event: 'message', handler: (message: any) => void);
  }
}
