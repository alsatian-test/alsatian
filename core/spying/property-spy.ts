export class PropertySpy<PropertyType> {

  private _originialGetter: () => PropertyType;
  private _originialSetter: (value: PropertyType) => void;
  private _value: PropertyType;

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

  private _set(value: PropertyType) {
    this._value = value;
  }
}
