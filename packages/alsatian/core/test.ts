import { ITest, ITestCase, ITestFixture } from "./_interfaces";
import { TestItem } from "./running";

export class Test implements ITest {
	public testCases: Array<ITestCase>;
	public ignored: boolean;
	public ignoreReason?: string;
	public fixture: ITestFixture;

	public focussed: boolean;
	public timeout: number;
	public key: string;
	public description: string;
	private args: Array<Generator<ITestCase, void, unknown>> = [];

	public addTestArguments(args: Generator<ITestCase, void, unknown>) {
		this.args.push(args);
	}

	public *testItems(): Iterable<TestItem> {
		for (const arg of this.args) {
			// TODO: make arg consistent for both test properties and test cases
			for (const a of arg) {
				yield new TestItem(this.fixture, this, a);
			}
		}
	}

	public static Build(test: ITest, fixture: ITestFixture) {
		const builtTest = new Test();
		builtTest.fixture = fixture;
		Object.keys(test).forEach(key => builtTest[key] = test[key]);

		return builtTest;
	}
 }
