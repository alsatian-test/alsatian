import { SpyCall } from "./spy-call";

export class PropertySpy<PropertyType> {

   private _originialGetter: () => PropertyType;
   private _originialSetter: (value: PropertyType) => void;
   private _value: PropertyType;
   private _getCalls: Array<SpyCall> = [];
   private _setCalls: Array<SpyCall> = [];

   public constructor(target: any, propertyName: string) {

      this._value = target[propertyName];

      // for TypeScript may need to search target.constructor.prototype for propertyDescriptor

      this._originialGetter = Object.getOwnPropertyDescriptor(target, propertyName).get;
      this._originialSetter = Object.getOwnPropertyDescriptor(target, propertyName).set;

      //Object.getOwnPropertyDescriptor(target, propertyName).get = this._get;
      ///Object.getOwnPropertyDescriptor(target, propertyName).set = this._set;
      Object.defineProperty(target, propertyName, {
         get: this._get.bind(this),
         set: this._set.bind(this)
      });

      /*target[propertyName].getCalls = this._getCalls;
      target[propertyName].setCalls = this._setCalls;*/
   }

   private _get() {
      this._getCalls.push(new SpyCall([]));
      return this._value;
   }

   private _set(value: PropertyType) {
      this._setCalls.push(new SpyCall([ value ]));
      this._value = value;
   }

   public andReturnValue(value: PropertyType) {
      this._value = value;
   }
}
