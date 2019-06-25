import { Any, FunctionSpy, TypeMatcher } from "../spying";
import { FunctionSpyMatcher } from "./function-spy-matcher";
import { Matcher } from "./matcher";
import { stringify } from "../stringification";
import { AnyFunction, INameable, FunctionArguments } from "../_interfaces";

/**
 * Checks whether functions have performed as expected
 */
export class FunctionMatcher<T extends AnyFunction> extends Matcher<FunctionSpy | T> {
	/**
	 * Checks that a function throws an error when executed
	 */
	public toThrow() {
		const error = this._getError();

		this._registerMatcher(
			(error === null) !== this.shouldMatch,
			`Expected an error ` +
			`${this.shouldMatch ? "" : "not "}to be thrown ` +
			`but ${this.shouldMatch ? "no errors were" : "an error was"} thrown.`,
			this.shouldMatch ? "an error thrown" : "no errors thrown",
			{
				errorThrown: error ? error.toString() : "none"
			}
		);
	}

	public async toThrowAsync() {
		const error = await this._getAsyncError();

		this._registerMatcher(
			(error === null) !== this.shouldMatch,
			`Expected an error ` +
			`${this.shouldMatch ? "" : "not "}to be thrown ` +
			`but ${this.shouldMatch ? "no errors were" : "an error was"} thrown.`,
			this.shouldMatch ? "an error thrown" : "no errors thrown",
			{
				errorThrown: error ? error.toString() : "none"
			}
		);
	}

	/**
	 * Checks that a function throws a specific error
	 * @param errorType - the type of error that should be thrown
	 * @param errorMessage - the message that the error should have
	 */
	public toThrowError(
		errorType: new (...args: Array<any>) => Error,
		errorMessage: string
	) {
		const error = this._getError();
		const threwRightError = this._errorMatches(
			error,
			errorType,
			errorMessage
		);

		this._registerMatcher(
			threwRightError === this.shouldMatch,
			`Expected an error with ` +
			`${errorMessage ? `message "${errorMessage}"` : ""} ` +
			`${errorMessage && errorType ? "and " : ""}` +
			`${errorType ? `type ${(errorType as INameable).name} to ${!this.shouldMatch ? "not " : ""}` : ""}` +
			`have been thrown, but it was${!this.shouldMatch ? "" : "n't"}.`,
			this.shouldMatch ? "an error of the right type thrown" : "no errors of type thrown",
			{
				actualError: error ? error.toString() : "none",
				expectedError: errorType.name,
				expectedErrorMessage: errorMessage
			}
		);
	}

	/**
	 * Checks that a function throws a specific error asynchronously
	 * @param errorType - the type of error that should be thrown
	 * @param errorMessage - the message that the error should have
	 */
	public async toThrowErrorAsync(
		errorType: new (...args: Array<any>) => Error,
		errorMessage: string
	) {
		const error = await this._getAsyncError();
		const threwRightError = this._errorMatches(
			error,
			errorType,
			errorMessage
		);

		this._registerMatcher(
			threwRightError === this.shouldMatch,
			`Expected an error with ` +
			`${errorMessage ? `message "${errorMessage}"` : ""} ` +
			`${errorMessage && errorType ? "and " : ""}` +
			`${errorType ? `type ${(errorType as INameable).name} to ${!this.shouldMatch ? "not " : ""}` : ""}` +
			`have been thrown, but it was${!this.shouldMatch ? "" : "n't"}.`,
			this.shouldMatch ? "an error of the right type thrown" : "no errors of type thrown",
			{
				actualError: error ? error.toString() : "none",
				expectedError: errorType.name,
				expectedErrorMessage: errorMessage
			}
		);
	}

	/**
	 * Checks that a spy has been called
	 */
	public toHaveBeenCalled(): FunctionSpyMatcher {
		if (this._isFunctionSpyOrSpiedOnFunction(this.actualValue) === false) {
			throw new TypeError(
				"toHaveBeenCalled requires value passed in to Expect to be a FunctionSpy or a spied on function."
			);
		}

		const spy = this.actualValue as FunctionSpy;

		this._registerMatcher(
			(spy.calls.length === 0) !== this.shouldMatch,
			`Expected function ${!this.shouldMatch ? "not " : ""}to be called.`,
			`function ${!this.shouldMatch ? "not " : ""}to be called`,
		);

		return new FunctionSpyMatcher(spy);
	}

	/**
	 * Checks that a spy has been called with the specified arguments
	 * @param expectedArguments - a list of arguments that the spy should have been called with
	 */
	public toHaveBeenCalledWith(
		...expectedArguments: FunctionArguments<T>
	): FunctionSpyMatcher {
		if (this._isFunctionSpyOrSpiedOnFunction(this.actualValue) === false) {
			throw new TypeError(
				"toHaveBeenCalledWith requires value passed in to Expect to be a FunctionSpy or a spied on function."
			);
		}
		const spy = this.actualValue as FunctionSpy;

		this._registerMatcher(
			spy.calls.some(call =>
				this._callArgumentsMatch(call, expectedArguments)
			) === this.shouldMatch,
			`Expected function ${!this.shouldMatch ? "not " : ""}to be called` +
			`${this._stringifyArguments(expectedArguments)}.`,
			`function ${!this.shouldMatch ? "not " : ""}to be called`+
			`${this._stringifyArguments(expectedArguments)}.`,
			{
				expectedArguments: stringify(expectedArguments),
				actualArguments: stringify(spy.calls.map(call => call.args))
			}
		);

		return new FunctionSpyMatcher(spy, expectedArguments);
	}

	private _stringifyArguments(expectedArguments: FunctionArguments<T>) {
		return expectedArguments ? ` with ${stringify(expectedArguments)}` : "";
	}

	private _getError() {
		try {
			(this.actualValue as T)();
			return null;
		} catch (error) {
			return error;
		}
	}

	private async _getAsyncError() {
		try {
			await (this.actualValue as T)();
			return null;
		} catch (error) {
			return error;
		}
	}

	private _errorMatches(
		error: Error,
		errorType: new (...args: Array<any>) => Error,
		errorMessage: string
	) {
		return error instanceof errorType && error.message === errorMessage;
	}

	private _callArgumentsMatch(call: any, expectedArguments: Array<any>) {
		if (call.args.length !== expectedArguments.length) {
			return false;
		}

		return call.args.every((arg: any, index: number) => {
			const expectedArgument = expectedArguments[index];

			return (
				arg === expectedArgument ||
				expectedArgument === Any ||
				(expectedArgument instanceof TypeMatcher &&
					expectedArgument.test(arg))
			);
		});
	}

	private _isFunctionSpyOrSpiedOnFunction(value: any) {
		return (
			value instanceof FunctionSpy ||
			(value instanceof Function && value.calls !== undefined)
		);
	}
}
