import { SpyCall } from "./spy-call";

export class PropertySpy<PropertyType> {

   private _originialGetter: () => PropertyType;
   private _originialSetter: (value: PropertyType) => void;
   private _value: PropertyType;
   private _getCalls: Array<SpyCall> = [];
   private _setCalls: Array<SpyCall> = [];
   private _descriptorTarget: any;
   private _getter: () => PropertyType;
   private _returnValue: boolean;

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

      this._originialGetter = propertyDescriptor.get;
      this._originialSetter = propertyDescriptor.set;
      this._getter = this._originialGetter;

      Object.defineProperty(this._descriptorTarget, propertyName, {
         get: this._get.bind(this),
         set: this._set.bind(this)
      });
   }

   private _get() {
      this._getCalls.push(new SpyCall([]));

      if (this._returnValue) {
         return this._value;
      }

      return this._getter.call(this._descriptorTarget);
   }

   private _set(value: PropertyType) {
      this._setCalls.push(new SpyCall([ value ]));
      this._value = value;
   }

   public andReturnValue(value: PropertyType): PropertySpy<PropertyType> {
      this._value = value;
      this._returnValue = true;
      return this;
   }

   public andCallGetter(getter: () => PropertyType): PropertySpy<PropertyType> {
      this._getter = getter;
      this._returnValue = false;
      return this;
   }
}
