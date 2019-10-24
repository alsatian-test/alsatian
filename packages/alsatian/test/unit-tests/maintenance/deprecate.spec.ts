import { deprecate } from "../../../core/maintenance/deprecate";
import {
	Expect,
	SpyOn,
	Test,
	TestCase,
	TestFixture
} from "../../../core/alsatian-core";
import { Warner } from "../../../core/maintenance/warn";

@TestFixture("deprecate function tests")
export class DeprecateFunctionTests {

	@TestCase("FEATURE", "VERSION")
	@TestCase("Awesome Feature", "3.0.0")
	@TestCase("Wowza?!", "9.9.9-abc")
	@Test("warning given")
	public warningGiven(featureName: string, versionNumber: string) {
		SpyOn(Warner, "warn");

		deprecate(featureName, versionNumber, null);

		Expect(Warner.warn).toHaveBeenCalledWith(
			`${featureName} has been deprecated and will be removed in version ${versionNumber}.`
		);
	}

	@TestCase("prompt")
	@TestCase("I'm prompting you to do something")
	@TestCase("PLEASE OH PLEASE?!")
	@Test("warning given with prompt")
	public warningGivenWithPrompt(prompt: string) {
		SpyOn(Warner, "warn");

		deprecate("feature", "version", prompt);

		Expect(Warner.warn).toHaveBeenCalledWith(
			`feature has been deprecated and will be removed in version version. ${prompt}`
		);
	}
}
