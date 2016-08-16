import { ITestFixture } from "./_interfaces/test-fixture.i";
import { ITest } from "./_interfaces/test.i";

export class TestFixture implements ITestFixture {

    fixture: { [id: string]: (...args: Array<any>) => any };
    ignored: boolean;
    focussed: boolean;
    tests: Array<ITest>;

    public addTest(test: ITest): void {

    }

    public getTests(): Array<ITest> {
        return [];
    }

}
