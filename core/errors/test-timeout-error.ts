import { MatchError } from "./match-error";
/**
 * Represents a Timeout exceeded error
 *
 * @export
 * @class TestTimeoutError
 * @extends {MatchError}
 */
export class TestTimeoutError extends MatchError {
  /**
   * Creates an instance of TestTimeoutError.
   * @param {number} testTimeout The number of milliseconds
   * @memberof TestTimeoutError
   */
  public constructor(testTimeout: number) {
    super(`The test exceeded the given timeout of ${testTimeout}ms.`);
  }
}
