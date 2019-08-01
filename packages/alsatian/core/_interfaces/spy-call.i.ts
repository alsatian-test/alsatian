export interface ISpyCall {
	args: Array<any>;
	allArgumentsMatch(...expectedArguments: Array<any>): boolean;
}
