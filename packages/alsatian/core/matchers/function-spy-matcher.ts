import { FunctionSpy } from "../spying";
import { FunctionSpyCallCountMatcher } from "./function-spy-call-count-matcher";
import { SpyCallCountType } from "./spy-call-count-type";
import { MatchError } from "../errors";
import { stringify } from "../stringification";

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

		const actualCallCount = this._matchingCallsCount();

		if (countIsNotCorrect(actualCallCount))
		 {
			throw new MatchError(
				`Expected function ${!shouldMatch ? "not " : ""}to be called` +
				`${this._expectedArguments ? " with " + stringify(this._expectedArguments) : ""}` +
				`${this.stringifyExpectedCallCount(callCount, callCountType)}.`,
				`function ${!shouldMatch ? "not " : ""}to be called${this.stringifyExpectedCallCount(callCount, callCountType)}.`,
				`function was called ${this.stringifyCallCount(actualCallCount)}.`,
				{
					actualCallCount: stringify(actualCallCount),
					expectedCallCount: this.stringifyExpectedCallCount(callCount, callCountType),
					expectedArguments: stringify(this._expectedArguments)
				}
			);
		}

		return new FunctionSpyCallCountMatcher();
	}

	private stringifyExpectedCallCount(callCount: number, callCountType: SpyCallCountType) {
		return `${this.stringifyCallCountType(callCountType)} ${this.stringifyCallCount(callCount)}`;
	}

	private stringifyCallCount(callCount: number) {
		return `${callCount} time${callCount === 1 ? "" : "s"}`;
	}

	private stringifyCallCountType(callCountType: SpyCallCountType) {
		switch (callCountType) {
			case SpyCallCountType.GreaterThan:
				return " greater than";
			case SpyCallCountType.LessThan:
				return " less than";
			default:
				return "";
		}
	}
}
