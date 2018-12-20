import { FunctionCallCountMatchError } from "../errors";
import { FunctionSpy } from "../spying";
import { FunctionSpyCallCountMatcher, SpyCallCountType } from "./";

export class FunctionSpyMatcher {
	private _spy: FunctionSpy;
	private _expectedArguments: Array<any> | null = null;

	public constructor(spy: FunctionSpy, expectedArguments?: Array<any>) {
		if (spy === null || spy === undefined) {
			throw new TypeError("spy must not be null or undefined.");
		}

		if (expectedArguments) {
			this._expectedArguments = expectedArguments;
		}

		this._spy = spy;
	}

	public exactly(expectedCallCount: number): FunctionSpyCallCountMatcher {
		return this._match(
			count => count !== expectedCallCount,
			expectedCallCount,
			"expectedCallCount",
			SpyCallCountType.Exactly,
			true
		);
	}

	public anythingBut(
		unexpectedCallCount: number
	): FunctionSpyCallCountMatcher {
		return this._match(
			count => count === unexpectedCallCount,
			unexpectedCallCount,
			"unexpectedCallCount",
			SpyCallCountType.Exactly,
			false
		);
	}

	public greaterThan(minimumCallCount: number): FunctionSpyCallCountMatcher {
		return this._match(
			count => count <= minimumCallCount,
			minimumCallCount,
			"minimumCallCount",
			SpyCallCountType.GreaterThan,
			true
		);
	}

	public lessThan(maximumCallCount: number): FunctionSpyCallCountMatcher {
		return this._match(
			count => count >= maximumCallCount,
			maximumCallCount,
			"maximumCallCount",
			SpyCallCountType.LessThan,
			true
		);
	}

	private _validateCallCount(callCount: number, callCountName: string) {
		if (callCount < 1) {
			throw new TypeError(`${callCountName} must be greater than 0.`);
		}
	}

	private _matchingCallsCount() {
		if (this._expectedArguments === null) {
			return this._spy.calls.length;
		}

		return this._matchingArguments();
	}

	private _matchingArguments() {
		return this._spy.callsWithArguments.apply(
			this._spy,
			this._expectedArguments
		).length;
	}

	private _match(
		countIsNotCorrect: (count: number) => boolean,
		callCount: number,
		callCountName: string,
		callCountType: SpyCallCountType,
		shouldMatch: boolean
	) {
		this._validateCallCount(callCount, callCountName);

		if (countIsNotCorrect(this._matchingCallsCount())) {
			throw new FunctionCallCountMatchError(
				this._spy,
				shouldMatch,
				callCount,
				callCountType,
				this._expectedArguments
			);
		}

		return new FunctionSpyCallCountMatcher();
	}
}
