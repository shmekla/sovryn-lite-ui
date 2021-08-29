import { EventBag } from './eventBag';

export enum AppProviderEvents {
  REQUEST_UPDATE = 'update_request',
}

const AppProvider = new class AppProvider extends EventBag {

  public readonly updateTimer: number = 30000; // 30 seconds
  private _lastUpdateRequest: number = Date.now();
  private _requestUpdateTimeout: number = 0;

  constructor() {
    super();
    this.initCounter();
  }

  public get lastUpdateRequest(): number {
    return this._lastUpdateRequest;
  }

  public requestUpdate() {
    if (this._requestUpdateTimeout) {
      clearTimeout(this._requestUpdateTimeout);
    }
    this._lastUpdateRequest = Date.now();
    this.emit(AppProviderEvents.REQUEST_UPDATE, this._lastUpdateRequest);
    this.initCounter();
  }

  private initCounter() {
    this._requestUpdateTimeout = setTimeout(() => {
      this.requestUpdate();
    }, this.updateTimer) as unknown as number;
  }
}();

export default AppProvider;
