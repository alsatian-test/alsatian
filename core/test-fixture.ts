import { ITestFixture, ITest } from "./_interfaces";

export class TestFixture implements ITestFixture {

    fixture: { [id: string]: (...args: Array<any>) => any };

    ignored: boolean;
    ignoreReason: string;

    focussed: boolean;
    tests: Array<ITest>;
    description: string;

    constructor (description: string) {
        this.focussed = false;
        this.ignored = false;
        this.ignoreReason = undefined;
        this.fixture = {};
        this.tests = [];
        this.description = description;
    }

    public addTest(test: ITest): void {
        // if the test is already here, don't add it
        if (this.tests.indexOf(test) !== -1) {
            return;
        }

        this.tests.push(test);
    }

    public getTests(): Array<ITest> {
        let anyTestsFocussed = this.tests.filter(t => t.focussed).length > 0;

        // if there are no tests focussed, return them all
        if (!anyTestsFocussed) {
            return this.tests;
        }

        return this.tests.filter(t => t.focussed);
    }

}
