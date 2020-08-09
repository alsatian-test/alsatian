import { Warner } from "./warn";

function getStack() {
	return new Error().stack?.split("\n").map(stackLine => {
		const STACK_ITEMS = stackLine
			.replace(/^\s*at (.+) \((.+):\d+:\d+\)$/, "$1 $2")
			.split(" ");

		return {
			functionName: STACK_ITEMS[0],
			filePath: STACK_ITEMS[1]
		};
	});
}

export interface ILog {
	value: string;
	stack: Array<IStackDetail>;
}

export interface IStackDetail {
	functionName: string;
	filePath: string;
}

export class Logger {
	public static readonly LOGS: Array<ILog> = [];

	public static log(value: string) {
		Warner.warn(
			"The log function may cause tests to be slow and should only be used for debugging."
		);

		Logger.LOGS.push({
			value,
			stack: getStack() || []
		});
	}
}
