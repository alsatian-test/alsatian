import { diff } from "./diff";
import { EmptyMatcher } from "./empty-matcher";
import { TypeMatcher } from "../spying";

export class ObjectMatcher<T extends object> extends EmptyMatcher<T> {

	/**
	 * Checks that a value is equal to another (for objects the function will check for deep equality)
	 * @param expectedValue - the value that will be used to match
	 */
	public toEqual(expectedValue: T | TypeMatcher<T>) {
		if (Buffer.isBuffer(expectedValue) || Buffer.isBuffer(this.actualValue)) {
			this._checkTypeMatcherEqual(expectedValue, this.buffersEqual);
		}
		else {
			this._checkTypeMatcherEqual(expectedValue, this.objectsEqual);
		}
	}

   private buffersEqual(expectedValue: T) {
	   this._registerMatcher(
		   this._checkBuffersAreEqual(
			   expectedValue,
			   this.actualValue
		   ) === this.shouldMatch,
		   `Expected values ${!this.shouldMatch ? "not " : ""}to be equal`,
		   expectedValue,
		   {
			   diff: diff(expectedValue, this.actualValue)
		   }
	   );
   }

   private _checkBuffersAreEqual(buffer: any, other: any): boolean {
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

	private objectsEqual(expectedValue: T) {
		this._registerMatcher(
			this._checkObjectsAreDeepEqual(
				expectedValue,
				this.actualValue
			) === this.shouldMatch,
			`Expected objects ${!this.shouldMatch ? "not " : ""}to be equal`,
			expectedValue,
			{
				diff: diff(expectedValue, this.actualValue)
			}
		);
	}

	private _checkObjectsAreDeepEqual(objectA: any, objectB: any): boolean {
		// if one object is an array and the other is not then they are not equal
		if (Array.isArray(objectA) !== Array.isArray(objectB)) {
			return false;
		}

		// get all the property keys for each object
		const OBJECT_A_KEYS = Object.keys(objectA);
		const OBJECT_B_KEYS = Object.keys(objectB);

		// if they don't have the same amount of properties then clearly not
		if (OBJECT_A_KEYS.length !== OBJECT_B_KEYS.length) {
			return false;
		}

		// check all the properties of each object
		for (const objectAKey of OBJECT_A_KEYS) {
			// if the property values are not the same
			if (objectA[objectAKey] !== objectB[objectAKey]) {
				// and it's not an object or the objects are not equal
				if (
					typeof objectA[objectAKey] !== "object" ||
					this._checkObjectsAreDeepEqual(
						objectA[objectAKey],
						objectB[objectAKey]
					) === false
				) {
					// then not deep equal
					return false;
				}
			}
		}

		// all properties match so all is good
		return true;
	}
}
