export class TypeMatcher {

   private _type: new (...args: Array<any>) => Object;

   public constructor(type: new (...args: Array<any>) => Object) {
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
}
