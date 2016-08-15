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

@FocusTests
export class FocussedTestTests {

    @Test()
    public twoUnfocussedTestsBothRun() {
        let outputStream = new OutputStreamBuilder().build();
        SpyOn(outputStream, "write");

        let output = new TestOutput(outputStream);

        let testSet = <TestSet>{};
        (<any>testSet).testFixtures = [];
        let testFixtureBuilder = new TestFixtureBuilder()
            .withFixture({
                testOne: () => { },
                testTwo: () => { }
            });

        let testOne = new TestBuilder()
            .withKey("testOne")
            .withDescription("Test description one")
            .addTestCase(new TestCaseBuilder().build())
            .build();

        let testTwo = new TestBuilder()
            .withKey("testTwo")
            .withDescription("Another test description")
            .addTestCase(new TestCaseBuilder().build())
            .build();

        testFixtureBuilder.addTest(testOne);
        testFixtureBuilder.addTest(testTwo);

        testSet.testFixtures.push(testFixtureBuilder.build());

        let resultPromise = createPromise();

        let testRunner = new TestRunner(output);

        testRunner.run(testSet).then(() => {
            Expect(outputStream.write).toHaveBeenCalledWith(`ok 1 ${testOne.description}\n`);
            Expect(outputStream.write).toHaveBeenCalledWith(`ok 2 ${testTwo.description}\n`);
            resultPromise.resolve();
        });

        return resultPromise;
    }

    @Test()
    public firstTestFocussedSecondUnfocussedFirstIsRun() {
        let outputStream = new OutputStreamBuilder().build();
        SpyOn(outputStream, "write");

        let output = new TestOutput(outputStream);

        let testSet = <TestSet>{};
        (<any>testSet).testFixtures = [];
        let testFixtureBuilder = new TestFixtureBuilder()
            .withFixture({
                testOne: () => { },
                testTwo: () => { }
            });

        let testOne = new TestBuilder()
            .withKey("testOne")
            .withDescription("Test description one")
            .addTestCase(new TestCaseBuilder().build())
            .focussed()
            .build();

        let testTwo = new TestBuilder()
            .withKey("testTwo")
            .withDescription("Another test description")
            .addTestCase(new TestCaseBuilder().build())
            .build();

        testFixtureBuilder.addTest(testOne);
        testFixtureBuilder.addTest(testTwo);

        testSet.testFixtures.push(testFixtureBuilder.build());

        let resultPromise = createPromise();

        let testRunner = new TestRunner(output);

        testRunner.run(testSet).then(() => {
            Expect(outputStream.write).toHaveBeenCalledWith(`ok 1 ${testOne.description}\n`);
            Expect(outputStream.write).not.toHaveBeenCalledWith(`ok 2 ${testTwo.description}\n`);
            resultPromise.resolve();
        });

        return resultPromise;
    }

    @Test()
    public secondTestFocussedFirstUnfocussedFirstIsRun() {
        let outputStream = new OutputStreamBuilder().build();
        SpyOn(outputStream, "write");

        let output = new TestOutput(outputStream);

        let testSet = <TestSet>{};
        (<any>testSet).testFixtures = [];
        let testFixtureBuilder = new TestFixtureBuilder()
            .withFixture({
                testOne: () => { },
                testTwo: () => { }
            });

        let testOne = new TestBuilder()
            .withKey("testOne")
            .withDescription("Test description one")
            .addTestCase(new TestCaseBuilder().build())
            .build();

        let testTwo = new TestBuilder()
            .withKey("testTwo")
            .withDescription("Another test description")
            .addTestCase(new TestCaseBuilder().build())
            .focussed()
            .build();

        testFixtureBuilder.addTest(testOne);
        testFixtureBuilder.addTest(testTwo);

        testSet.testFixtures.push(testFixtureBuilder.build());

        let resultPromise = createPromise();

        let testRunner = new TestRunner(output);

        testRunner.run(testSet).then(() => {
            Expect(outputStream.write).not.toHaveBeenCalledWith(`ok 1 ${testOne.description}\n`);
            Expect(outputStream.write).toHaveBeenCalledWith(`ok 2 ${testTwo.description}\n`);
            resultPromise.resolve();
        });

        return resultPromise;
    }

}
