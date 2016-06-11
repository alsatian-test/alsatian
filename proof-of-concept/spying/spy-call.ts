export class SpyCall {

  private _args: Array<any>;
  public get args() {
    return this._args;
  }

  public constructor(args: Array<any>) {
    this._args = args;
  }
}
