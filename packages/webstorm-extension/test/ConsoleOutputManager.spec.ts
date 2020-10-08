import { Test, TestFixture } from "alsatian";
import { ConsoleOutputManager } from "../src/ConsoleOutputManager";

@TestFixture()
export class ConsoleOutputManagerTest {

	@Test()
	public testCreateConsoleReader() {
		ConsoleOutputManager.instance.createConsoleReaderAndRedirectSystemOut();
		ConsoleOutputManager.instance.restoreConsoleOutput()
	}

}
