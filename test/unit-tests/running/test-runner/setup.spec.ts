import { AsyncTest,
         Expect,
         FocusTests,
         FunctionSpy,
         METADATA_KEYS,
         SpyOn,
         TestCase,
         TestFixture } from "../../../../core/alsatian-core";
import { TestRunner } from "../../../../core/running/test-runner";
import { TestOutputStream } from "../../../../core/test-output-stream";
import { TestBuilder } from "../../../builders/test-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";
import { TestSetBuilder } from "../../../builders/test-set-builder";

@FocusTests
@TestFixture("setting up tests")
export class SetupTests {

    @AsyncTest("single setup function called")
    public async singleSetupFunctionCalled() {

        const test = new TestBuilder()
            .withTestCaseCount(1)
            .withKey("testFunction")
            .build();

        const fixtureObject = {
            setupFunction: (new FunctionSpy() as any),
            testFunction: () => { }
        };

        Reflect.defineMetadata(METADATA_KEYS.SETUP, [ {
            propertyKey: "setupFunction"
        }], fixtureObject);

        const testFixture = new TestFixtureBuilder()
            .withFixture(fixtureObject)
            .addTest(test)
            .build();

        const testSet = new TestSetBuilder()
            .addTestFixture(testFixture)
            .build();

        const outputStream = new TestOutputStream();
        SpyOn(outputStream, "push");

        const runner = new TestRunner(outputStream);

        await runner.run(testSet);

        Expect(fixtureObject.setupFunction).toHaveBeenCalled();
    }

    @TestCase(2)
    @TestCase(5)
    @AsyncTest("multiple setup function called")
    public async multipleSetupFunctionCalled(setupFunctionCount: number) {

        const test = new TestBuilder()
            .withTestCaseCount(1)
            .withKey("testFunction")
            .build();

        const fixtureObject: { [key: string]: any } = {
            testFunction: () => { }
        };

        const functionDetails = [];

        for (let i = 0; i < setupFunctionCount; i++) {
            const functionKey = "setupFunction" + i;
            fixtureObject[functionKey] = new FunctionSpy();

            functionDetails.push({
                propertyKey: functionKey
            });
        }

        Reflect.defineMetadata(METADATA_KEYS.SETUP, functionDetails, fixtureObject);

        const testFixture = new TestFixtureBuilder()
            .withFixture(fixtureObject)
            .addTest(test)
            .build();

        const testSet = new TestSetBuilder()
            .addTestFixture(testFixture)
            .build();

        const outputStream = new TestOutputStream();
        SpyOn(outputStream, "push");

        const runner = new TestRunner(outputStream);

        await runner.run(testSet);

        for (let i = 0; i < setupFunctionCount; i++) {
            Expect(fixtureObject["setupFunction" + i]).toHaveBeenCalled();
        }
    }
}