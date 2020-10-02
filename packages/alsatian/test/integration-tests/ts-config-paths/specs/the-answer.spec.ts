import { theAnswer } from "@hitch-hikers/the-answer";
import { Expect, TestFixture, Test } from "alsatian";

@TestFixture("ts-config/paths")
export class TsConfigPathsTests {
    @Test("the answer can be referenced")
    public theAnswerIsReferenced() {
        Expect(theAnswer()).toBe(42);
    }
}
