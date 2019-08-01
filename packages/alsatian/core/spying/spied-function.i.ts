import { FunctionSpy } from "./function-spy";

export type TypedFunction<ArgumentType, ReturnType> = (
	...args: Array<ArgumentType>
) => ReturnType;

export interface ISpiedFunction<ArgumentType, ReturnType>
	extends TypedFunction<ArgumentType, ReturnType>,
		FunctionSpy {
	call: (
		thisArg: any,
		...functionArguments: Array<ArgumentType>
	) => ReturnType;
}
