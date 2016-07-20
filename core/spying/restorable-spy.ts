import { Spy } from "./spy";

export class RestorableSpy extends Spy {

   private _functionName: string;
   private _target: any;

   public constructor(target: any, functionName: string) {
      super(target[functionName], target);

      this._functionName = functionName;
      this._target = target;
   }

   public restore() {
      this._target[this._functionName] = this.originalFunction;
   }
}
