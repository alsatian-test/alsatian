import { TestRunner } from "../../../core/test-runner";
import { TestSet } from "../../../core/test-set";
import { TestOutput } from "../../../core/test-output";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";
import { TestBuilder } from "../../builders/test-builder";
import { TestCaseBuilder } from "../../builders/test-case-builder";
import { MatchError } from "../../../core/errors/match-error";
import { Expect, AsyncTest, Test, SpyOn, Setup, Teardown, FocusTest, IgnoreTest, FocusTests } from "../../../core/alsatian-core";
import { createPromise } from "../../../promise/create-promise";
import { OutputStreamBuilder } from "../../builders/output-stream-builder";

export class FocussedTestTests {

    @AsyncTest()
    public twoUnfocussedTestsBothRun() {
        let outputStream = new OutputStreamBuilder().build();
        SpyOn(outputStream, "write").andStub();

        let output = new TestOutput(outputStream);

        let testSet = <TestSet>{};
        (<any>testSet).testFixtures = [];

        let testOneExecuted = false;
        let testTwoExecuted = false;

        let testFixtureBuilder = new TestFixtureBuilder()
            .withFixture({
                testOne: () => { testOneExecuted = true; },
                testTwo: () => { testTwoExecuted = true; }
            });

        let testOne = new TestBuilder()
            .withKey("testOne")
            .addTestCase(new TestCaseBuilder().build())
            .build();

        let testTwo = new TestBuilder()
            .withKey("testTwo")
            .addTestCase(new TestCaseBuilder().build())
            .build();

        testFixtureBuilder.addTest(testOne);
        testFixtureBuilder.addTest(testTwo);

        testSet.testFixtures.push(testFixtureBuilder.build());

        let resultPromise = createPromise();

        let testRunner = new TestRunner(output);

        testRunner.run(testSet).then(() => {
            Expect(testOneExecuted).toBe(true);
            Expect(testTwoExecuted).toBe(true);
            resultPromise.resolve();
        });

        return resultPromise;
    }

    @AsyncTest()
    public firstTestFocussedSecondUnfocussedFirstIsRun() {
        let outputStream = new OutputStreamBuilder().build();
        SpyOn(outputStream, "write").andStub();

        let output = new TestOutput(outputStream);

        let testSet = <TestSet>{};
        (<any>testSet).testFixtures = [];

        let testOneExecuted = false;
        let testTwoExecuted = false;

        let testFixtureBuilder = new TestFixtureBuilder()
            .withFixture({
                testOne: () => { testOneExecuted = true; },
                testTwo: () => { testTwoExecuted = true; }
            });

        let testOne = new TestBuilder()
            .withKey("testOne")
            .addTestCase(new TestCaseBuilder().build())
            .focussed()
            .build();

        let testTwo = new TestBuilder()
            .withKey("testTwo")
            .addTestCase(new TestCaseBuilder().build())
            .build();

        testFixtureBuilder.addTest(testOne);
        testFixtureBuilder.addTest(testTwo);

        testSet.testFixtures.push(testFixtureBuilder.build());

        let resultPromise = createPromise();

        let testRunner = new TestRunner(output);

        testRunner.run(testSet).then(() => {
            Expect(testOneExecuted).toBe(true);
            Expect(testTwoExecuted).toBe(false);
            resultPromise.resolve();
        });

        return resultPromise;
    }

    @AsyncTest()
    public secondTestFocussedFirstUnfocussedFirstIsRun() {
        let outputStream = new OutputStreamBuilder().build();
        SpyOn(outputStream, "write").andStub();

        let output = new TestOutput(outputStream);

        let testSet = <TestSet>{};
        (<any>testSet).testFixtures = [];

        let testOneExecuted = false;
        let testTwoExecuted = false;

        let testFixtureBuilder = new TestFixtureBuilder()
            .withFixture({
                testOne: () => { testOneExecuted = true; },
                testTwo: () => { testTwoExecuted = true; }
            });

        let testOne = new TestBuilder()
            .withKey("testOne")
            .addTestCase(new TestCaseBuilder().build())
            .build();

        let testTwo = new TestBuilder()
            .withKey("testTwo")
            .addTestCase(new TestCaseBuilder().build())
            .focussed()
            .build();

        testFixtureBuilder.addTest(testOne);
        testFixtureBuilder.addTest(testTwo);

        testSet.testFixtures.push(testFixtureBuilder.build());

        let resultPromise = createPromise();

        let testRunner = new TestRunner(output);

        testRunner.run(testSet).then(() => {
            Expect(testOneExecuted).toBe(false);
            Expect(testTwoExecuted).toBe(true);
            resultPromise.resolve();
        });

        return resultPromise;
    }

}
