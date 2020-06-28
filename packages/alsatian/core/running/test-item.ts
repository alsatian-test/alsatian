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
			await this._setup();

			try {
				await this._runTest(this.test.timeout || timeout);
			} catch (error) {
				throw error;
			} finally {
				await this._teardown();
			}
		}
	}

	private async _runTest(timeout: number) {
		return new Promise<any>(async (resolve, reject) => {
			const timeoutCheck = setTimeout(() => {
				reject(new TestTimeoutError(timeout));
			}, timeout);

			try {
				await this._execute();
				resolve();
			} catch (exception) {
				reject(exception);
			} finally {
				clearTimeout(timeoutCheck);
			}
		});
	}

	private async _execute() {
		return this.testFixture.fixture[this.test.key].apply(
			this.testFixture.fixture,
			this.testCase.caseArguments
		);
	}

	private async _setup() {
		await this._runFunctionsByMetaDataKey(METADATA_KEYS.SETUP);
	}

	private async _teardown() {
		await this._runFunctionsByMetaDataKey(METADATA_KEYS.TEARDOWN);
	}

	private async _runFunctionsByMetaDataKey(metadataKey: string) {
		const functions: Array<ISetupTeardownMetadata> = Reflect.getMetadata(
			metadataKey,
			this.testFixture.fixture
		);

		if (functions) {
			for (const func of functions) {
				await this._runFunctionFromMetadata(func);
			}
		}
	}

	private async _runFunctionFromMetadata(
		funcMetadata: ISetupTeardownMetadata
	) {
		await this.testFixture.fixture[funcMetadata.propertyKey].call(
			this.testFixture.fixture
		);
	}
}
