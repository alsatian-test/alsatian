import { Test, Expect, TestFixture } from "alsatian";

@TestFixture("asynchronous tests")
export class AsyncTests {
	private async asyncFunction(): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			resolve(4);
		});
	}

	@Test("simple passing asynchronous test")
	public async passingTest() {
		const result = await this._asyncFunction();
		Expect(result).toBe(4);
	}

	@Test("simple failing asynchronous test")
	public async failingTest() {
		const result = await this._asyncFunction();
		Expect(result).toBe(5);
	}
}
