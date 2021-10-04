export abstract class EventBag<T = string> {
  private _emitters: { [key: string]: Array<any> } = {};

  public on = <A = Function>(event: T, callback: A) => {
    const key = event as unknown as string;
    if (!this._emitters[key]) {
      this._emitters[key] = [];
    }
    this._emitters[key].push(callback);
  };

  public off = <A = Function>(event: T, callback?: A) => {
    const key = event as unknown as string;
    if (this._emitters.hasOwnProperty(key)) {
      if (!callback) {
        this._emitters[key] = [];
      } else {
        this._emitters[key] = this._emitters[key].filter(
          item => item !== callback,
        );
      }
    }
  };

  protected emit(event: T, ...values: any) {
    const key = event as unknown as string;
    if (this._emitters[key]) {
      for (const i in this._emitters[key]) {
        if (this._emitters[key].hasOwnProperty(i)) {
          this._emitters[key][i](...values);
        }
      }
    }
  }
}
