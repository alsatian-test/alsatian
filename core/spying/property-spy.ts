import { SpyCall } from "./spy-call";

export class PropertySpy<PropertyType> {

   private _originialGetter: () => PropertyType;
   private _originialSetter: (value: PropertyType) => void;
   private _value: PropertyType;
   private _getCalls: Array<SpyCall> = [];
   private _setCalls: Array<SpyCall> = [];
   private _descriptorTarget: any;

   public constructor(target: any, propertyName: string) {

      this._descriptorTarget = target;

      // for TypeScript may need to search target.constructor.prototype for propertyDescriptor
      if (!Object.getOwnPropertyDescriptor(target, propertyName)) {
         this._descriptorTarget = target.constructor.prototype;
      }

      const propertyDescriptor = Object.getOwnPropertyDescriptor(this._descriptorTarget, propertyName);

      if (propertyDescriptor === undefined) {
         throw new TypeError(`${propertyName} is not a property.`);
      }

      this._value = target[propertyName];


      this._originialGetter = propertyDescriptor.get;
      this._originialSetter = propertyDescriptor.set;

      //Object.getOwnPropertyDescriptor(target, propertyName).get = this._get;
      ///Object.getOwnPropertyDescriptor(target, propertyName).set = this._set;
      Object.defineProperty(this._descriptorTarget, propertyName, {
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
      return this;
   }
}
