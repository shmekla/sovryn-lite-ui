import type { TransactionRequest } from '@ethersproject/abstract-provider';
import { NETWORK } from 'types/network';
import { EventBag } from './eventBag';
import { getCurrentNetwork } from './network';

const walletService = new class WalletService extends EventBag {
  private _network: NETWORK;
  private _address: string;
  private _provider!: InPageProvider;

  constructor() {
    super();

    this._network = getCurrentNetwork().id;
    this._address = '';

    const { ethereum, web3 } = window;

    if (ethereum) {
      if (web3) {
        // Overwriting injected web3 with never provider version.
        // window.web3 = new Web3(ethereum);
      }

      this.setProvider(ethereum);
    } else if (web3) {
      if (!web3 || !web3.currentProvider || !web3.currentProvider.sendAsync) {
        throw new Error(
          'Web3 not found. Please check that MetaMask is installed',
        );
      }
      this.setProvider(web3.currentProvider);
    }
  }

  public get address() {
    return this._address;
  }

  public get provider() {
    return this._provider;
  }

  public get network() {
    return this._network;
  }

  public connect() {
    this.emit('connect');
    return this.provider.request({ method: 'eth_requestAccounts' }).then(async result => {
      try {
        this.setAddress(result[0]);
        this.emit('connected', result[0]);
        return true;
      } catch (e) {
        this.setAddress('');
        if (e.data?.error?.code === -32601) {
          return false;
        }
        throw e;
      }
    })
      .catch(error => {
        if (error.code === 4001) {
          console.error('Connection rejected by user.');
        } else {
          console.error('Failed to connect', error);
        }
        this.setAddress('');
        return false;
      });
  }

  public disconnect() {
    this.setAddress('');
  }

  public setAddress(address: string) {
    this._address = address;
    this.emit('addressChanged', this._address);
  }

  public setProvider(provider: InPageProvider) {
    this._provider = provider;
    this.emit('providerChanged', this._provider);
  }

  public sendTransaction(tx: TransactionRequest) {
    return this.provider.request({
      method: 'eth_sendTransaction',
      params: [tx],
    });
  }

}();

export default walletService;


