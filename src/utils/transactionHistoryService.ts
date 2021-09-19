import { EventBag } from './eventBag';
import { Nullable } from '../types/nullable';
import { TOKEN } from '../types/token';

type Transaction = {
  hash: string;
  nonce: number;
  type: string;
  value: string;
  data: string;
  token: Nullable<TOKEN>;
};

const transactionHistoryService = new class TransactionHistoryService extends EventBag<'updated'> {

  private _transactions: Transaction[] = [];

  public get transactions() {
    return this._transactions;
  }

  public add(tx: Transaction) {
    this._transactions.push(tx);
    this.emit('updated');
  }


}();

export default transactionHistoryService;
