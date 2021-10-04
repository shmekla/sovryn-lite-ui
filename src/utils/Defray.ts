import { getCurrentNetwork } from './network';
import { TransactionHistoryService } from './transactionHistoryService';

export class Defray {
  private static _instance: Defray;

  public readonly chainId: number;
  public readonly transactionHistory: TransactionHistoryService;

  constructor(chainId: number) {
    this.chainId = chainId;
    this.transactionHistory = new TransactionHistoryService();
  }

  public static Instance(): Defray {
    if (!this._instance) {
      this._instance = new Defray(getCurrentNetwork().id);
    }
    return this._instance;
  }
}
