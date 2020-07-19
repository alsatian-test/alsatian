
import { FunctionSpy } from "./function-spy";
import { exposeSpyFunctions } from "./expose-spy-functions";
import { ISpiedFunction, TypedFunction } from "./spied-function.i";

export function createFunctionSpy<FunctionType extends TypedFunction>(): ISpiedFunction<FunctionType>;
export function createFunctionSpy<
	ArgumentType,
	ReturnType
>(): ISpiedFunction<(...args: Array<ArgumentType>) => ReturnType>;
export function createFunctionSpy() {
	const functionSpy = new FunctionSpy();

	const spiedFunction = functionSpy.call.bind(functionSpy);

	exposeSpyFunctions(spiedFunction as ISpiedFunction<any>, functionSpy);

	return spiedFunction;
}
