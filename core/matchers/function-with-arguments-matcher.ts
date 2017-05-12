import { FunctionMatcher, FunctionSpyMatcher } from "./";
import { ErrorMatchError, FunctionCallMatchError } from "../errors";
import { Any, FunctionSpy, TypeMatcher } from "../spying";

export class FunctionWithArgumentsMatcher extends FunctionMatcher {    

   /**
    * Checks that a spy has been called with the specified arguments
    * @param expectedArguments - a list of arguments that the spy should have been called with
    */
   public toHaveBeenCalledWith(...expectedArguments: Array<any>): FunctionSpyMatcher {
      if (this._isFunctionSpyOrSpiedOnFunction(this.actualValue) === false) {
         throw new TypeError(
             "toHaveBeenCalledWith requires value passed in to Expect to be a FunctionSpy or a spied on function."
         );
      }

      if (this.actualValue.calls.filter((call: any) => {
         return call.args.length === expectedArguments.length && // the call has the same amount of arguments
         call.args.filter((arg: any, index: number) => {
            const expectedArgument = expectedArguments[index];
            return arg === expectedArgument ||
                   expectedArgument === Any ||
                  (expectedArgument instanceof TypeMatcher && expectedArgument.test(arg));
         }).length === expectedArguments.length; // and all call arguments match expected arguments
      }).length === 0 === this.shouldMatch) {
         throw new FunctionCallMatchError(this.actualValue, this.shouldMatch, expectedArguments);
      }

      return new FunctionSpyMatcher(this.actualValue, expectedArguments);
   }
}