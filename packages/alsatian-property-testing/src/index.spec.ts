import { Test, TestFixture } from "alsatian";
import { Expect } from "../../alsatian/core/expect";
import { Integers as IndexIntegers } from "./";
import { Integers } from "./integers";

@TestFixture("index tests")
export class IndexTests {

    @Test("Integers is exported")
    public integersExported() {
        Expect(IndexIntegers).toBe(Integers);
    }
}
