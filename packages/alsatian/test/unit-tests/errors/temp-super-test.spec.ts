import { TestFixture, Test, TestCase, Expect } from "../../../core/alsatian-core";
import * as mock from "mock-require";

@TestFixture("temporary tests to satisfy TypeScript quirk")
export class TempTests {

	@TestCase("test-timeout-error", "TestTimeoutError")
	@Test("give all those errors a go without a super")
	public async testErrors(error: string, className: string) {
		const mockMatch: any = {
			MatchError: class {}
		};

		mock("../../../core/errors/match-error", mockMatch);
		delete require.cache[require.resolve(`../../../core/errors/${error}.ts`)];

        const errorModule = await import(`../../../core/errors/${error}`);

		Expect(new errorModule[className]).toBeDefined();

		mock.stopAll();
		delete require.cache[require.resolve(`../../../core/errors/${error}.ts`)];
	}
}
