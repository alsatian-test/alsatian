import * as path from "path";
import { FileRequirer, GlobHelper, TestLoader } from "./";
import { ITestFixture } from "./_interfaces";
import { findNearestFile } from "./utils/find-nearest-file";
import { registerTsNode } from "./utils/register-ts-node";

export class TestSet {
	public static async create(workingDirectory?: string): Promise<TestSet> {
		const fileRequirer = new FileRequirer();
		const testLoader = new TestLoader(fileRequirer);
		const globHelper = new GlobHelper();
		const testSet = new TestSet(testLoader, globHelper);

		const alsatianConfigPath = path.join(process.cwd(), await findNearestFile(".alsatianrc.json", workingDirectory) || "");
		

        if (alsatianConfigPath) {
            const alsatianConfig = await import(alsatianConfigPath);
            
            const root = alsatianConfigPath.split(/[\\/]/);
            root.pop();
			const rootPath = root.join("/");
			
			
		console.log("\n\n\nPATH FOUND!!!", path.join(rootPath, alsatianConfig.tsconfig), "\n\n\n");

            await registerTsNode(
                alsatianConfig.tsconfig ?
                path.join(rootPath, alsatianConfig.tsconfig) :
                await findNearestFile("tsconfig.json", workingDirectory)
            );
    
            const preTestScripts = ((alsatianConfig.preTestScripts || []) as string[]).map(script => path.join(rootPath, script));
    
			await Promise.all(preTestScripts.map(script => import(script)));
			
			alsatianConfig.specs.forEach((spec: string) => {      
				testSet.addTestsFromFiles(path.join(rootPath, spec));
			});
        }
        else {
            await registerTsNode(await findNearestFile("tsconfig.json", workingDirectory));
        }

		return testSet;
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
