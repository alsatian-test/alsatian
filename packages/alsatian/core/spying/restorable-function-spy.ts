import { FunctionSpy } from "../spying";
import { exposeSpyFunctions } from "./expose-spy-functions";

export class RestorableFunctionSpy extends FunctionSpy {
	private originalFunction: (...args: Array<any>) => any;
	private functionName: string;
	private target: any;

	public constructor(target: any, functionName: string) {
		super();

		this.originalFunction = target[functionName];
		this.context = target;

		this.functionName = functionName;
		this.target = target;

		target[functionName] = this.call.bind(this);

		exposeSpyFunctions(target[functionName], this);

		// expose spy's restore function
		target[functionName].restore = this.restore.bind(this);
	}

	public restore() {
		this.target[this.functionName] = this.originalFunction;
	}

	public andCallThrough() {
		this.isStubbed = false;
	}

	public andStub() {
		this.isStubbed = true;
	}

	public call(...args: Array<any>) {
		const returnValue = super.call.apply(this, args);

		if (!this.isStubbed && !this.hasReturnValue) {
			return this.originalFunction.apply(this.context, args);
		}

		return returnValue;
	}
}
