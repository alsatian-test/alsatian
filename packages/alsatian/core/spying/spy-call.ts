import { Any, TypeMatcher } from "../spying";
import { ISpyCall } from "../_interfaces";

export class SpyCall<Arguments extends Array<any>> implements ISpyCall {
	public readonly args = [] as Arguments;

	public constructor(args: Arguments) {
		this.args = args;
	}

	public allArgumentsMatch(...expectedArguments: Arguments): boolean {
		if (expectedArguments.length !== this.args.length) {
			return false;
		}

		if (
			expectedArguments.some(
				(arg, index) =>
					!this._argumentIsAsExpected(this.args[index], arg)
			)
		) {
			return false;
		}

		return true;
	}

	private _argumentIsAsExpected<T>(actualArgument: T, expectedArgument: T | typeof Any) {
		if (expectedArgument === Any) {
			return true;
		} else if (expectedArgument instanceof TypeMatcher) {
			return expectedArgument.test(actualArgument);
		}

		return actualArgument === expectedArgument;
	}
}
