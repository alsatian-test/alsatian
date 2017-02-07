type Tester = {
   test: (value: any) => boolean;
   stringify: () => string;
};

export class TypeMatcher<ExpectedType extends Object> {

   private _testers: Array<Tester> = [];
   private _type: new (...args: Array<any>) => Object;
   public get type() {
      return this._type;
   }

   public constructor(type: new (...args: Array<any>) => ExpectedType) {
      if (type === null || type === undefined) {
         throw new TypeError("type must not be null or undefined");
      }

      this._type = type;

      this._testers.push({
         stringify: () => `Any ${(this.type as any).name}`,
         test: (value: any) => {
            if ((<any> type) === String) {
               return typeof value === "string" || value instanceof this._type;
            }
            else if ((<any> type) === Number) {
               return typeof value === "number" || value instanceof this._type;
            }
            else if ((<any> type) === Boolean) {
               return typeof value === "boolean" || value instanceof this._type;
            }
            else {
               return value instanceof this._type;
            }
         }
      });
   }

   public test(value: any) {
      return this._testers.every(tester => tester.test(value));
   }

   public stringify() {
      return this._testers.map(tester => tester.stringify()).join(" and ");
   }

   public thatMatches(key: string, value: any): this;
   public thatMatches(properties: Object): this;
   public thatMatches(delegate: (argument: ExpectedType) => boolean): this;
   public thatMatches(first: string | Object | ((argument: ExpectedType) => boolean), second?: any): this {
      if (null === first || undefined === first ) {
         throw new TypeError("thatMatches requires none-null or non-undefined argument");
      }

      if (typeof first === "string") {
         return this.matchesKeyAndValue(first, second);
      }

      if (typeof first === "function") {
         return this.matchesDelegate(first);
      }

      if (typeof first === "object") {
         return this.matchesObjectLiteral(first);
      }

      throw new Error("Invalid arguments");
   }

   private matchesKeyAndValue(key: string, value: any): this {
      this._testers.push({
         stringify: () => `with property '${key}' equal to '${JSON.stringify(value) || value.toString()}'`,
         test: (v: any) => {
            if (Object.getOwnPropertyNames(v).indexOf(key) < 0) {
               return false;
            }

            return v[key] === value;
         }
      });

      return this;
   }

   private matchesDelegate(delegate: (argument: ExpectedType) => boolean): this {
      this._testers.push({
         stringify: () => `matches '${delegate.toString()}'`,
         test: (v: any) => delegate(v)
      });

      return this;
   }

   private matchesObjectLiteral(properties: Object): this {
      if (properties.constructor !== Object) {
         throw new TypeError("thatMatches requires value passed in to be an object literal");
      }

      this._testers.push({
         stringify: () => `matches '${JSON.stringify(properties, this.replacer)}'`,
         test: (v: any) => {
            const targetKeys = Object.getOwnPropertyNames(v);
            return Object.getOwnPropertyNames(properties).every(key => {
               if (targetKeys.indexOf(key) < 0) {
                  return false;
               }

               return v[key] === (properties as any)[key];
            });
         }
      });

      return this;
   }

   private replacer(key: string, value: any) {
      if (typeof value === "function") {
         return value.toString();
      }

      return value;
   }
}
