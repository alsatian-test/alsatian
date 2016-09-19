import { SpyCall } from "./spy-call";

export class PropertySpy<PropertyType> {

   private _originialGetter: () => PropertyType;
   private _originialSetter: (value: PropertyType) => void;
   private _value: PropertyType;
   private _descriptorTarget: any;
   private _getter: () => PropertyType;
   private _setter: (value: PropertyType) => void;
   private _returnValue: boolean;
   private _propertyName: string;

   private _getCalls: Array<SpyCall> = [];
   public get getCalls() {
      return this._getCalls;
   }

   private _setCalls: Array<SpyCall> = [];
   public get setCalls() {
      return this._setCalls;
   }

   public constructor(target: any, propertyName: string) {

      this._descriptorTarget = target;
      this._propertyName = propertyName;

      // for TypeScript may need to search target.constructor.prototype for propertyDescriptor
      if (!Object.getOwnPropertyDescriptor(target, this._propertyName)) {
         this._descriptorTarget = target.constructor.prototype;
      }

      const propertyDescriptor = Object.getOwnPropertyDescriptor(this._descriptorTarget, this._propertyName);

      if (propertyDescriptor === undefined) {
         throw new TypeError(`${propertyName} is not a property.`);
      }

      this._originialGetter = propertyDescriptor.get;
      this._originialSetter = propertyDescriptor.set;

      this._getter = this._originialGetter;
      this._setter = this._originialSetter;

      Object.defineProperty(this._descriptorTarget, this._propertyName, {
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

      this._setter.call(this._descriptorTarget, value);

      if (!this._returnValue) {
         this._value = value;
      }
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

   public andCallSetter(setter: (value: PropertyType) => void): PropertySpy<PropertyType> {
      this._setter = setter;
      this._returnValue = false;
      return this;
   }

   public restore() {
      Object.defineProperty(this._descriptorTarget, this._propertyName, {
         get: this._originialGetter,
         set: this._originialSetter
      });
   }
}
