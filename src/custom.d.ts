export declare global {
  declare interface Window {
    ethereum?: InPageProvider;
    web3?: any;
  }

  export interface RequestArguments {
    method: string;
    params?: unknown[] | Record<string, unknown>;
  }

  declare interface InPageProvider {
    chainId: string | null;
    selectedAddress: string | null;
    isConnected(): boolean;
    request<T>(args: RequestArguments): Promise<Maybe<T>>;
    on(event: 'accountsChanged', handler: (accounts: string[]) => void): void;
    on(event: 'chainChanged', handler: (chainId: string) => void);
    on(event: 'message', handler: (message: any) => void);
  }
}
