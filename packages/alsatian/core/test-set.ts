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

	public readonly testFixtures: Array<ITestFixture> = [];

	private testLoader: TestLoader;
	private globHelper: GlobHelper;

	public constructor(testLoader: TestLoader, globHelper: GlobHelper) {
		if (testLoader === null || testLoader === undefined) {
			throw new TypeError("testLoader must not be null or undefined.");
		}

		if (globHelper === null || globHelper === undefined) {
			throw new TypeError("globHelper must not be null or undefined.");
		}

		this.testLoader = testLoader;
		this.globHelper = globHelper;
	}

	public addTestsFromFiles(testsFileLocations: string | Array<string>) {
		let locationArray: Array<string>;

		if (typeof testsFileLocations === "string") {
			locationArray = [testsFileLocations];
		} else {
			locationArray = testsFileLocations;
		}

		this.loadTestFixtures(locationArray);
	}

	private loadTestFixtures(testFileLocations: Array<string>) {
		testFileLocations.forEach(testFileLocation => {
			testFileLocation = path.resolve(testFileLocation);

			if (this.globHelper.isGlob(testFileLocation)) {
				const physicalTestFileLocations = this.globHelper.resolve(
					testFileLocation
				);

				physicalTestFileLocations.forEach(physicalTestFileLocation => {
					this.testFixtures.push(...this.testLoader.loadTestFixture(
							physicalTestFileLocation
						)
					);
				});
			} else {
				this.testFixtures.push(...this.testLoader.loadTestFixture(testFileLocation));
			}
		});
	}
}
