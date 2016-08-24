import { Expect, Test, TestCase, TestFixture } from "../../../core/alsatian-core";
import { TestBuilder } from "../../builders/test-builder";

export class GetTestsTests {

    @TestCase(1)
    @TestCase(2)
    @TestCase(3)
    public shouldReturnCorrectAmountWhenNoneFocussed(count: number) {
        let testFixture = new TestFixture("Unnamed Test Fixture");

        for (let i = 0; i < count; i++) {
            testFixture.addTest(
                new TestBuilder().build()
            );
        }

        Expect(
            testFixture.getTests().length
        ).toBe(count);
    }

    @Test()
    public shouldContainFocusedTest() {
        let testFixture = new TestFixture("Unnamed Test Fixture");

        let focussedTest = new TestBuilder()
            .focussed()
            .withKey("shouldContainFocusedTest_focussedTest")
            .build();

        let unfocussedTest = new TestBuilder()
            .withKey("shouldContainFocusedTest_unfocussedTest")
            .build();

        testFixture.addTest(focussedTest);
        testFixture.addTest(unfocussedTest);

        let tests = testFixture.getTests();

        Expect(tests).toContain(focussedTest);
    }

    @Test()
    public shouldNotContainUnfocusedTest() {
        let testFixture = new TestFixture("Unnamed Test Fixture");

        let focussedTest = new TestBuilder()
            .focussed()
            .withKey("shouldNotContainUnfocusedTest_focussedTest")
            .build();

        let unfocussedTest = new TestBuilder()
            .withKey("shouldNotContainUnfocusedTest_unfocussedTest")
            .build();

        testFixture.addTest(focussedTest);
        testFixture.addTest(unfocussedTest);

        let tests = testFixture.getTests();

        Expect(tests).not.toContain(unfocussedTest);
    }

}
