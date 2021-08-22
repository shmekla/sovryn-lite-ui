import { EventBag } from './eventBag';

export enum AppProviderEvents {
  REQUEST_UPDATE = 'update_request',
}

const AppProvider = new class AppProvider extends EventBag {

  private updateTimer: number = 30000; // 30 seconds
  private lastUpdateRequest: number = new Date().getTime();
  private requestUpdateTimeout: number = 0;

  constructor() {
    super();
    this.initCounter();
  }

  public requestUpdate() {
    if (this.requestUpdateTimeout) {
      clearTimeout(this.requestUpdateTimeout);
    }
    this.lastUpdateRequest = new Date().getTime();
    this.emit(AppProviderEvents.REQUEST_UPDATE, this.lastUpdateRequest);
    this.initCounter();
  }

  private initCounter() {
    this.requestUpdateTimeout = setTimeout(() => {
      this.requestUpdate();
    }, this.updateTimer) as unknown as number;
  }
}();

export default AppProvider;
