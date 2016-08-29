import { Spy } from "./spy";

export class RestorableSpy extends Spy {

   private _functionName: string;
   private _target: any;

   public constructor(target: any, functionName: string) {
      super(target[functionName], target);

      this._functionName = functionName;
      this._target = target;

      target[functionName] = this.call.bind(this);

      // expose spy's calls on function
      target[functionName].calls = this.calls;

      // expose spy's restore function
      target[functionName].restore = this.restore.bind(this);
   }

   public restore() {
      this._target[this._functionName] = this.originalFunction;
   }
}
