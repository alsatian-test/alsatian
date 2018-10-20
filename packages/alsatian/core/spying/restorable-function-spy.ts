import { FunctionSpy } from "../spying";
import { exposeSpyFunctions } from "./expose-spy-functions";

export class RestorableFunctionSpy extends FunctionSpy {
  private _originalFunction: (...args: Array<any>) => any;
  private _functionName: string;
  private _target: any;

  public constructor(target: any, functionName: string) {
    super();

    this._originalFunction = target[functionName];
    this.context = target;

    this._functionName = functionName;
    this._target = target;

    target[functionName] = this.call.bind(this);

    exposeSpyFunctions(target[functionName], this);

    // expose spy's restore function
    target[functionName].restore = this.restore.bind(this);
  }

  public restore() {
    this._target[this._functionName] = this._originalFunction;
  }

  public andCallThrough() {
    this.isStubbed = false;
  }

  public andStub() {
    this.isStubbed = true;
  }

  public call(...args: Array<any>) {
    const returnValue = super.call.apply(this, args);

    if (!this.isStubbed && !this.hasReturnValue) {
      return this._originalFunction.apply(this.context, args);
    }

    return returnValue;
  }
}
