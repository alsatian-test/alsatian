import { Logger } from "../../../core/maintenance/log";
import {
	Expect,
	Setup,
	SpyOn,
	Teardown,
	Test,
	TestCase,
	TestFixture
} from "../../../core/alsatian-core";
import { Warner } from "../../../core/maintenance/warn";

@TestFixture("log function tests")
export class LogFunctionTests {
	private originalLogs: Array<any>;

	@Setup
	private replaceLogArray() {
		this.originalLogs = Logger.LOGS;
		(Logger as any).LOGS = [];
	}

	@Teardown
	private restoreLogArray() {
		(Logger as any).LOGS = this.originalLogs;
	}

	@TestCase("log")
	@TestCase("message")
	@TestCase("A short sentence.")
	@Test("log message added to array")
	public logMessageAddedToArray(message: string) {
		Logger.log(message);
		Expect(Logger.LOGS[0].value).toBe(message);
	}

	@TestCase("two", "logs")
	@TestCase("1", "2", "3")
	@TestCase("four", "3", "two", "one")
	@Test("multiple log messages added to array")
	public multipleLogMessagesAddedToArray(...messages: Array<string>) {
		messages.forEach(message => {
			Logger.log(message);
		});

		messages.forEach((message, index) => {
			Expect(Logger.LOGS[index].value).toBe(message);
		});
	}

	@Test("warning given")
	public warningGiven() {
		SpyOn(Warner, "warn");

		Logger.log("message");

		Expect(Warner.warn).toHaveBeenCalledWith(
			"The log function may cause tests to be slow and should only be used for debugging."
		);
	}
}
