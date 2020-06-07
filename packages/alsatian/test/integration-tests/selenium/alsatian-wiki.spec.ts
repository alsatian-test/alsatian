import { Builder, By, Capabilities, WebDriver } from "selenium-webdriver";
import {
	Test,
	Setup,
	Teardown,
	Expect,
	TestFixture
} from "../../../core/alsatian-core";

@TestFixture("Alsatian Wiki")
export default class AlsatianWikiEndToEndTests {
	private _driver: WebDriver;

	@Setup
	private async _goToWiki() {
		// create a driver if one hasn't yet been created
		this._driver = new Builder()
			.withCapabilities(Capabilities.chrome())
			.build();

		// go to the wiki home page
		await this._driver.get(
			"https://github.com/alsatian-test/alsatian/wiki"
		);
	}

	@Teardown
	private async _tidyUp() {
		// quit the browser so it's not hanging about
		this._driver.quit();
	}

	@Test("page title is Home")
	public async correctTitle() {
		// get the wiki title
		const title = await this._driver
			.findElement(By.className("gh-header-title"))
			.getText();

		// check it contains what we'd expect
		Expect(title).toBe("Home");
	}

	@Test("everyone gets a nice welcome")
	public async checkContent() {
		// get the wiki body
		const title = await this._driver
			.findElement(By.id("wiki-body"))
			.getText();

		// check it contains what we'd expect
		Expect(title).toContain("Welcome to the alsatian wiki!");
	}
}
