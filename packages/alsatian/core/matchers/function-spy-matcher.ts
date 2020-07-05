import { FunctionSpy } from "../spying";
import { FunctionSpyCallCountMatcher } from "./function-spy-call-count-matcher";
import { SpyCallCountType } from "./spy-call-count-type";
import { MatchError } from "../errors";
import { stringify } from "../stringification";

export class FunctionSpyMatcher {
	private spy: FunctionSpy;
	private expectedArguments: Array<any> | null = null;

	public constructor(spy: FunctionSpy, expectedArguments?: Array<any>) {
		if (spy === null || spy === undefined) {
			throw new TypeError("spy must not be null or undefined.");
		}

		if (expectedArguments) {
			this.expectedArguments = expectedArguments;
		}

		this.spy = spy;
	}

	public exactly(expectedCallCount: number): FunctionSpyCallCountMatcher {
		return this.match(
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
		return this.match(
			count => count === unexpectedCallCount,
			unexpectedCallCount,
			"unexpectedCallCount",
			SpyCallCountType.Exactly,
			false
		);
	}

	public greaterThan(minimumCallCount: number): FunctionSpyCallCountMatcher {
		return this.match(
			count => count <= minimumCallCount,
			minimumCallCount,
			"minimumCallCount",
			SpyCallCountType.GreaterThan,
			true
		);
	}

	public lessThan(maximumCallCount: number): FunctionSpyCallCountMatcher {
		return this.match(
			count => count >= maximumCallCount,
			maximumCallCount,
			"maximumCallCount",
			SpyCallCountType.LessThan,
			true
		);
	}

	private validateCallCount(callCount: number, callCountName: string) {
		if (callCount < 1) {
			throw new TypeError(`${callCountName} must be greater than 0.`);
		}
	}

	private matchingCallsCount() {
		if (this.expectedArguments === null) {
			return this.spy.calls.length;
		}

		return this.matchingArguments();
	}

	private matchingArguments() {
		return this.spy.callsWithArguments.apply(
			this.spy,
			this.expectedArguments
		).length;
	}

	private match(
		countIsNotCorrect: (count: number) => boolean,
		callCount: number,
		callCountName: string,
		callCountType: SpyCallCountType,
		shouldMatch: boolean
	) {
		this.validateCallCount(callCount, callCountName);

		const actualCallCount = this.matchingCallsCount();

		if (countIsNotCorrect(actualCallCount)) {
			throw new MatchError(
				`Expected function ${!shouldMatch ? "not " : ""}to be called` +
				`${this.expectedArguments ? " with " + stringify(this.expectedArguments) : ""}` +
				`${this.stringifyExpectedCallCount(callCount, callCountType)}.`,
				`function ${!shouldMatch ? "not " : ""}to be called${this.stringifyExpectedCallCount(callCount, callCountType)}.`,
				`function was called ${this.stringifyCallCount(actualCallCount)}.`,
				{
					actualCallCount: stringify(actualCallCount),
					expectedCallCount: this.stringifyExpectedCallCount(callCount, callCountType),
					expectedArguments: stringify(this.expectedArguments)
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
