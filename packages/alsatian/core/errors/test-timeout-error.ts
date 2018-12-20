import { MatchError } from "./match-error";

export class TestTimeoutError extends MatchError {
	public constructor(testTimeout: number) {
		super(`The test exceeded the given timeout of ${testTimeout}ms.`);
	}
}
