/*
import { GlobHelper } from "../../../core/glob-helper";
import { Expect, Test, TestFixture, TestCase, SpyOn } from "../../../core/alsatian-core";
import * as Glob from "glob";

@TestFixture("glob helper")
export class GlobHelperTests {

	@TestCase("glob")
	@TestCase("another/glob")
	@Test("resolve calls sync")
	public resolveCallsSync(glob: string) {
		const globHelper = new GlobHelper();
		SpyOn(Glob, "sync");

		globHelper.resolve(glob);

		Expect(Glob.sync).toHaveBeenCalledWith(glob);
	}
}
*/
