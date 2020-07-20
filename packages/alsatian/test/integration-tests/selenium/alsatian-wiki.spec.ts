import { Builder, By, Capabilities, WebDriver } from "selenium-webdriver";
import {
	AsyncSetup,
	AsyncTeardown,
	AsyncTest,
	Expect,
	TestFixture
} from "../../../core/alsatian-core";

@TestFixture("Alsatian Wiki")
export default class AlsatianWikiEndToEndTests {
	private driver: WebDriver;

	@AsyncSetup
	private async goToWiki() {
		// create a driver if one hasn't yet been created
		this.driver = new Builder()
			.withCapabilities(Capabilities.chrome())
			.build();

		// go to the wiki home page
		await this.driver.get(
			"https://github.com/alsatian-test/alsatian/wiki"
		);
	}

	@AsyncTeardown
	private async tidyUp() {
		// quit the browser so it's not hanging about
		this.driver.quit();
	}

	@AsyncTest("page title is Home")
	public async correctTitle() {
		// get the wiki title
		const title = await this.driver
			.findElement(By.className("gh-header-title"))
			.getText();

		// check it contains what we'd expect
		Expect(title).toBe("Home");
	}

	@AsyncTest("everyone gets a nice welcome")
	public async checkContent() {
		// get the wiki body
		const title = await this.driver
			.findElement(By.id("wiki-body"))
			.getText();

		// check it contains what we'd expect
		Expect(title).toContain("Welcome to the alsatian wiki!");
	}
}
