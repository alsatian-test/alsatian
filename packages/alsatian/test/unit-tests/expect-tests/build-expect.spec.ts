import {
	Expect,
	Test,
	TestFixture,
	SpyOn,
	Matcher
} from "../../../core/alsatian-core";
import { buildExpect } from "../../../core/expect/build-expect";

@TestFixture("build expect tests")
export class BuildExpectTests {
	@Test("actual value has null prototype returns matcher")
	public definedShouldNotThrowError(message: string) {
		const objectSpy = SpyOn(Object, "getPrototypeOf");
		objectSpy.andReturn(null);

		Expect(buildExpect()({}) instanceof Matcher).toBe(true);

		objectSpy.restore();
	}
}
