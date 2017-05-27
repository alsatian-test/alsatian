import { FunctionSpy } from "./function-spy";

export interface ISpiedFunction extends Function, FunctionSpy {
      call: (thisArg: any, ...functionArguments: Array<any>) => any;
}
