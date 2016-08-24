export class PropertySpy {

  private _originialGetter: () => any;
  private _originialSetter: (value: any) => void;
  private _value: any;

  public constructor(target: any, functionName: string) {

     this._originialGetter = Object.getOwnPropertyDescriptor(target, functionName).get;
     this._originialSetter = Object.getOwnPropertyDescriptor(target, functionName).set;

     Object.defineProperty(target, functionName, {
       get: this._get,
       set: this._originialSetter
     });
  }

  private _get() {
    return this._value;
  }
}
