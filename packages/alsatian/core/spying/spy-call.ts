import { Any, TypeMatcher } from "../spying";
import { ISpyCall } from "../_interfaces";

export class SpyCall implements ISpyCall {
	public get args() {
		return this._args;
	}

	private _args: Array<any> = [];

	public constructor(args: Array<any>) {
		this._args = args;
	}

	public allArgumentsMatch(...expectedArguments: Array<any>): boolean {
		if (expectedArguments.length !== this._args.length) {
			return false;
		}

		if (
			expectedArguments.some(
				(arg, index) =>
					!this._argumentIsAsExpected(this._args[index], arg)
			)
		) {
			return false;
		}

		return true;
	}

	private _argumentIsAsExpected(actualArgument: any, expectedArgument: any) {
		if (expectedArgument === Any) {
			return true;
		} else if (expectedArgument instanceof TypeMatcher) {
			return expectedArgument.test(actualArgument);
		}

		return actualArgument === expectedArgument;
	}
}
