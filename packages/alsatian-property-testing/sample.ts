import { TestFixture, TestProperties, Test, TestCases, Expect } from "alsatian";
import { Strings } from "./src/strings";

@TestFixture("property tests")
export class PropertyTests {
        
    @TestProperties(Strings.Below(10).generate(10000)())
    @Test()
    public test(testXd: string) {
        const x = testXd;
        const z = x;
        Expect(testXd.length).toBeGreaterThan(10);
    }
}


interface TestInterface {
    propOne: string,
    propTwo: string;
    propThree: number;
}
