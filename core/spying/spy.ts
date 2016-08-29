import { SpyCall } from "../_spying";

export class Spy {

  protected originalFunction: (...args: Array<any>) => any;
  private _returnValue: any;
  private _hasReturnValue: boolean;
  private _isStubbed: boolean;
  private _originalContext: any;
  private _fakeFunction: Function;

  private _calls: Array<SpyCall> = [];
  public get calls() {
    return this._calls;
  }

  public constructor(originalFunction: (...args: Array<any>) => any, originalContext: any) {
    this.originalFunction = originalFunction;
    this._originalContext = originalContext;
  }

  public call(...args: Array<any>) {

    this.calls.push(new SpyCall(args));

    let returnValue: any;

    if (!this._isStubbed) {
      returnValue = this.originalFunction.apply(this._originalContext, args);
    }
    else if (this._fakeFunction) {
      this._fakeFunction.apply(this._originalContext, args);
    }

    if (this._hasReturnValue) {
      return this._returnValue;
    }

    return returnValue;
  }

  public andReturn(returnValue: any) {
    this._returnValue = returnValue;
    this._hasReturnValue = true;
  }

  public andCallThrough() {
    this._isStubbed = false;
    this._fakeFunction = undefined;
  }

  public andStub() {
    this._isStubbed = true;
    this._fakeFunction = undefined;
  }

  public andCall(fakeFunction: Function) {
    this._isStubbed = true;
    this._fakeFunction = fakeFunction;
  }
}
