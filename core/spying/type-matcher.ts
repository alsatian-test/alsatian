import { ArgumentMatcher } from "./argument-matcher";

export class TypeMatcher extends ArgumentMatcher {

   private _type: new (...args: Array<any>) => Object;
   public get type() {
      return this._type;
   }

   public constructor(type: new (...args: Array<any>) => Object) {
      super();
      if (type === null || type === undefined) {
         throw new TypeError("type must not be null or undefined");
      }

      this._type = type;
   }

   public test(value: any) {
      if (this._type === String) {
         return typeof value === "string" || value instanceof this._type;
      }
      else if (this._type === Number) {
         return typeof value === "number" || value instanceof this._type;
      }
      else if (this._type === Boolean) {
         return typeof value === "boolean" || value instanceof this._type;
      }
      else {
         return value instanceof this._type;
      }
   }

   public stringify() {
      return `Any ${(this.type as any).name}`;
   }
}
