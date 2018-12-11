import * as path from "path";
import { FileRequirer, GlobHelper, TestLoader } from "./";
import { ITestFixture } from "./_interfaces";

export class TestSet {
	public static create(): TestSet {
		const fileRequirer = new FileRequirer();
		const testLoader = new TestLoader(fileRequirer);
		const globHelper = new GlobHelper();
		return new TestSet(testLoader, globHelper);
	}

	private _testLoader: TestLoader;
	private _globHelper: GlobHelper;

	private _testFixtures: Array<ITestFixture> = [];

	public get testFixtures(): Array<ITestFixture> {
		return this._testFixtures;
	}

	public constructor(testLoader: TestLoader, globHelper: GlobHelper) {
		if (testLoader === null || testLoader === undefined) {
			throw new TypeError("testLoader must not be null or undefined.");
		}

		if (globHelper === null || globHelper === undefined) {
			throw new TypeError("globHelper must not be null or undefined.");
		}

		this._testLoader = testLoader;
		this._globHelper = globHelper;
	}

	public addTestsFromFiles(testsFileLocations: string | Array<string>) {
		let locationArray: Array<string>;

		if (typeof testsFileLocations === "string") {
			locationArray = [testsFileLocations];
		} else {
			locationArray = testsFileLocations;
		}

		this._loadTestFixtures(locationArray);
	}

	private _loadTestFixtures(testFileLocations: Array<string>) {
		testFileLocations.forEach(testFileLocation => {
			testFileLocation = path.resolve(testFileLocation);

			if (this._globHelper.isGlob(testFileLocation)) {
				const physicalTestFileLocations = this._globHelper.resolve(
					testFileLocation
				);

				physicalTestFileLocations.forEach(physicalTestFileLocation => {
					this._testFixtures = this.testFixtures.concat(
						this._testLoader.loadTestFixture(
							physicalTestFileLocation
						)
					);
				});
			} else {
				this._testFixtures = this.testFixtures.concat(
					this._testLoader.loadTestFixture(testFileLocation)
				);
			}
		});
	}
}
