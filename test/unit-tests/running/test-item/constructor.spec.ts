import { ITest, ITestCase, ITestFixture } from "../../../../core/_interfaces";
import { Expect, TestCase } from "../../../../core/alsatian-core";
import { TestItem } from "../../../../core/running/test-item";
import { TestBuilder } from "../../../builders/test-builder";
import { TestCaseBuilder } from "../../../builders/test-case-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";

export class TestItemConstructorTests {

    @TestCase(null)
    @TestCase(undefined)
    public nullOrUndefinedTestFixtureThrowsError(testFixture: ITestFixture) {
        const test = new TestBuilder().build();
        const testCase = new TestCaseBuilder().build();
        Expect(() => new TestItem(testFixture, test, testCase)).toThrowError(TypeError, "testFixture must not be null or undefined.");
    }

    @TestCase(null)
    @TestCase(undefined)
    public nullOrUndefinedTestThrowsError(test: ITest) {
        const testFixture = new TestFixtureBuilder().build();
        const testCase = new TestCaseBuilder().build();
        Expect(() => new TestItem(testFixture, test, testCase)).toThrowError(TypeError, "test must not be null or undefined.");
    }

    @TestCase(null)
    @TestCase(undefined)
    public nullOrUndefinedTestCaseThrowsError(testCase: ITestCase) {
        const testFixture = new TestFixtureBuilder().build();
        const test = new TestBuilder().build();
        Expect(() => new TestItem(testFixture, test, testCase)).toThrowError(TypeError, "testCase must not be null or undefined.");
    }
}