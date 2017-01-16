import { Builder, By, Capabilities, WebDriver } from "selenium-webdriver";
import { TestFixture, AsyncTest, AsyncSetup, Expect } from "../../../core/alsatian-core";


@TestFixture("Alsatian Wiki")
export default class AlsatianWikiEndToEndTests {

    private _driver: WebDriver;

    @AsyncSetup
    private async _goToWiki() {
        if (!this._driver) {
            this._driver = new Builder()
                .withCapabilities(Capabilities.chrome())
                .build();

            await this._driver.get("https://github.com/alsatian-test/alsatian/wiki");
        }
    }

    @AsyncTest("page title is Home")
    public async correctTitle() {
        const title = await this._driver.findElement(By.className("gh-header-title")).getText();

        Expect(title).toBe("Home");
    }

    @AsyncTest("everyone get's a nice welcome")
    public async checkContent() {
        const title = await this._driver.findElement(By.id("wiki-body")).getText();

        Expect(title).toContain("Welcome to the alsatian wiki!");
    }
}