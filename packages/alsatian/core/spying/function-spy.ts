import { SpyCall } from "../spying";
import { ISpyCall } from "../_interfaces";

export class FunctionSpy {

	public readonly calls: Array<ISpyCall> = [];
	protected returnValue: any;
	protected hasReturnValue: boolean;
	protected isStubbed: boolean;
	protected context: any;
	private _fakeFunction: () => any;

	public callsWithArguments(...args: Array<any>): Array<ISpyCall> {
		return this.calls.filter(call =>
			call.allArgumentsMatch.apply(call, args)
		);
	}

	public call(...args: Array<any>) {
		this.calls.push(new SpyCall(args));

		let returnValue: any;

		if (this._fakeFunction) {
			returnValue = this._fakeFunction.apply(this.context, args);
		}

		if (this.hasReturnValue) {
			return this.returnValue;
		}

		return returnValue;
	}

	public andReturn(returnValue: any) {
		this.returnValue = returnValue;
		this.hasReturnValue = true;
	}

	public andCall(fakeFunction: () => any) {
		this.isStubbed = true;
		this._fakeFunction = fakeFunction;
	}
}
