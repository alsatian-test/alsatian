import { ITest, ITestCase } from "./_interfaces";
import { TestItem } from "./running";

export class Test implements ITest {
	public testCases: Array<ITestCase>;
	public ignored: boolean;
	public ignoreReason?: string;

	public focussed: boolean;
	public timeout: number;
	public key: string;
	public description: string;
	private args: Array<Generator<ITestCase, void, unknown>> = [];

	// called from TestLoader
	public addTestArguments(args: Generator<ITestCase, void, unknown>) {
			this.args.push(args);
	}

	public *testItems(): Iterable<TestItem> {
			for (const arg of this.args) {
				for (const a of arg) {
				yield new TestItem(null, this, a);
				}
			}
	}
 }
