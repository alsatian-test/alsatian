import { FunctionSpy } from "./function-spy";
import { exposeSpyFunctions } from "./expose-spy-functions";

export function createFunctionSpy(): (...args: Array<any>) => any | FunctionSpy {
      const functionSpy = new FunctionSpy();

      const spiedFunction = functionSpy.call.bind(functionSpy);

      exposeSpyFunctions(spiedFunction, functionSpy);

      return spiedFunction;
}
