import {
	Expect,
	Setup,
	Teardown,
	Test,
	TestCase,
	TestFixture
} from "../../../core/alsatian-core";
import { Warner } from "../../../core/maintenance/warn";

@TestFixture("warn function tests")
export class WarnFunctionTests {
	private originalWarnings: Array<any>;

	@Setup
	private replaceLogArray() {
		this.originalWarnings = Warner.warnings;
		(Warner as any).warnings = [];
	}

	@Teardown
	private restoreLogArray() {
		(Warner as any).warnings = this.originalWarnings;
	}

	@TestCase("warning")
	@TestCase("message")
	@TestCase("A short sentence.")
	@Test("log message added to array")
	public warningMessageAddedToArray(message: string) {
		Warner.warn(message);
		Expect(Warner.warnings[0]).toBe(message);
	}

	@TestCase("two", "warnings")
	@TestCase("1", "2", "3")
	@TestCase("four", "3", "two", "one")
	@Test("multiple warning messages added to array")
	public multipleWarningMessagesAddedToArray(...messages: Array<string>) {
		messages.forEach(message => {
			Warner.warn(message);
		});

		messages.forEach((message, index) => {
			Expect(Warner.warnings[index]).toBe(message);
		});
	}
}
