import { ITest, ITestCase, ITestFixture } from "../_interfaces";
import { METADATA_KEYS } from "../alsatian-core";
import { ISetupTeardownMetadata } from "../decorators/_interfaces";
import { TestTimeoutError } from "../errors";

export class TestItem {
	public constructor(
		public readonly testFixture: ITestFixture,
		public readonly test: ITest,
		public readonly testCase: ITestCase
	) {
		if (testFixture === null || testFixture === undefined) {
			throw new TypeError("testFixture must not be null or undefined.");
		}

		if (test === null || test === undefined) {
			throw new TypeError("test must not be null or undefined.");
		}

		if (testCase === null || testCase === undefined) {
			throw new TypeError("testCase must not be null or undefined.");
		}
	}

	public async run(timeout: number) {
		if (this.test.ignored) {
			return;
		} else {
			await this.setup();

			try {
				await this.runTest(this.test.timeout || timeout);
			} catch (error) {
				throw error;
			} finally {
				await this.teardown();
			}
		}
	}

	private async runTest(timeout: number) {
		return new Promise<any>(async (resolve, reject) => {
			const timeoutCheck = setTimeout(() => {
				reject(new TestTimeoutError(timeout));
			}, timeout);

			try {
				await this.execute();
				resolve();
			} catch (exception) {
				reject(exception);
			} finally {
				clearTimeout(timeoutCheck);
			}
		});
	}

	private async execute() {
		return this.testFixture.fixture[this.test.key].apply(
			this.testFixture.fixture,
			this.testCase.caseArguments
		);
	}

	private async setup() {
		await this.runFunctionsByMetaDataKey(METADATA_KEYS.SETUP);
	}

	private async teardown() {
		await this.runFunctionsByMetaDataKey(METADATA_KEYS.TEARDOWN);
	}

	private async runFunctionsByMetaDataKey(metadataKey: string) {
		const functions: Array<ISetupTeardownMetadata> = Reflect.getMetadata(
			metadataKey,
			this.testFixture.fixture
		);

		if (functions) {
			for (const func of functions) {
				await this.runFunctionFromMetadata(func);
			}
		}
	}

	private async runFunctionFromMetadata(
		funcMetadata: ISetupTeardownMetadata
	) {
		await this.testFixture.fixture[funcMetadata.propertyKey].call(
			this.testFixture.fixture
		);
	}
}
