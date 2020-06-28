import { Any, TypeMatcher } from "../spying";
import { ISpyCall } from "../_interfaces";

export class SpyCall implements ISpyCall {

	public constructor(public readonly args: Array<any>) {}

	public allArgumentsMatch(...expectedArguments: Array<any>): boolean {
		if (expectedArguments.length !== this.args.length) {
			return false;
		}

		if (
			expectedArguments.some(
				(arg, index) =>
					!this.argumentIsAsExpected(this.args[index], arg)
			)
		) {
			return false;
		}

		return true;
	}

	private argumentIsAsExpected(actualArgument: any, expectedArgument: any) {
		if (expectedArgument === Any) {
			return true;
		} else if (expectedArgument instanceof TypeMatcher) {
			return expectedArgument.test(actualArgument);
		}

		return actualArgument === expectedArgument;
	}
}
