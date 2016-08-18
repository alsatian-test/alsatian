import { MatchError } from "../_errors";

export class TestTimeoutError extends MatchError {
  public constructor(testTimeout: number) {
    super(null, null, `The test exceeded the given timeout of ${testTimeout}ms.`);
  }
}
