import { diff } from "./diff";
import { Matcher } from "./matcher";
import { TypeMatcher } from "../spying";

/**
 * Gives functionality to ensure the outcome of a test is as expected
 */
export class BufferMatcher extends Matcher<Buffer> {

	/**
	 * Checks that a value is equal to another (for objects the function will check for deep equality)
	 * @param expectedValue - the value that will be used to match
	 */
	public toEqual(expectedValue: Buffer | TypeMatcher<Buffer>) {
		this._checkTypeMatcherEqual(expectedValue, this.buffersEqual);
	}

	private buffersEqual(expectedValue: Buffer) {
		this._registerMatcher(
			this._checkBuffersAreEqual(
				expectedValue as Buffer,
				this.actualValue
			) === this.shouldMatch,
			`Expected values ${!this.shouldMatch ? "not " : ""}to be equal`,
			expectedValue,
			{
				diff: diff(expectedValue, this.actualValue)
			}
		);
	}

	private _checkBuffersAreEqual(buffer: Buffer, other: any): boolean {
		// Buffer.from() only accepts of type string, Buffer, ArrayBuffer, Array, or Array-like Object.
		if (this._isBufferable(other)) {
			const otherBuffer = Buffer.isBuffer(other)
				? other
				: Buffer.from(other as string); // Typings don't know that Buffer.from() can accept ArrayLike<T>

			return buffer.equals(otherBuffer);
		} else {
			return false;
		}
	}

	private _isBufferable(
		obj: any
	): obj is string | Buffer | Array<any> | ArrayBuffer | ArrayLike<any> {
		return (
			"string" === typeof obj ||
			Buffer.isBuffer(obj) ||
			Array.isArray(obj) ||
			obj instanceof ArrayBuffer ||
			// ArrayLike<any>
			(null != obj &&
				"object" === typeof obj &&
				obj.hasOwnProperty("length") &&
				"number" === typeof obj.length &&
				(obj.length === 0 || (obj.length > 0 && obj.length - 1 in obj)))
		);
	}
}
