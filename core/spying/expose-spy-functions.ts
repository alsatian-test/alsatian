import { FunctionSpy } from "./function-spy";
import { ISpiedFunction } from "./spied-function.i";

export function exposeSpyFunctions<ArgumentType, ReturnType>(spiedFunction: ISpiedFunction<ArgumentType, ReturnType>,
                                                             functionSpy: FunctionSpy) {

      // expose spy's calls on function
      (spiedFunction as any).calls = functionSpy.calls;

      // expose spy's callsWithArguments on function
      spiedFunction.callsWithArguments = functionSpy.callsWithArguments;

      // expose spy's andReturn on function
      spiedFunction.andReturn = functionSpy.andReturn.bind(functionSpy);

      // expose spy's andCall on function
      spiedFunction.andCall = functionSpy.andCall.bind(functionSpy);
}
