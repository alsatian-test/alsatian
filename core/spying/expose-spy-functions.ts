import { FunctionSpy } from "./function-spy";

export function exposeSpyFunctions(spiedFunction: (...args: Array<any>) => any, functionSpy: FunctionSpy) {    

      // expose spy's calls on function
      (spiedFunction as any).calls = functionSpy.calls;

      // expose spy's callsWithArguments on function
      (spiedFunction as any).callsWithArguments = functionSpy.callsWithArguments;
}
