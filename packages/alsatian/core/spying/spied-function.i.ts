import { FunctionSpy } from "./function-spy";

export type TypedFunction = (...args: Array<any>) => any;

export type ISpiedFunction<T extends TypedFunction> = T & FunctionSpy;
