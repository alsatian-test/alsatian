import { FunctionSpy } from "./function-spy";
import { exposeSpyFunctions } from "./expose-spy-functions";
import { ISpiedFunction } from "./spied-function.i";

export function createFunctionSpy<FunctionType extends (...args: Array<any>) => any>(): FunctionType & FunctionSpy;
export function createFunctionSpy<ArgumentType, ReturnType>(): ISpiedFunction<ArgumentType, ReturnType>;
export function createFunctionSpy<ArgumentType, ReturnType>(): ISpiedFunction<
	ArgumentType,
	ReturnType
> {
	const functionSpy = new FunctionSpy();

	const spiedFunction = functionSpy.call.bind(functionSpy);

	exposeSpyFunctions(spiedFunction, functionSpy);

	return spiedFunction;
}
