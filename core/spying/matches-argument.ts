import { ArgumentMatcher } from "./argument-matcher";

class Matcher<ArgumentType extends Object> extends ArgumentMatcher {

   constructor(
      private readonly ctor: { new(...args: Array<any>) : ArgumentType },
      private readonly tester: (value: ArgumentType) => boolean) {
      super();
      if (ctor === null || ctor === undefined) {
         throw new TypeError("ctor must not be null or undefined");
      }

      if (tester === null || tester === undefined) {
         throw new TypeError("tester must not be null or undefined");
      }
   }

   public test(value: any) {
      if (!(value instanceof this.ctor)) {
         return false;
      }

      return this.tester(value as ArgumentType);
   }

   public stringify() {
      return `Matches ${(this.ctor as any).name} (${this.tester.toString()})`;
   }
}

export function Matches<ArgumentType>(
      ctor: { new(...args: Array<any>) : ArgumentType },
      tester: (value: ArgumentType) => boolean): ArgumentMatcher {
   return new Matcher(ctor, tester);
}
